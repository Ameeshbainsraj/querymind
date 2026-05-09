import { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import UploadZone from './components/UploadZone.jsx'
import DatasetInfo from './components/DatasetInfo.jsx'
import QAInterface from './components/QAInterface.jsx'
import './App.css'

const API = 'https://querymind-production-c849.up.railway.app/'

export default function App() {
  const [theme, setTheme] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )
  const [dataset, setDataset] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    fetch(`${API}/dataset/info`)
      .then(r => r.json())
      .then(d => { if (d.loaded) setDataset(d) })
      .catch(() => {})
  }, [])

  async function handleUpload(file) {
    setLoading(true)
    setError('')
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch(`${API}/upload`, { method: 'POST', body: formData })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Upload failed')
      }
      const data = await res.json()
      setDataset(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-layout">
      <Header theme={theme} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />
      <main className="main-content">
        {error && (
          <div className="error-banner" role="alert">
            <span>⚠ {error}</span>
            <button onClick={() => setError('')} aria-label="Dismiss">✕</button>
          </div>
        )}
        {!dataset ? (
          <UploadZone onUpload={handleUpload} loading={loading} />
        ) : (
          <div className="workspace">
            <DatasetInfo dataset={dataset} onReset={() => setDataset(null)} />
            <QAInterface apiBase={API} />
          </div>
        )}
      </main>
    </div>
  )
}