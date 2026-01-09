import { useEffect, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import Table from '../components/table/Table'
import LogsModal from '../components/modals/LogsModal'
import DetailsModal from '../components/modals/DetailsModal'
import JsonViewer from '../components/common/JsonViewer'
import Toast from '../components/common/Toast'
import Modal from '../components/common/Modal'
// TableFilters agora é renderizado dentro do componente Table
import SummaryCards from '../components/kpi/SummaryCards'
// ActiveFilters agora é renderizado dentro do componente Table
import './FilasPage.css'
import { FiAlertTriangle, FiXCircle, FiRefreshCw } from 'react-icons/fi'
import { getFilas, getLogsById, reprocessar, reprocessarErros } from '../services/api/filas'
import { toStatusFilas, fluxoFilasLabel, metodoFilasLabel } from '../utils/filasEnums'

export default function FilasPage() {
  const [rawData, setRawData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [details, setDetails] = useState(null)
  const [detailsLogs, setDetailsLogs] = useState([])
  const [detailsLogsLoading, setDetailsLogsLoading] = useState(false)
  const [logs, setLogs] = useState({ open: false, items: [] })
  // Busca global agora é feita dentro do componente Table
  const [error, setError] = useState('')
  const [jsonView, setJsonView] = useState(null)
  const [apiError, setApiError] = useState('')
  const [toasts, setToasts] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({})
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [bulkModalOpen, setBulkModalOpen] = useState(false)
  const [bulkLoading, setBulkLoading] = useState(false)
  const [ackProd, setAckProd] = useState(false)
  const [lastBulk, setLastBulk] = useState(null)
  const location = useLocation()
  const isProd = Boolean(import.meta?.env?.PROD)

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
  const applyFilters = useCallback((list, activeFilters) => {
    if (!Array.isArray(list)) return []
    let filtered = list

    if (Object.values(activeFilters).some((v) => v !== '')) {
      filtered = filtered.filter((item) => {
        const raw = item.raw || {}
        if (activeFilters.id && !item.id.toString().includes(activeFilters.id)) return false
        if (activeFilters.status && item.status !== activeFilters.status) return false
        if (activeFilters.data && !new Date(item.createdAt).toLocaleDateString('pt-BR').includes(activeFilters.data)) return false
        if (activeFilters.baseSap && !raw.baseDadosSAP?.toLowerCase().includes(activeFilters.baseSap.toLowerCase())) return false
        if (activeFilters.baseAgro && !raw.baseDadosAgro?.toLowerCase().includes(activeFilters.baseAgro.toLowerCase())) return false
        if (activeFilters.tipoSap && !raw.tipoSAP?.toString().includes(activeFilters.tipoSap)) return false
        if (activeFilters.idObjetoSap && !raw.idObjeto?.toString().includes(activeFilters.idObjetoSap)) return false
        if (activeFilters.idObjetoAgro && !raw.idObjetoAgro?.toString().includes(activeFilters.idObjetoAgro)) return false
        if (activeFilters.flow) {
          const fluxoKey = raw.fluxo ?? raw.segmento ?? null
          const matchesKey = fluxoKey != null && String(fluxoKey) === String(activeFilters.flow)
          const matchesLabel = fluxoFilasLabel(fluxoKey).toLowerCase() === String(activeFilters.flow).toLowerCase()
          if (!matchesKey && !matchesLabel) return false
        }
        return true
      })
    }

    return filtered
  }, [])
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
        setRawData(mapped)
      } else {
        setRawData([])
      }
    } catch (e) {
      setError(e?.message || 'Falha ao carregar filas')
      setRawData([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Aplicar filtros avançados (busca global foi movida para a tabela)
  useEffect(() => {
    setFilteredData(applyFilters(rawData, filters))
  }, [rawData, filters, applyFilters])

  const onView = async (row) => {
    setDetails(row?.raw ?? row)
    setDetailsLogs([])
    setDetailsLogsLoading(true)
    try {
      const items = await getLogsById(row.id)
      setDetailsLogs(items)
    } catch (e) {
      setError(e?.message || 'Falha ao obter logs')
    } finally {
      setDetailsLogsLoading(false)
    }
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

  const errorCount = rawData.filter((item) => item.status === 'error').length
  const shouldShowBulkButton = !loading && filters.status === 'error' && errorCount > 0

  const handleOpenBulkModal = () => {
    setAckProd(false)
    setBulkModalOpen(true)
  }

  const handleBulkReprocess = async () => {
    if (isProd && !ackProd) return
    setBulkLoading(true)
    try {
      await reprocessarErros()
      setToasts((prev) => [
        ...prev,
        { id: Date.now(), type: 'info', message: '🔄 Reprocessamento iniciado. Os registros serão processados em segundo plano.' },
      ])
      setLastBulk(new Date())
      setBulkModalOpen(false)
      await load()
    } catch (e) {
      setToasts((prev) => [
        ...prev,
        { id: Date.now(), type: 'error', message: e?.message || 'Falha ao reprocessar erros' },
      ])
    } finally {
      setBulkLoading(false)
    }
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const onSummaryCardClick = (status) => {
    if (status === 'all') {
      setFilters({})
    } else {
      setFilters((prev) => ({ ...prev, status: status === 'warning' ? 'warning' : status }))
    }
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

      <SummaryCards data={rawData} onFilterClick={onSummaryCardClick} />

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
          extraActions={shouldShowBulkButton ? (
            <button
              className="table-btn table-btn-attention"
              onClick={handleOpenBulkModal}
              title="Reprocessar todos os registros com erro"
              disabled={bulkLoading}
            >
              <FiRefreshCw size={15} />
              Reprocessar erros ({errorCount})
            </button>
          ) : null}
          onViewJson={(row, field, title) => {
            const payload = row?.raw?.[field]
            if (!payload) return setError(`Campo ${title} indisponível`)
            setJsonView({ title, data: payload })
          }} 
        />
      ) : null}

      <Modal
        open={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        title="Reprocessar registros com erro"
        width={520}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p>
            Você está prestes a reprocessar <strong>{errorCount}</strong> integrações com status <strong>ERRO</strong>.
            Essa ação será executada em segundo plano e não pode ser desfeita.
          </p>
          {lastBulk ? (
            <small style={{ color: 'var(--muted)' }}>
              Última execução: {lastBulk.toLocaleString('pt-BR')}
            </small>
          ) : null}
          {isProd ? (
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.95rem' }}>
              <input type="checkbox" checked={ackProd} onChange={(e) => setAckProd(e.target.checked)} />
              Confirmo a execução em produção
            </label>
          ) : null}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button className="table-btn" onClick={() => setBulkModalOpen(false)} disabled={bulkLoading}>Cancelar</button>
            <button
              className="table-btn table-btn-attention"
              onClick={handleBulkReprocess}
              disabled={bulkLoading || (isProd && !ackProd)}
            >
              {bulkLoading ? 'Processando...' : '🔁 Reprocessar agora'}
            </button>
          </div>
        </div>
      </Modal>
      <DetailsModal
        open={!!details}
        onClose={() => {
          setDetails(null)
          setDetailsLogs([])
          setDetailsLogsLoading(false)
        }}
        data={details}
        logs={detailsLogs}
        loadingLogs={detailsLogsLoading}
      />
      {jsonView ? (
        <JsonViewer data={jsonView.data} title={jsonView.title} onClose={() => setJsonView(null)} />
      ) : null}
      <LogsModal open={logs.open} onClose={() => setLogs({ open: false, items: [] })} logs={logs.items} filaId={logs.filaId} />
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
