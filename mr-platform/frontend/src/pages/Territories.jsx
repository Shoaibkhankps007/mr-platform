import { useEffect, useState } from 'react'
import client from '../api/client'

export default function Territories() {
  const [territories, setTerritories] = useState([])
  const [name, setName] = useState('')
  const [region, setRegion] = useState('')
  const [error, setError] = useState('')

  function load() {
    client.get('/api/territories').then((res) => setTerritories(res.data))
  }

  useEffect(load, [])

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    try {
      await client.post('/api/territories', { name, region })
      setName('')
      setRegion('')
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create territory (admin/manager only).')
    }
  }

  return (
    <div>
      <div className="eyebrow">Epic 2</div>
      <h1 className="font-display text-3xl mt-1 mb-6">Territory Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left">
                <th className="eyebrow px-4 py-3">Territory</th>
                <th className="eyebrow px-4 py-3">Region</th>
                <th className="eyebrow px-4 py-3">Manager</th>
              </tr>
            </thead>
            <tbody>
              {territories.map((t) => (
                <tr key={t.id} className="border-b border-ink-50 last:border-0">
                  <td className="px-4 py-3 font-medium">{t.name}</td>
                  <td className="px-4 py-3 text-ink-400">{t.region}</td>
                  <td className="px-4 py-3 font-mono text-xs text-ink-400">
                    {t.manager?.name || '—'}
                  </td>
                </tr>
              ))}
              {territories.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-ink-400 text-sm">
                    No territories yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card p-5 h-fit">
          <div className="eyebrow mb-4">Add territory</div>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="field-label">Name</label>
              <input className="field-input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="field-label">Region</label>
              <input className="field-input" value={region} onChange={(e) => setRegion(e.target.value)} required />
            </div>
            {error && <div className="text-xs text-clinical-red">{error}</div>}
            <button className="btn-primary w-full" type="submit">Create</button>
          </form>
        </div>
      </div>
    </div>
  )
}
