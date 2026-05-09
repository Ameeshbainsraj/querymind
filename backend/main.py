from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import io
import json
import re
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="QueryMind API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# In-memory store — one dataset per server session
dataset_store = {"df": None, "filename": "", "columns": [], "preview": []}


@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    """Upload a CSV and return its schema + preview."""
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted.")

    content = await file.read()
    try:
        df = pd.read_csv(io.StringIO(content.decode("utf-8")))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not parse CSV: {str(e)}")

    dataset_store["df"] = df
    dataset_store["filename"] = file.filename

    columns_info = []
    for col in df.columns:
        dtype = str(df[col].dtype)
        sample = df[col].dropna().head(3).tolist()
        columns_info.append({"name": col, "type": dtype, "sample": sample})

    dataset_store["columns"] = columns_info
    dataset_store["preview"] = df.head(5).fillna("").to_dict(orient="records")

    return {
        "filename": file.filename,
        "rows": len(df),
        "columns": columns_info,
        "preview": dataset_store["preview"],
    }


class QuestionRequest(BaseModel):
    question: str


@app.post("/ask")
async def ask_question(req: QuestionRequest):
    """Ask a plain-English question about the uploaded dataset."""
    df = dataset_store.get("df")
    if df is None:
        raise HTTPException(status_code=400, detail="No dataset uploaded yet.")

    # Build schema description for Claude
    schema_lines = []
    for col in dataset_store["columns"]:
        schema_lines.append(
            f"  - {col['name']} ({col['type']}) — sample values: {col['sample']}"
        )
    schema_str = "\n".join(schema_lines)
    stats_str = df.describe(include="all").fillna("").to_string()
    system_prompt = f"""You are a friendly data analyst explaining findings to a non-technical business person.
    The user uploaded a CSV with this schema:

    {schema_str}

    Summary statistics:
    {stats_str}

    Rules for your answer:
    - Start with ONE clear sentence that directly answers the question
    - Use simple everyday language — no jargon, no technical terms
    - If there are numbers, round them to 2 decimal places maximum
    - Use bullet points if listing multiple things (max 5 bullets)
    - End with ONE short insight or observation about what the number means
    - Keep the total answer under 4 sentences or 5 bullet points

    Example of a BAD answer:
    "The aggregated mean value of the salary column grouped by the department categorical variable yields the following results..."

    Example of a GOOD answer:
    "Engineering pays the most on average at €85,000, while HR pays the least at €48,000.
    • Engineering: €85,000
    • Finance: €72,000
    • Marketing: €62,000
    The salary gap between the highest and lowest department is €37,000."

    Instructions:
    1. Write valid Python/Pandas code to answer the question (use variable `df`)
    2. Store the final result in a variable called `result` (DataFrame or Series)
    3. Return ONLY raw JSON — no markdown fences — in this exact structure:
    {{
    "answer": "<your clean, simple answer>",
    "code": "<pandas code that computes result>",
    "chart": {{
        "type": "bar" | "line" | "pie" | "scatter" | null,
        "x": "<column for x-axis/labels>",
        "y": "<column for y-axis/values>",
        "title": "<short plain-English chart title>"
    }}
    }}

    If a chart would not add value, set chart to null.
    Always include the actual numbers from the data in your answer."""
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",   # fast, smart, free
        max_tokens=1024,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": req.question},
        ],
    )

    raw = response.choices[0].message.content.strip()
    # Strip markdown code fences if Claude adds them anyway
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)

    try:
        result = json.loads(raw)
    except json.JSONDecodeError:
        return {"answer": raw, "code": "", "chart": None, "chart_data": None}

    chart_data = None
    code = result.get("code", "")
    chart_meta = result.get("chart")

    if code:
        try:
            local_vars = {"df": df, "pd": pd}
            exec(code, {"pd": pd}, local_vars)

            computed = local_vars.get("result", None)

            if computed is not None and chart_meta:
                if isinstance(computed, pd.DataFrame):
                    chart_data = {
                        "labels": computed.iloc[:, 0].astype(str).tolist(),
                        "values": pd.to_numeric(computed.iloc[:, 1], errors="coerce").tolist(),
                    }
                elif isinstance(computed, pd.Series):
                    chart_data = {
                        "labels": computed.index.astype(str).tolist(),
                        "values": pd.to_numeric(computed, errors="coerce").tolist(),
                    }
        except Exception as e:
            result["answer"] += f" (Note: chart could not be generated — {str(e)})"

    return {
        "answer": result.get("answer", ""),
        "code": code,
        "chart": chart_meta,
        "chart_data": chart_data,
    }


@app.get("/dataset/info")
async def dataset_info():
    df = dataset_store.get("df")
    if df is None:
        return {"loaded": False}
    return {
        "loaded": True,
        "filename": dataset_store["filename"],
        "rows": len(df),
        "columns": dataset_store["columns"],
        "preview": dataset_store["preview"],
    }


@app.get("/health")
async def health():
    return {"status": "ok"}