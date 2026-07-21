import { useEffect, useState } from 'react'
import client from '../api/client'

export default function Samples() {
  const [doctors, setDoctors] = useState([])
  const [products, setProducts] = useState([])
  const [samples, setSamples] = useState([])
  const [form, setForm] = useState({
    doctorId: '', productId: '', batchNumber: '', expiryDate: '', quantity: 1, consentSignature: '',
  })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function load() {
    client.get('/api/doctors').then((res) => setDoctors(res.data))
    client.get('/api/products').then((res) => setProducts(res.data))
    client.get('/api/samples/mine').then((res) => setSamples(res.data))
  }

  useEffect(load, [])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await client.post('/api/samples', {
        doctorId: parseInt(form.doctorId, 10),
        productId: parseInt(form.productId, 10),
        batchNumber: form.batchNumber,
        expiryDate: form.expiryDate,
        quantity: parseInt(form.quantity, 10),
        consentSignature: form.consentSignature,
      })
      setForm({ doctorId: '', productId: '', batchNumber: '', expiryDate: '', quantity: 1, consentSignature: '' })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not issue sample.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="eyebrow">Epic 4</div>
      <h1 className="font-display text-3xl mt-1 mb-6">Sample Distribution</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 card p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Doctor / HCP</label>
              <select className="field-input" value={form.doctorId} onChange={(e) => update('doctorId', e.target.value)} required>
                <option value="">Select…</option>
                {doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Product</label>
              <select className="field-input" value={form.productId} onChange={(e) => update('productId', e.target.value)} required>
                <option value="">Select…</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="field-label">Batch no.</label>
              <input className="field-input font-mono" value={form.batchNumber} onChange={(e) => update('batchNumber', e.target.value)} required />
            </div>
            <div>
              <label className="field-label">Expiry date</label>
              <input type="date" className="field-input" value={form.expiryDate} onChange={(e) => update('expiryDate', e.target.value)} required />
            </div>
            <div>
              <label className="field-label">Quantity</label>
              <input type="number" min={1} className="field-input" value={form.quantity} onChange={(e) => update('quantity', e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="field-label">HCP consent signature</label>
            <input className="field-input" value={form.consentSignature} onChange={(e) => update('consentSignature', e.target.value)} placeholder="Doctor's typed attestation of receipt" />
          </div>

          {error && <div className="text-xs text-clinical-red">{error}</div>}

          <button className="btn-accent" type="submit" disabled={busy}>
            {busy ? 'Issuing…' : 'Issue sample'}
          </button>
        </form>

        <div className="card p-5 h-fit">
          <div className="eyebrow mb-3">Compliance note</div>
          <p className="text-sm text-ink-400 leading-relaxed">
            Every sample issued here is logged with batch, expiry, quantity, and HCP
            consent as an immutable audit record, and stock is depleted automatically
            from inventory for reconciliation.
          </p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="eyebrow px-4 pt-4">Sample issue log</div>
        <table className="w-full text-sm mt-2">
          <thead>
            <tr className="border-b border-ink-100 text-left">
              <th className="eyebrow px-4 py-3">Doctor</th>
              <th className="eyebrow px-4 py-3">Product</th>
              <th className="eyebrow px-4 py-3">Batch</th>
              <th className="eyebrow px-4 py-3">Expiry</th>
              <th className="eyebrow px-4 py-3">Qty</th>
            </tr>
          </thead>
          <tbody>
            {samples.map((s) => (
              <tr key={s.id} className="border-b border-ink-50 last:border-0">
                <td className="px-4 py-3 font-medium">{s.doctor.name}</td>
                <td className="px-4 py-3 text-ink-400">{s.product.name}</td>
                <td className="px-4 py-3 font-mono text-xs">{s.batchNumber}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-400">{s.expiryDate}</td>
                <td className="px-4 py-3">{s.quantity}</td>
              </tr>
            ))}
            {samples.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-ink-400 text-sm">No samples issued yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
