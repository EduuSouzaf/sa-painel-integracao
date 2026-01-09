import { useState } from 'react'
import { FiChevronDown, FiX } from 'react-icons/fi'
import Input from '../common/Input'
import { FluxoEnumFilas, TipoObjetoEnum, tipoSapLabel } from '../../utils/filasEnums'
import './TableFilters.css'

export default function TableFilters({ onFilterChange, onClose }) {
  const [filters, setFilters] = useState({
    id: '',
    data: '',
    baseSap: '',
    baseAgro: '',
    tipoSap: '',
    idObjetoSap: '',
    idObjetoAgro: '',
    flow: '',
  })

  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleClear = () => {
    const cleared = Object.keys(filters).reduce((acc, key) => ({ ...acc, [key]: '' }), {})
    setFilters(cleared)
    onFilterChange(cleared)
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  return (
    <div className="table-filters">
      <div className="filters-header">
        <h3>Filtros Avançados</h3>
        <button className="filters-close" onClick={onClose}>
          <FiX size={20} />
        </button>
      </div>

      <div className="filters-grid">
        <Input
          label="ID da Fila"
          type="text"
          value={filters.id}
          onChange={(e) => handleChange('id', e.target.value)}
          placeholder="Buscar por ID"
        />
        <Input
          label="Data"
          type="date"
          value={filters.data}
          onChange={(e) => handleChange('data', e.target.value)}
        />
        <Input
          label="Base SAP"
          type="text"
          value={filters.baseSap}
          onChange={(e) => handleChange('baseSap', e.target.value)}
          placeholder="Ex: PROD, DEV"
        />
        <Input
          label="Base Agro"
          type="text"
          value={filters.baseAgro}
          onChange={(e) => handleChange('baseAgro', e.target.value)}
          placeholder="Ex: PROD, DEV"
        />
        <div className="input-field">
          <label className="input-label">Tipo SAP</label>
          <div className="input-wrapper">
            <select
              className="input-control"
              value={filters.tipoSap}
              onChange={(e) => handleChange('tipoSap', e.target.value)}
            >
              <option value="">Todos</option>
              {TipoObjetoEnum.filter((opt) => [2, 4, 17, 23].includes(opt.key)).map((opt) => (
                <option key={opt.key} value={opt.key}>{tipoSapLabel(opt.key)}</option>
              ))}
            </select>
          </div>
        </div>
        <Input
          label="ID Objeto SAP"
          type="text"
          value={filters.idObjetoSap}
          onChange={(e) => handleChange('idObjetoSap', e.target.value)}
          placeholder="ID do Objeto SAP"
        />
        <Input
          label="ID Objeto Agro"
          type="text"
          value={filters.idObjetoAgro}
          onChange={(e) => handleChange('idObjetoAgro', e.target.value)}
          placeholder="ID do Objeto Agro"
        />
        <div className="input-field">
          <label className="input-label">Fluxo</label>
          <div className="input-wrapper">
            <select
              className="input-control"
              value={filters.flow}
              onChange={(e) => handleChange('flow', e.target.value)}
            >
              <option value="">Todos</option>
              {FluxoEnumFilas.map((opt) => (
                <option key={opt.key} value={opt.key}>{opt.value}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="filters-actions">
        {hasActiveFilters && (
          <button className="btn-clear" onClick={handleClear}>
            <FiX size={16} /> Limpar Filtros
          </button>
        )}
      </div>
    </div>
  )
}
