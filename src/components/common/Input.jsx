import './Input.css'
import { AnimatePresence } from 'framer-motion'

export default function Input({ label, error, className = '', iconRight = null, ...props }) {
  return (
    <div className={`input-field ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div className={`input-wrapper ${iconRight ? 'with-icon' : ''}`}>
        <input className={`input-control ${error ? 'input-error' : ''}`} {...props} />
        {iconRight ? <span className="input-icon">{iconRight}</span> : null}
      </div>
      <AnimatePresence>
        {error ? (
          <div
            className="input-error-text"
          >
            {error}
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  )}
