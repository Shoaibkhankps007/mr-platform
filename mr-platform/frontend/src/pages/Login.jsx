import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('admin@iter-pharma.com')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="font-mono text-[11px] tracking-widest2 text-clinical-teal">ITER PHARMACEUTICALS</div>
          <div className="font-display text-3xl text-white mt-2">MR Platform</div>
          <div className="font-body text-sm text-white/50 mt-1">Field operations · sign in to continue</div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-sm p-6 border border-white/10">
          <div className="mb-4">
            <label className="field-label">Work email</label>
            <input
              type="email"
              required
              className="field-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@iter-pharma.com"
            />
          </div>
          <div className="mb-5">
            <label className="field-label">Password</label>
            <input
              type="password"
              required
              className="field-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="mb-4 text-sm text-clinical-red font-body bg-clinical-red/5 border border-clinical-red/20 rounded-sm px-3 py-2">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-accent w-full">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <div className="mt-5 pt-4 border-t border-ink-100 text-xs font-mono text-ink-400 leading-relaxed">
            DEMO ACCOUNTS (password123)<br />
            admin@iter-pharma.com — ADMIN<br />
            manager@iter-pharma.com — MANAGER<br />
            mr1@iter-pharma.com — MR (East Zone)<br />
            mr2@iter-pharma.com — MR (North Zone)
          </div>
        </form>
      </div>
    </div>
  )
}
