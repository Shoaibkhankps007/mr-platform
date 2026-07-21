import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', code: '00' },
  { to: '/territories', label: 'Territories', code: '01' },
  { to: '/doctors', label: 'HCP Directory', code: '02' },
  { to: '/visits', label: 'eDCR / Visits', code: '03' },
  { to: '/orders', label: 'Orders', code: '04' },
  { to: '/samples', label: 'Samples', code: '05' },
]

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 shrink-0 bg-ink text-white flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="font-mono text-[11px] tracking-widest2 text-clinical-teal">ITER PHARMACEUTICALS</div>
          <div className="font-display text-lg mt-1 leading-tight">MR Platform</div>
        </div>

        <nav className="flex-1 py-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-body transition-colors border-l-2 ${
                  isActive
                    ? 'border-clinical-teal bg-white/5 text-white'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <span className="font-mono text-[10px] text-white/40">{item.code}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-5 border-t border-white/10">
          <div className="text-sm font-medium">{user?.name}</div>
          <div className="font-mono text-[10px] uppercase tracking-wide text-white/40 mt-0.5">{user?.role}</div>
          <button
            onClick={handleLogout}
            className="mt-3 text-xs font-mono text-white/60 hover:text-clinical-teal transition-colors"
          >
            SIGN OUT →
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  )
}
