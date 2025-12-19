import { useMemo, useState, useCallback } from 'react'
import { AlertContext } from './AlertContextValue'
let alertIdCounter = 0

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([])

  const addAlert = useCallback((message, type = 'error') => {
    const id = ++alertIdCounter
    setAlerts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== id))
    }, 8000)
    return id
  }, [])

  const removeAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(a => a.id !== id))
  }, [])

  const clearAlerts = useCallback(() => {
    setAlerts([])
  }, [])

  const value = useMemo(() => ({ alerts, addAlert, removeAlert, clearAlerts }), [alerts, addAlert, removeAlert, clearAlerts])
  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
}
