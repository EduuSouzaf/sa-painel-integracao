import { useContext } from 'react'
import { AlertContext } from '../contexts/AlertContextValue'

export function useAlert() {
  const ctx = useContext(AlertContext)
  if (!ctx) throw new Error('useAlert must be used within AlertProvider')
  return ctx
}
