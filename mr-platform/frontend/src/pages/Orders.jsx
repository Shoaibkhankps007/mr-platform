import { useEffect, useState } from 'react'
import client from '../api/client'

export default function Orders() {
  const [doctors, setDoctors] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [doctorId, setDoctorId] = useState('')
  const [cart, setCart] = useState({}) // productId -> qty
  const [signature, setSignature] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function load() {
    client.get('/api/doctors').then((res) => setDoctors(res.data))
    client.get('/api/products').then((res) => setProducts(res.data))
    client.get('/api/orders/mine').then((res) => setOrders(res.data))
  }

  useEffect(load, [])

  function setQty(productId, qty) {
    setCart((c) => {
      const next = { ...c }
      if (qty <= 0) delete next[productId]
      else next[productId] = qty
      return next
    })
  }

  const items = Object.entries(cart).map(([productId, quantity]) => {
    const product = products.find((p) => p.id === parseInt(productId, 10))
    const lineSubtotal = product ? product.price * quantity : 0
    const tax = product ? (lineSubtotal * product.taxPercent) / 100 : 0
    return { product, quantity, lineTotal: lineSubtotal + tax }
  })
  const grandTotal = items.reduce((sum, i) => sum + i.lineTotal, 0)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!doctorId || items.length === 0) { setError('Select a doctor and at least one product.'); return }
    setBusy(true)
    try {
      await client.post('/api/orders', {
        doctorId: parseInt(doctorId, 10),
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        eSignature: signature,
      })
      setCart({})
      setSignature('')
      setDoctorId('')
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="eyebrow">Epic 4</div>
      <h1 className="font-display text-3xl mt-1 mb-6">Orders</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 card p-5 space-y-4">
          <div>
            <label className="field-label">Ordering doctor / pharmacy</label>
            <select className="field-input" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
              <option value="">Select…</option>
              {doctors.map((d) => <option key={d.id} value={d.id}>{d.name} — {d.hospitalOrPharmacy}</option>)}
            </select>
          </div>

          <div>
            <div className="field-label">Products</div>
            <div className="space-y-2">
              {products.map((p) => (
                <div key={p.id} className="flex items-center justify-between border border-ink-50 rounded-sm px-3 py-2">
                  <div>
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="font-mono text-[11px] text-ink-400">{p.sku} · ₹{p.price} + {p.taxPercent}% tax</div>
                  </div>
                  <input
                    type="number"
                    min={0}
                    className="field-input w-20 text-center"
                    value={cart[p.id] || ''}
                    onChange={(e) => setQty(p.id, parseInt(e.target.value || '0', 10))}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="field-label">E-signature (typed attestation)</label>
            <input className="field-input" value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="Type full name to sign" />
          </div>

          {error && <div className="text-xs text-clinical-red">{error}</div>}

          <div className="flex items-center justify-between pt-2 border-t border-ink-100">
            <div className="font-display text-2xl">₹{grandTotal.toFixed(2)}</div>
            <button className="btn-accent" type="submit" disabled={busy}>
              {busy ? 'Placing order…' : 'Place order'}
            </button>
          </div>
        </form>

        <div className="card p-5 h-fit">
          <div className="eyebrow mb-4">Order summary</div>
          {items.length === 0 && <div className="text-sm text-ink-400">No items selected yet.</div>}
          <div className="space-y-2">
            {items.map((i) => (
              <div key={i.product.id} className="flex justify-between text-sm">
                <span>{i.quantity}× {i.product.name}</span>
                <span className="font-mono text-xs">₹{i.lineTotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="eyebrow px-4 pt-4">Order history</div>
        <table className="w-full text-sm mt-2">
          <thead>
            <tr className="border-b border-ink-100 text-left">
              <th className="eyebrow px-4 py-3">Doctor</th>
              <th className="eyebrow px-4 py-3">Date</th>
              <th className="eyebrow px-4 py-3">Items</th>
              <th className="eyebrow px-4 py-3">Total</th>
              <th className="eyebrow px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-ink-50 last:border-0">
                <td className="px-4 py-3 font-medium">{o.doctor.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-400">{new Date(o.orderDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-ink-400">{o.items.length} SKU(s)</td>
                <td className="px-4 py-3 font-mono">₹{o.totalAmount}</td>
                <td className="px-4 py-3">
                  <span className="label-chip text-clinical-teal border-clinical-teal/40">{o.status}</span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-ink-400 text-sm">No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
