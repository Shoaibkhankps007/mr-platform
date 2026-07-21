import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Territories from './pages/Territories'
import Doctors from './pages/Doctors'
import Visits from './pages/Visits'
import Orders from './pages/Orders'
import Samples from './pages/Samples'

function Protected({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Layout>{children}</Layout>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Protected><Dashboard /></Protected>} />
      <Route path="/territories" element={<Protected><Territories /></Protected>} />
      <Route path="/doctors" element={<Protected><Doctors /></Protected>} />
      <Route path="/visits" element={<Protected><Visits /></Protected>} />
      <Route path="/orders" element={<Protected><Orders /></Protected>} />
      <Route path="/samples" element={<Protected><Samples /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
