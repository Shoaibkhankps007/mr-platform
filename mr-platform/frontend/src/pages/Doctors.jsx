import { useEffect, useState } from 'react'
import client from '../api/client'

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [territories, setTerritories] = useState([])
  const [form, setForm] = useState({
    name: '', specialization: '', hospitalOrPharmacy: '', phone: '', address: '',
    latitude: '', longitude: '', territoryId: '', consentOnFile: false,
  })
  const [error, setError] = useState('')

  function load() {
    client.get('/api/doctors').then((res) => setDoctors(res.data))
    client.get('/api/territories').then((res) => setTerritories(res.data))
  }

  useEffect(load, [])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    try {
      await client.post('/api/doctors', {
        name: form.name,
        specialization: form.specialization,
        hospitalOrPharmacy: form.hospitalOrPharmacy,
        phone: form.phone,
        address: form.address,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        territory: { id: parseInt(form.territoryId, 10) },
        consentOnFile: form.consentOnFile,
      })
      setForm({ name: '', specialization: '', hospitalOrPharmacy: '', phone: '', address: '', latitude: '', longitude: '', territoryId: '', consentOnFile: false })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create HCP record.')
    }
  }

  return (
    <div>
      <div className="eyebrow">Epic 2</div>
      <h1 className="font-display text-3xl mt-1 mb-6">HCP Directory</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left">
                <th className="eyebrow px-4 py-3">Name</th>
                <th className="eyebrow px-4 py-3">Specialization</th>
                <th className="eyebrow px-4 py-3">Territory</th>
                <th className="eyebrow px-4 py-3">Consent</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((d) => (
                <tr key={d.id} className="border-b border-ink-50 last:border-0">
                  <td className="px-4 py-3 font-medium">{d.name}</td>
                  <td className="px-4 py-3 text-ink-400">{d.specialization}</td>
                  <td className="px-4 py-3 text-ink-400">{d.territory?.name}</td>
                  <td className="px-4 py-3">
                    <span className={`label-chip ${d.consentOnFile ? 'text-clinical-teal border-clinical-teal/40' : 'text-clinical-red border-clinical-red/40'}`}>
                      {d.consentOnFile ? 'ON FILE' : 'MISSING'}
                    </span>
                  </td>
                </tr>
              ))}
              {doctors.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-ink-400 text-sm">No HCPs yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card p-5 h-fit">
          <div className="eyebrow mb-4">Add HCP</div>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="field-label">Name</label>
              <input className="field-input" value={form.name} onChange={(e) => update('name', e.target.value)} required />
            </div>
            <div>
              <label className="field-label">Specialization</label>
              <input className="field-input" value={form.specialization} onChange={(e) => update('specialization', e.target.value)} />
            </div>
            <div>
              <label className="field-label">Hospital / Pharmacy</label>
              <input className="field-input" value={form.hospitalOrPharmacy} onChange={(e) => update('hospitalOrPharmacy', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">Latitude</label>
                <input className="field-input" value={form.latitude} onChange={(e) => update('latitude', e.target.value)} placeholder="20.2961" />
              </div>
              <div>
                <label className="field-label">Longitude</label>
                <input className="field-input" value={form.longitude} onChange={(e) => update('longitude', e.target.value)} placeholder="85.8245" />
              </div>
            </div>
            <div>
              <label className="field-label">Territory</label>
              <select className="field-input" value={form.territoryId} onChange={(e) => update('territoryId', e.target.value)} required>
                <option value="">Select…</option>
                {territories.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.consentOnFile} onChange={(e) => update('consentOnFile', e.target.checked)} />
              Consent form on file
            </label>
            {error && <div className="text-xs text-clinical-red">{error}</div>}
            <button className="btn-primary w-full" type="submit">Add HCP</button>
          </form>
        </div>
      </div>
    </div>
  )
}
