import { useEffect, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import Table from '../components/table/Table'
import LogsModal from '../components/modals/LogsModal'
import DetailsModal from '../components/modals/DetailsModal'
import JsonViewer from '../components/common/JsonViewer'
import Toast from '../components/common/Toast'
// TableFilters agora é renderizado dentro do componente Table
import SummaryCards from '../components/kpi/SummaryCards'
// ActiveFilters agora é renderizado dentro do componente Table
import './FilasPage.css'
import { FiAlertTriangle, FiXCircle } from 'react-icons/fi'
import { getFilas, getLogsById, reprocessar } from '../services/api/filas'
import { toStatusFilas, fluxoFilasLabel, metodoFilasLabel } from '../utils/filasEnums'

export default function FilasPage() {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [details, setDetails] = useState(null)
  const [logs, setLogs] = useState({ open: false, items: [] })
  // Busca global agora é feita dentro do componente Table
  const [error, setError] = useState('')
  const [jsonView, setJsonView] = useState(null)
  const [apiError, setApiError] = useState('')
  const [toasts, setToasts] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({})
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const location = useLocation()

  useEffect(() => {
    const err = sessionStorage.getItem('apiError')
    if (err) {
      setApiError(err)
      sessionStorage.removeItem('apiError')
    }
  }, [])
  // Aplica filtros pré-definidos vindos da navegação do dashboard
  useEffect(() => {
    const preset = location?.state?.presetFilters
    if (preset && typeof preset === 'object') {
      setFilters((prev) => ({ ...prev, ...preset }))
    }
  }, [location?.state])
  const mapItem = (it) => ({
    id: it?.id ?? it?.identificador ?? it?.uuid ?? '—',
    status: toStatusFilas(it?.status ?? it?.codigoStatus ?? it?.situacao),
    // 'type' não é mais exibido, mantido apenas para compatibilidade
    type: it?.tipo ?? it?.objeto ?? '—',
    flow: fluxoFilasLabel(it?.fluxo ?? it?.segmento),
    method: metodoFilasLabel(it?.metodo ?? it?.method),
    attempts: it?.tentativas ?? it?.attempts ?? 0,
    createdAt: it?.createdAt ?? it?.dataCriacao ?? it?.data_criacao ?? new Date().toISOString(),
    raw: it,
  })

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const list = await getFilas()
      if (Array.isArray(list)) {
        const mapped = list.map(mapItem)
        mapped.sort((a, b) => {
          const na = Number(a.id)
          const nb = Number(b.id)
          if (!Number.isNaN(nb) && !Number.isNaN(na)) return nb - na
          return String(b.id).localeCompare(String(a.id))
        })
        setData(mapped)
      } else {
        setData([])
      }
    } catch (e) {
      setError(e?.message || 'Falha ao carregar filas')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Aplicar filtros avançados (busca global foi movida para a tabela)
  useEffect(() => {
    let filtered = data
    
    // Aplicar filtros avançados
    if (Object.values(filters).some(v => v !== '')) {
      filtered = filtered.filter(item => {
        const raw = item.raw || {}
        if (filters.id && !item.id.toString().includes(filters.id)) return false
        if (filters.data && !new Date(item.createdAt).toLocaleDateString('pt-BR').includes(filters.data)) return false
        if (filters.baseSap && !raw.baseDadosSAP?.toLowerCase().includes(filters.baseSap.toLowerCase())) return false
        if (filters.baseAgro && !raw.baseDadosAgro?.toLowerCase().includes(filters.baseAgro.toLowerCase())) return false
        if (filters.tipoSap && !raw.tipoSAP?.toString().toLowerCase().includes(filters.tipoSap.toLowerCase())) return false
        if (filters.tipoAgro && !raw.tipoAgro?.toString().toLowerCase().includes(filters.tipoAgro.toLowerCase())) return false
        if (filters.idObjetoSap && !raw.idObjeto?.toString().includes(filters.idObjetoSap)) return false
        if (filters.idObjetoAgro && !raw.idObjetoAgro?.toString().includes(filters.idObjetoAgro)) return false
        return true
      })
    }
    
    setFilteredData(filtered)
  }, [data, filters])

  const onView = (row) => {
    // Abre o modal de detalhes com os dados brutos da fila
    setDetails(row?.raw ?? row)
  }
  const onLogs = async (row) => {
    try {
      const items = await getLogsById(row.id)
      setLogs({ open: true, items, filaId: row.id })
    } catch (e) {
      setError(e?.message || 'Falha ao obter logs')
    }
  }
  const onReprocess = async (row) => {
    try {
      await reprocessar(row.id)
      setToasts((prev) => [
        ...prev,
        { id: Date.now(), type: 'success', message: 'Fila reprocessada com sucesso!' }
      ])
      await load()
    } catch (e) {
      setToasts((prev) => [
        ...prev,
        { id: Date.now(), type: 'error', message: e?.message || 'Falha ao reprocessar' }
      ])
    }
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const onSummaryCardClick = (status) => {
    setFilters({ ...filters, status: status === 'warning' ? 'warning' : status })
    setShowFilters(false)
  }

  const onRemoveFilter = (key) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    setFilters(newFilters)
  }

  const onClearAllFilters = () => {
    setFilters({})
  }

  return (
    <div className="container-fluid" style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: '100%' }}>
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-title">Gerenciamento de Filas</div>
          <div className="page-subtitle">Monitore e gerencie as integrações do sistema.</div>
        </div>
      </div>

      <SummaryCards data={filteredData} onFilterClick={onSummaryCardClick} />

      {/* Barra de busca, atualizar e filtros foi movida para dentro do componente Table */}

      {/* Filtros avançados renderizados dentro do Table */}

      {/* ActiveFilters movido para dentro do container da tabela */}

      {apiError ? (
        <div className="alert-warning" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <FiAlertTriangle size={20} />
          <span><strong>Modo Offline:</strong> {apiError}</span>
        </div>
      ) : null}

      {error ? (
        <div className="alert-error" style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '12px 16px', borderRadius: '8px', backgroundColor: '#fee', border: '1px solid #f99', color: '#c33' }}>
          <FiXCircle size={20} />
          <span>{error}</span>
        </div>
      ) : null}

      {!error ? (
        <Table 
          data={filteredData} 
          loading={loading} 
          onView={onView} 
          onLogs={onLogs} 
          onReprocess={onReprocess} 
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={setRowsPerPage}
          onRefresh={load}
          onToggleFilters={() => setShowFilters(!showFilters)}
          showFilters={showFilters}
          onFilterChange={setFilters}
          onCloseFilters={() => setShowFilters(false)}
          filters={filters}
          onRemoveFilter={onRemoveFilter}
          onClearAllFilters={onClearAllFilters}
          hideActiveFiltersWhenOpen={true}
          onViewJson={(row, field, title) => {
            const payload = row?.raw?.[field]
            if (!payload) return setError(`Campo ${title} indisponível`)
            setJsonView({ title, data: payload })
          }} 
        />
      ) : null}
      <DetailsModal open={!!details} onClose={() => setDetails(null)} data={details} />
      {jsonView ? (
        <JsonViewer data={jsonView.data} title={jsonView.title} onClose={() => setJsonView(null)} />
      ) : null}
      <LogsModal open={logs.open} onClose={() => setLogs({ open: false, items: [] })} logs={logs.items} filaId={logs.filaId} />
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
