import { useState, useRef } from 'react'

export default function UploadZone({ onUpload, loading }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onUpload(file)
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: 'var(--space-16)' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
          Ask questions about your data
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-base)', maxWidth: '45ch', margin: '0 auto' }}>
          Upload a CSV file, then ask anything in plain English. QueryMind uses AI + Pandas to give you real answers with charts.
        </p>
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
        aria-label="Upload CSV file"
        style={{
          border: `2px dashed ${dragging ? 'var(--color-primary)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-12) var(--space-8)',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragging
            ? 'color-mix(in oklch, var(--color-primary) 6%, var(--color-surface))'
            : 'var(--color-surface)',
          transition: 'all var(--transition)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <input ref={inputRef} type="file" accept=".csv" style={{ display: 'none' }}
          onChange={e => e.target.files[0] && onUpload(e.target.files[0])} />

        {loading ? (
          <div style={{ color: 'var(--color-primary)' }}>
            <div className="spinner" style={{
              width: 32, height: 32, margin: '0 auto var(--space-3)',
              border: '3px solid var(--color-primary-hl)',
              borderTop: '3px solid var(--color-primary)',
              borderRadius: '50%', animation: 'spin 0.8s linear infinite'
            }} />
            <p style={{ fontWeight: 500 }}>Analysing your dataset…</p>
          </div>
        ) : (
          <>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-faint)"
              strokeWidth="1.5" style={{ margin: '0 auto var(--space-4)' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <p style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>Drop your CSV here</p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              or <span style={{ color: 'var(--color-primary)', fontWeight: 500 }}>click to browse</span>
            </p>
          </>
        )}
      </div>

      <div style={{ marginTop: 'var(--space-8)', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', border: '1px solid var(--color-border)' }}>
        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-3)', color: 'var(--color-text-muted)' }}>
          TRY QUESTIONS LIKE
        </p>
        {[
          '"What is the average salary by department?"',
          '"Show me the top 5 products by revenue"',
          '"How many records are in each category?"',
          '"What is the total sales per month?"',
        ].map(q => (
          <p key={q} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', padding: 'var(--space-1) 0', fontStyle: 'italic' }}>
            {q}
          </p>
        ))}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}