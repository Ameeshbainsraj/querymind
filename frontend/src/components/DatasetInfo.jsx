export default function DatasetInfo({ dataset, onReset }) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 'var(--space-4)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <div>
          <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{dataset.filename}</p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
            {dataset.rows?.toLocaleString()} rows · {dataset.columns?.length} columns
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        {dataset.columns?.slice(0, 5).map(col => (
          <span key={col.name} style={{
            fontSize: 'var(--text-xs)', padding: '2px 10px',
            background: 'var(--color-surface-offset)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)'
          }}>
            {col.name}
          </span>
        ))}
        {dataset.columns?.length > 5 && (
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', padding: '2px 6px' }}>
            +{dataset.columns.length - 5} more
          </span>
        )}
      </div>
      <button onClick={onReset} style={{
        fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', padding: 'var(--space-2) var(--space-3)',
        border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
        background: 'var(--color-surface-offset)'
      }}>
        Upload new file
      </button>
    </div>
  )
}