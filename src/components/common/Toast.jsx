import { useEffect, useState, useCallback } from 'react'
import { FiX } from 'react-icons/fi'
import './Toast.css'

export default function Toast({ toasts, onRemove }) {
  const [exitingIds, setExitingIds] = useState([])

  const handleRemove = useCallback((id) => {
    setExitingIds((prev) => [...prev, id])
    setTimeout(() => {
      onRemove(id)
      setExitingIds((prev) => prev.filter((exitId) => exitId !== id))
    }, 300)
  }, [onRemove])

  useEffect(() => {
    const timers = toasts.map((toast) => {
      return setTimeout(() => {
        handleRemove(toast.id)
      }, 5000)
    })

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [toasts, handleRemove])

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast ${exitingIds.includes(toast.id) ? 'exiting' : ''}`}
        >
          <div className="toast-content">
            <div className="toast-message">{toast.message}</div>
            <button className="toast-close" onClick={() => handleRemove(toast.id)}>
              <FiX size={18} />
            </button>
          </div>
          <div className={`toast-progress toast-progress-${toast.type}`}></div>
        </div>
      ))}
    </div>
  )
}
