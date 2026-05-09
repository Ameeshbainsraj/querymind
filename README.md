# QueryMind — AI-Powered Data Q&A App

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-2.2-150458?logo=pandas&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_API-Llama_3.3_70B-F55036?logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)

> Upload any CSV. Ask questions in plain English. Get instant answers with charts — powered by AI.

**Live Demo:** [your-vercel-link-here.vercel.app](https://querymind-neon.vercel.app/)

---

## What It Does

QueryMind lets you talk to your data. Upload a CSV and ask things like:

- *"What is the average salary by department?"*
- *"Which product has the highest revenue?"*
- *"How many records are in each category?"*
- *"Show me the sales trend over time"*

The app uses Groq's Llama 3.3 70B model to translate your question into a Pandas query, runs it on your data, and returns a plain-English answer plus an auto-generated chart.

---

## Screenshots

> *(Add a screenshot here after deployment — drag and drop an image into GitHub when editing the README)*

---

## Features

- Drag-and-drop CSV upload with instant schema detection
- Natural language → Pandas query translation via Groq API
- Auto-generated bar, line, and pie charts via Chart.js
- "View Pandas code" toggle — see exactly what ran on your data
- Full question history in the session
- Light and dark mode
- Fully responsive on mobile and desktop

---

## How It Works
User uploads CSV
↓
FastAPI reads it with Pandas → extracts column names, types, sample values
↓
User asks a plain-English question
↓
Schema (not raw data) + question sent to Groq API
↓
Groq returns JSON with: plain-English answer + Pandas code + chart config
↓
Pandas code runs server-side on the real dataframe
↓
Answer + chart data sent back to React
↓
Chart.js renders the visualisation

text

**Why send the schema and not the raw data?**
Sending 50,000 rows to an AI is slow, expensive, and hits token limits. Instead we describe the *shape* of the data — column names, types, a few sample values — and the AI writes code. That code runs on the full dataset. This is the same approach used by Tableau AI and Power BI Copilot.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React 18 + Vite | Fast, component-based UI |
| Charts | Chart.js + react-chartjs-2 | Industry standard for data viz |
| Backend | Python + FastAPI | High-performance async API |
| Data Processing | Pandas 2.2 | The #1 data analysis library |
| AI | Groq API (Llama 3.3 70B) | Fast, free LLM inference |
| Frontend Deploy | Vercel | Instant static hosting |
| Backend Deploy | Render | Free Python server hosting |

---

## Analytics Concepts Demonstrated

| Concept | How It's Used |
|---------|--------------|
| **Aggregation** | `.groupby().mean()`, `.sum()`, `.count()` |
| **Filtering** | Boolean indexing, `.query()` |
| **Sorting** | `.sort_values()`, `.nlargest()` |
| **Data Profiling** | Automatic type detection, `.describe()` |
| **NL-to-Query** | Schema-aware LLM prompting |
| **API Integration** | Structured JSON output from Groq REST API |

---

## Local Setup

### Prerequisites
- Python 3.10+
- Node.js 20.19+
- Free [Groq API key](https://console.groq.com) — no credit card needed

### 1. Clone the repo
```bash
git clone https://github.com/Ameeshbainsraj/project2-querymind.git
cd project2-querymind
```

### 2. Run the backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
echo "GROQ_API_KEY=your_key_here" > .env
uvicorn main:app --reload
# Runs at http://localhost:8000
```

### 3. Run the frontend
```bash
cd frontend
npm install
npm run dev
# Runs at http://localhost:5173
```

---

## Project Structure
project2-querymind/
├── backend/
│ ├── main.py # FastAPI — upload, ask, dataset info endpoints
│ ├── requirements.txt # Python dependencies
│ └── .env # GROQ_API_KEY (not committed)
├── frontend/
│ ├── src/
│ │ ├── App.jsx # Root component
│ │ ├── App.css # Layout styles
│ │ ├── index.css # Design tokens, light/dark mode
│ │ └── components/
│ │ ├── Header.jsx # Nav bar + theme toggle
│ │ ├── UploadZone.jsx # Drag-and-drop upload
│ │ ├── DatasetInfo.jsx # Dataset summary bar
│ │ ├── QAInterface.jsx # Question input + history
│ │ └── AnswerCard.jsx # Answer + chart + code toggle
│ ├── vite.config.js
│ └── package.json
├── .gitignore
└── README.md

text

---

## Part of My Data Analytics Portfolio

This is **Project 2 of 5** in my data analytics portfolio.

| # | Project | Tech | Status |
|---|---------|------|--------|
| 1 | [DataLens — CSV Analytics Dashboard](https://github.com/Ameeshbainsraj) | HTML, Chart.js, PapaParse | ✅ Live |
| 2 | **QueryMind — AI Data Q&A** | React, FastAPI, Pandas, Groq | ✅ Live |
| 3 | SQL Query Builder & Visualiser | React, Node.js, SQLite, D3.js | 🔨 Coming soon |
| 4 | Sales KPI Dashboard | React, Recharts, MongoDB | 🔨 Coming soon |
| 5 | Predictive Analytics App | React, FastAPI, Scikit-learn | 🔨 Coming soon |

---

## Licence
MIT