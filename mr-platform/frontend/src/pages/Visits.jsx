import { useEffect, useState } from 'react'
import client from '../api/client'

function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported by this browser'))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 })
  })
}

export default function Visits() {
  const [doctors, setDoctors] = useState([])
  const [products, setProducts] = useState([])
  const [visits, setVisits] = useState([])
  const [activeVisit, setActiveVisit] = useState(null)
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [checkoutForm, setCheckoutForm] = useState({ productsDiscussed: [], notes: '' })
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)

  function load() {
    client.get('/api/doctors').then((res) => setDoctors(res.data))
    client.get('/api/products').then((res) => setProducts(res.data))
    client.get('/api/visits/mine').then((res) => setVisits(res.data))
  }

  useEffect(load, [])

  async function handleCheckIn() {
    if (!selectedDoctor) { setStatus('Select a doctor first.'); return }
    setBusy(true)
    setStatus('Acquiring GPS location…')
    try {
      const pos = await getPosition()
      const { data } = await client.post('/api/visits/check-in', {
        doctorId: parseInt(selectedDoctor, 10),
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      })
      setActiveVisit(data)
      setStatus('')
    } catch (err) {
      setStatus(err.message || err.response?.data?.message || 'Check-in failed.')
    } finally {
      setBusy(false)
    }
  }

  async function handleCheckOut(submit) {
    setBusy(true)
    setStatus('Acquiring GPS location…')
    try {
      const pos = await getPosition()
      await client.post(`/api/visits/${activeVisit.id}/check-out`, {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        productsDiscussed: checkoutForm.productsDiscussed,
        notes: checkoutForm.notes,
        submit,
      })
      setActiveVisit(null)
      setCheckoutForm({ productsDiscussed: [], notes: '' })
      setSelectedDoctor('')
      load()
    } catch (err) {
      setStatus(err.message || err.response?.data?.message || 'Check-out failed.')
    } finally {
      setBusy(false)
    }
  }

  function toggleProduct(name) {
    setCheckoutForm((f) => ({
      ...f,
      productsDiscussed: f.productsDiscussed.includes(name)
        ? f.productsDiscussed.filter((p) => p !== name)
        : [...f.productsDiscussed, name],
    }))
  }

  return (
    <div>
      <div className="eyebrow">Epic 3</div>
      <h1 className="font-display text-3xl mt-1 mb-6">eDCR — Doctor Call Reports</h1>

      {!activeVisit ? (
        <div className="card p-5 mb-8 max-w-lg">
          <div className="eyebrow mb-4">Start a visit</div>
          <label className="field-label">Doctor / HCP</label>
          <select className="field-input mb-4" value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
            <option value="">Select…</option>
            {doctors.map((d) => <option key={d.id} value={d.id}>{d.name} — {d.hospitalOrPharmacy}</option>)}
          </select>
          <button className="btn-accent w-full" onClick={handleCheckIn} disabled={busy}>
            {busy ? 'Checking in…' : '● Check in (GPS)'}
          </button>
          {status && <div className="mt-3 text-xs text-clinical-red">{status}</div>}
        </div>
      ) : (
        <div className="card p-5 mb-8 max-w-lg border-clinical-teal/40">
          <div className="flex items-center justify-between mb-4">
            <div className="eyebrow">Active visit</div>
            <span className={`label-chip ${activeVisit.withinGeofence ? 'text-clinical-teal border-clinical-teal/40' : 'text-clinical-amber border-clinical-amber/40'}`}>
              {activeVisit.withinGeofence ? 'WITHIN GEOFENCE' : 'OUTSIDE GEOFENCE'}
              {activeVisit.geofenceDistanceMeters != null && ` · ${Math.round(activeVisit.geofenceDistanceMeters)}m`}
            </span>
          </div>
          <div className="font-display text-xl mb-4">{activeVisit.doctor.name}</div>

          <label className="field-label">Products discussed</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {products.map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => toggleProduct(p.name)}
                className={`label-chip transition-colors ${
                  checkoutForm.productsDiscussed.includes(p.name)
                    ? 'bg-clinical-teal text-white border-clinical-teal'
                    : ''
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          <label className="field-label">Call notes</label>
          <textarea
            className="field-input mb-4"
            rows={3}
            value={checkoutForm.notes}
            onChange={(e) => setCheckoutForm((f) => ({ ...f, notes: e.target.value }))}
          />

          <div className="flex gap-3">
            <button className="btn-secondary flex-1" onClick={() => handleCheckOut(false)} disabled={busy}>
              Save draft
            </button>
            <button className="btn-accent flex-1" onClick={() => handleCheckOut(true)} disabled={busy}>
              Submit report
            </button>
          </div>
          {status && <div className="mt-3 text-xs text-clinical-red">{status}</div>}
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="eyebrow px-4 pt-4">Recent visits</div>
        <table className="w-full text-sm mt-2">
          <thead>
            <tr className="border-b border-ink-100 text-left">
              <th className="eyebrow px-4 py-3">Doctor</th>
              <th className="eyebrow px-4 py-3">Check-in</th>
              <th className="eyebrow px-4 py-3">Geofence</th>
              <th className="eyebrow px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((v) => (
              <tr key={v.id} className="border-b border-ink-50 last:border-0">
                <td className="px-4 py-3 font-medium">{v.doctor.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-400">
                  {v.checkInTime ? new Date(v.checkInTime).toLocaleString() : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`label-chip ${v.withinGeofence ? 'text-clinical-teal border-clinical-teal/40' : 'text-clinical-amber border-clinical-amber/40'}`}>
                    {v.withinGeofence ? 'VALID' : 'FLAGGED'}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-400">{v.status}</td>
              </tr>
            ))}
            {visits.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-ink-400 text-sm">No visits logged yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
