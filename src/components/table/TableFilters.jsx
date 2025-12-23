import { useState } from 'react'
import { FiChevronDown, FiX } from 'react-icons/fi'
import Input from '../common/Input'
import './TableFilters.css'

export default function TableFilters({ onFilterChange, onClose }) {
  const [filters, setFilters] = useState({
    id: '',
    data: '',
    baseSap: '',
    baseAgro: '',
    tipoSap: '',
    tipoAgro: '',
    idObjetoSap: '',
    idObjetoAgro: ''
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
        <Input
          label="Tipo SAP"
          type="text"
          value={filters.tipoSap}
          onChange={(e) => handleChange('tipoSap', e.target.value)}
          placeholder="Tipo de Objeto SAP"
        />
        <Input
          label="Tipo Agro"
          type="text"
          value={filters.tipoAgro}
          onChange={(e) => handleChange('tipoAgro', e.target.value)}
          placeholder="Tipo de Objeto Agro"
        />
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
