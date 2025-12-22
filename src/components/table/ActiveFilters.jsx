import './ActiveFilters.css'
import { FiX } from 'react-icons/fi'

export default function ActiveFilters({ filters, onRemoveFilter, onClearAll }) {
  const activeFilters = Object.entries(filters).filter(([_, value]) => value !== '' && value !== null && value !== undefined)

  if (activeFilters.length === 0) return null

  const filterLabels = {
    id: 'ID',
    data: 'Data',
    baseSap: 'Base SAP',
    baseAgro: 'Base Agro',
    tipoSap: 'Tipo SAP',
    tipoAgro: 'Tipo Agro',
    status: 'Status',
    idObjetoSap: 'ID Objeto SAP',
    idObjetoAgro: 'ID Objeto Agro',
  }

  return (
    <div className="active-filters">
      <div className="filters-label">Filtros ativos:</div>
      <div className="filters-list">
        {activeFilters.map(([key, value]) => (
          <div key={key} className="filter-badge">
            <span className="filter-key">{filterLabels[key] || key}</span>
            <span className="filter-separator">=</span>
            <span className="filter-value">{value}</span>
            <button
              className="filter-remove"
              onClick={() => onRemoveFilter(key)}
              title={`Remover filtro ${filterLabels[key]}`}
              aria-label={`Remover filtro ${filterLabels[key]}`}
            >
              <FiX size={14} />
            </button>
          </div>
        ))}
      </div>
      <button className="clear-all-btn" onClick={onClearAll}>
        Limpar todos
      </button>
    </div>
  )
}
