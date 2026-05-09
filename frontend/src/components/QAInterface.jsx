import { useState } from 'react'
import AnswerCard from './AnswerCard.jsx'

const SUGGESTED = [
  'What is the average value per category?',
  'Show me the top 10 rows by the largest numeric column',
  'How many records are in each group?',
  'What are the min, max and mean of all numeric columns?',
]

export default function QAInterface({ apiBase }) {
  const [question, setQuestion] = useState('')
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleAsk(q) {
    const text = (q || question).trim()
    if (!text) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${apiBase}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Request failed')
      }
      const data = await res.json()
      setAnswers(prev => [{ question: text, ...data, id: Date.now() }, ...prev])
      setQuestion('')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Question input */}
      <div style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && handleAsk()}
            placeholder="Ask anything about your data… e.g. 'What's the average salary by department?'"
            style={{
              flex: 1, padding: 'var(--space-3) var(--space-4)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-surface-2)',
              fontSize: 'var(--text-sm)',
              outline: 'none'
            }}
            aria-label="Ask a question about your data"
          />
          <button
            onClick={() => handleAsk()}
            disabled={loading || !question.trim()}
            style={{
              padding: 'var(--space-3) var(--space-6)',
              background: loading || !question.trim() ? 'var(--color-surface-offset)' : 'var(--color-primary)',
              color: loading || !question.trim() ? 'var(--color-text-faint)' : 'white',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 600, fontSize: 'var(--text-sm)',
              cursor: loading || !question.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Thinking…' : 'Ask'}
          </button>
        </div>

        {/* Suggested questions */}
        {answers.length === 0 && (
          <div style={{ marginTop: 'var(--space-3)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {SUGGESTED.map(q => (
              <button key={q} onClick={() => handleAsk(q)} style={{
                fontSize: 'var(--text-xs)', padding: 'var(--space-2) var(--space-3)',
                background: 'var(--color-surface-offset)', border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-full)', color: 'var(--color-text-muted)',
                cursor: 'pointer'
              }}>
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-3)' }}>
          ⚠ {error}
        </p>
      )}

      {/* Answer history */}
      <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {answers.map(a => <AnswerCard key={a.id} data={a} />)}
      </div>
    </div>
  )
}