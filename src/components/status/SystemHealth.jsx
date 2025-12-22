import './SystemHealth.css'
import { FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi'

export default function SystemHealth({ level = 'ok', message }) {
  const icon = level === 'ok' ? <FiCheckCircle /> : level === 'warn' ? <FiAlertTriangle /> : <FiXCircle />
  const label = level === 'ok' ? 'Sistema operando normalmente' : level === 'warn' ? 'Atenção' : 'Degradação detectada'
  return (
    <div className={`sys-health sys-${level}`}>
      <div className="sys-icon" aria-hidden>{icon}</div>
      <div className="sys-content">
        <div className="sys-title">{label}</div>
        <div className="sys-message">{message}</div>
      </div>
    </div>
  )
}
