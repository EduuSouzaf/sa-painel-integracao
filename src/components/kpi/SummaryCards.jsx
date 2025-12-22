import './SummaryCards.css'

export default function SummaryCards({ data = [], onFilterClick }) {
  const total = data.length
  const errors = data.filter(item => item.status === 'error').length
  const success = data.filter(item => item.status === 'success').length
  const successRate = total > 0 ? Math.round((success / total) * 100) : 0
  const deadLetter = data.filter(item => item.status === 'warning').length

  const cards = [
    {
      id: 'total',
      label: 'Total de Registros',
      value: total.toLocaleString('pt-BR'),
      icon: '📊',
      color: '#1f6feb',
      action: null,
    },
    {
      id: 'success',
      label: 'Sucessos',
      value: success.toLocaleString('pt-BR'),
      icon: '✅',
      color: '#3fb950',
      action: 'success',
    },
    {
      id: 'errors',
      label: 'Erros',
      value: errors.toLocaleString('pt-BR'),
      icon: '❌',
      color: '#f85149',
      action: 'error',
    },
    {
      id: 'deadletter',
      label: 'Dead Letter',
      value: deadLetter.toLocaleString('pt-BR'),
      icon: '⚠️',
      color: '#d29922',
      action: 'warning',
    },
    {
      id: 'rate',
      label: 'Taxa de Sucesso',
      value: `${successRate}%`,
      icon: '📈',
      color: successRate >= 90 ? '#3fb950' : successRate >= 70 ? '#d29922' : '#f85149',
      action: null,
    },
  ]

  return (
    <div className="summary-cards">
      {cards.map((card) => (
        <button
          key={card.id}
          className={`summary-card ${card.action ? 'clickable' : ''}`}
          onClick={() => card.action && onFilterClick?.(card.action)}
          title={card.action ? `Filtrar por ${card.label}` : card.label}
        >
          <div className="card-icon">{card.icon}</div>
          <div className="card-content">
            <div className="card-label">{card.label}</div>
            <div className="card-value" style={{ color: card.color }}>
              {card.value}
            </div>
          </div>
          {card.action && <div className="card-arrow">→</div>}
        </button>
      ))}
    </div>
  )
}
