import { createContext, useContext, useState } from 'react'
import client from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('mr_user')
    return stored ? JSON.parse(stored) : null
  })

  async function login(email, password) {
    const { data } = await client.post('/api/auth/login', { email, password })
    localStorage.setItem('mr_token', data.token)
    const userInfo = { name: data.name, email: data.email, role: data.role }
    localStorage.setItem('mr_user', JSON.stringify(userInfo))
    setUser(userInfo)
    return userInfo
  }

  function logout() {
    localStorage.removeItem('mr_token')
    localStorage.removeItem('mr_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
