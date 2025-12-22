import './TopErrors.css'

export default function TopErrors({ items = [] }) {
  // items: [{ label, count }]
  const top = items.slice(0, 5)
  return (
    <div className="section-card">
      <div className="section-head">
        <div className="section-title">Top erros (últimos 7 dias)</div>
        <div className="section-sub">Principais tipos para priorização</div>
      </div>
      <div className="section-body">
        <ul className="top-errors-list">
          {top.length === 0 ? (
            <li className="empty">Sem dados suficientes</li>
          ) : (
            top.map((it) => (
              <li key={it.label}>
                <span className="label">{it.label}</span>
                <span className="count">{it.count.toLocaleString('pt-BR')}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}
