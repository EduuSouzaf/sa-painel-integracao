import { useEffect, useMemo, useState } from 'react'
import { onUnauthorized } from '../services/httpClient'
import { AuthContext } from './AuthContextValue'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [user])

  const login = (tokenValue, userValue) => {
    setToken(tokenValue)
    setUser(userValue)
  }
  
  const logout = () => {
    setToken(null)
    setUser(null)
  }

  // Registra handler para 401 automático
  useEffect(() => {
    onUnauthorized(() => {
      logout()
    })
  }, [])

  const value = useMemo(() => ({ token, user, login, logout, isAuthenticated: !!token }), [token, user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
