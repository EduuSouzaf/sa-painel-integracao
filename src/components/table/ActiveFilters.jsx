import './ActiveFilters.css'
import { FiX } from 'react-icons/fi'
import { tipoSapLabel, fluxoFilasLabel } from '../../utils/filasEnums'
import { statusLabel } from '../../utils/enums'

export default function ActiveFilters({ filters, onRemoveFilter, onClearAll }) {
  const activeFilters = Object.entries(filters).filter(([, value]) => value !== '' && value !== null && value !== undefined)

  if (activeFilters.length === 0) return null

  const filterLabels = {
    id: 'ID',
    data: 'Data',
    baseSap: 'Base SAP',
    baseAgro: 'Base Agro',
    tipoSap: 'Tipo SAP',
    status: 'Status',
    idObjetoSap: 'ID Objeto SAP',
    idObjetoAgro: 'ID Objeto Agro',
    flow: 'Fluxo',
  }

  const formatFilterValue = (key, value) => {
    if (key === 'tipoSap') return tipoSapLabel(value)
    if (key === 'status') return statusLabel(value)
    if (key === 'flow') return fluxoFilasLabel(value)
    return value
  }

  return (
    <div className="active-filters">
      <div className="filters-label">Filtros ativos:</div>
      <div className="filters-list">
        {activeFilters.map(([key, value]) => (
          <div key={key} className="filter-badge">
            <span className="filter-key">{filterLabels[key] || key}</span>
            <span className="filter-separator">=</span>
            <span className="filter-value">{formatFilterValue(key, value)}</span>
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
