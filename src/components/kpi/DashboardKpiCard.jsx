import './DashboardKpiCard.css'

export default function DashboardKpiCard({ title, value, deltaPct, deltaLabel = 'últimos 7 dias', tone = 'neutral', icon, onClick }) {
  const sign = typeof deltaPct === 'number' && !Number.isNaN(deltaPct) ? (deltaPct > 0 ? '+' : deltaPct < 0 ? '−' : '') : ''
  const absPct = typeof deltaPct === 'number' && !Number.isNaN(deltaPct) ? Math.abs(deltaPct).toFixed(1) : null

  // Para o card de Taxa de Sucesso, ajustar o tom por faixas
  const effectiveTone = tone

  return (
    <button className={`dkpi-card dkpi-${effectiveTone}`} onClick={onClick} title={title}>
      <div className="dkpi-chip" aria-hidden>{icon}</div>
      <div className="dkpi-title">{title}</div>
      <div className="dkpi-value">{typeof value === 'number' ? value.toLocaleString('pt-BR') : value}</div>
      {absPct !== null ? (
        <div className={`dkpi-delta ${deltaPct > 0 ? 'up' : deltaPct < 0 ? 'down' : 'flat'}`}>
          <span className="dkpi-delta-sign">{sign}</span>
          <span className="dkpi-delta-pct">{absPct}%</span>
          <span className="dkpi-delta-label">{deltaLabel}</span>
        </div>
      ) : null}
    </button>
  )
}
