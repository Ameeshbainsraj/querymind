import { useState } from 'react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, ArcElement, Title, Tooltip, Legend
} from 'chart.js'
import { Bar, Line, Pie } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend)

const PALETTE = [
  '#01696f','#4f98a3','#437a22','#6daa45','#964219',
  '#bb653b','#7a39bb','#a86fdf','#a13544','#dd6974'
]

export default function AnswerCard({ data }) {
  const [showCode, setShowCode] = useState(false)
  const { question, answer, code, chart, chart_data } = data

  const chartConfig = chart_data && chart ? {
    labels: chart_data.labels,
    datasets: [{
      label: chart.y || 'Value',
      data: chart_data.values,
      backgroundColor: chart.type === 'pie'
        ? PALETTE.slice(0, chart_data.labels.length)
        : 'color-mix(in oklch, #01696f 70%, transparent)',
      borderColor: chart.type === 'line' ? '#01696f' : undefined,
      borderWidth: chart.type === 'line' ? 2 : 0,
      borderRadius: chart.type === 'bar' ? 4 : undefined,
    }]
  } : null

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: chart?.type === 'pie' },
      title: { display: !!chart?.title, text: chart?.title }
    },
    scales: chart?.type === 'pie' ? {} : {
      x: { grid: { display: false } },
      y: { grid: { color: 'oklch(0.2 0.01 80 / 0.06)' } }
    }
  }

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Question */}
      <div style={{
        padding: 'var(--space-4) var(--space-5)',
        borderBottom: '1px solid var(--color-divider)',
        background: 'var(--color-surface-offset)'
      }}>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', fontWeight: 500, marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Question
        </p>
        <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{question}</p>
      </div>

      {/* Answer */}
      <div style={{ padding: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 'var(--radius-full)', flexShrink: 0,
            background: 'var(--color-primary-hl)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
          </div>
          <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.7 }}>{answer}</p>
        </div>

        {/* Chart */}
        {chartConfig && (
          <div style={{ marginBottom: 'var(--space-5)', maxHeight: 320 }}>
            {chart.type === 'bar' && <Bar data={chartConfig} options={chartOptions} />}
            {chart.type === 'line' && <Line data={chartConfig} options={chartOptions} />}
            {chart.type === 'pie' && <Pie data={chartConfig} options={chartOptions} />}
          </div>
        )}

        {/* Code toggle */}
        {code && (
          <div>
            <button
              onClick={() => setShowCode(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)',
                padding: 'var(--space-2) var(--space-3)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-surface-offset)'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
              </svg>
              {showCode ? 'Hide Pandas code' : 'View Pandas code'}
            </button>
            {showCode && (
              <pre style={{
                marginTop: 'var(--space-3)',
                background: 'var(--color-code-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4)',
                fontSize: 'var(--text-xs)',
                lineHeight: 1.7,
                overflowX: 'auto',
                color: 'var(--color-text-muted)',
                fontFamily: "'Fira Code', 'Consolas', monospace"
              }}>
                <code>{code}</code>
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  )
}