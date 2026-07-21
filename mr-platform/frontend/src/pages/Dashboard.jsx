import { useEffect, useState } from 'react'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'

function StatCard({ eyebrow, value, suffix, tone = 'ink' }) {
  const toneClass = tone === 'teal' ? 'text-clinical-teal' : tone === 'amber' ? 'text-clinical-amber' : 'text-ink'
  return (
    <div className="card p-5">
      <div className="eyebrow">{eyebrow}</div>
      <div className={`font-display text-4xl mt-2 ${toneClass}`}>
        {value}
        {suffix && <span className="text-lg font-body text-ink-400 ml-1">{suffix}</span>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    client
      .get('/api/dashboard/summary')
      .then((res) => setSummary(res.data))
      .catch(() => setError('Could not load dashboard summary.'))
  }, [])

  return (
    <div>
      <div className="mb-8">
        <div className="eyebrow">Overview</div>
        <h1 className="font-display text-3xl mt-1">Welcome back, {user?.name?.split(' ')[0]}</h1>
      </div>

      {error && <div className="text-clinical-red text-sm mb-6">{error}</div>}

      {!summary && !error && <div className="text-ink-400 text-sm font-mono">Loading…</div>}

      {summary && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard eyebrow="Visits today" value={summary.totalVisitsToday} tone="teal" />
            <StatCard eyebrow="Visits this month" value={summary.totalVisitsThisMonth} />
            <StatCard eyebrow="Doctor reach" value={summary.doctorReachPercent} suffix="%" tone="teal" />
            <StatCard eyebrow="Order value (mo.)" value={`₹${summary.totalOrderValueThisMonth}`} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-5">
              <div className="eyebrow mb-4">Calls by representative — this month</div>
              {Object.keys(summary.visitsByRepresentative).length === 0 && (
                <div className="text-sm text-ink-400">No visits logged yet.</div>
              )}
              <div className="space-y-3">
                {Object.entries(summary.visitsByRepresentative).map(([name, count]) => (
                  <div key={name} className="flex items-center gap-3">
                    <div className="w-32 text-sm truncate">{name}</div>
                    <div className="flex-1 h-2 bg-ink-50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-clinical-teal rounded-full"
                        style={{ width: `${Math.min(100, count * 20)}%` }}
                      />
                    </div>
                    <div className="font-mono text-xs text-ink-400 w-6 text-right">{count}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <div className="eyebrow mb-4">Stock depletion alerts</div>
              {summary.lowStockAlerts.length === 0 && (
                <div className="text-sm text-ink-400">All products above reorder threshold.</div>
              )}
              <div className="space-y-2">
                {summary.lowStockAlerts.map((a) => (
                  <div
                    key={a.productName}
                    className="flex items-center justify-between border border-clinical-amber/30 bg-clinical-amber/5 rounded-sm px-3 py-2"
                  >
                    <span className="text-sm">{a.productName}</span>
                    <span className="font-mono text-xs text-clinical-amber">
                      {a.stockOnHand} / {a.reorderThreshold} units
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
