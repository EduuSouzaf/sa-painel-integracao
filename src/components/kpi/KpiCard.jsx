import './KpiCard.css'
import { useEffect, useRef, useState } from 'react'

function useCountUp(value, duration = 600) {
  const [n, setN] = useState(0)
  const startRef = useRef(null)
  useEffect(() => {
    let raf
    const start = performance.now()
    startRef.current = start
    const step = (t) => {
      const p = Math.min(1, (t - startRef.current) / duration)
      setN(Math.round(value * p))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])
  return n
}

export default function KpiCard({ title, value, status = 'success', icon }) {
  const n = useCountUp(value)
  return (
    <div className={`kpi-card kpi-${status}`}>
      <div className="kpi-chip" aria-hidden>{icon}</div>
      <div className="kpi-title">{title}</div>
      <div className="kpi-value">{n.toLocaleString('pt-BR')}</div>
    </div>
  )
}
