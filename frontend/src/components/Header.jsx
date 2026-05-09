export default function Header({ theme, onToggleTheme }) {
  return (
    <header style={{
      background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      padding: 'var(--space-3) var(--space-6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {/* SVG Logo */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-label="QueryMind logo">
          <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
          <circle cx="13" cy="13" r="6" stroke="white" strokeWidth="2.5" fill="none" />
          <line x1="17.5" y1="17.5" x2="24" y2="24" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="13" cy="13" r="2" fill="white" />
        </svg>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--color-text)' }}>
          QueryMind
        </span>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', marginLeft: 'var(--space-1)' }}>
          AI Data Q&A
        </span>
      </div>
      <button
        onClick={onToggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        style={{
          padding: 'var(--space-2)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-text-muted)',
          display: 'flex', alignItems: 'center'
        }}
      >
        {theme === 'dark' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>
    </header>
  )
}