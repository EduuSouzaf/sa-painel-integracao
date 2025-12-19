import { useEffect, useState, useCallback } from 'react'
import KpiCard from '../components/kpi/KpiCard'
import { FiCheckCircle, FiAlertTriangle, FiXCircle, FiLayers } from 'react-icons/fi'
import BarChartAnimated from '../components/charts/BarChartAnimated'
import Skeleton from '../components/common/Skeleton'
import { getFilas } from '../services/api/filas'
import { toStatusFilas } from '../utils/filasEnums'
import './DashboardPage.css'

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [apiError] = useState(() => {
    const err = sessionStorage.getItem('apiError')
    if (err) {
      sessionStorage.removeItem('apiError')
    }
    return err || ''
  })

  const processFilasData = useCallback((filas) => {
    // Processar dados das filas para gerar KPIs
    const stats = filas.reduce((acc, fila) => {
      const status = toStatusFilas(fila?.status ?? fila?.codigoStatus ?? fila?.situacao)
      if (status === 'success') acc.success++
      else if (status === 'error') acc.error++
      else if (status === 'warning') acc.warning++
      acc.total++
      return acc
    }, { success: 0, error: 0, warning: 0, total: 0 })

    // Gerar dados do gráfico por mês (últimos 6 meses)
    const now = new Date()
    const monthsData = {}
    
    // Inicializar últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
      monthsData[monthKey] = { month: monthKey, total: 0 }
    }
    
    // Contar filas por mês
    filas.forEach((fila) => {
      const date = new Date(fila?.createdAt ?? fila?.dataCriacao ?? fila?.data_criacao ?? new Date())
      const monthKey = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
      if (monthsData[monthKey]) {
        monthsData[monthKey].total++
      }
    })

    return {
      kpis: [
        { value: stats.total },
        { value: stats.success },
        { value: stats.error },
        { value: stats.warning }
      ],
      chart: Object.values(monthsData)
    }
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const filas = await getFilas()
      const processedData = processFilasData(filas)
      setData(processedData)
    } catch (err) {
      setError('Não foi possível carregar os dados. Verifique sua conexão com o servidor.')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [processFilasData])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="container-fluid" style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: '100%' }}>
      <div className="page-header">
        <div className="page-title">Monitoramento de Filas</div>
        <div className="page-subtitle">Acompanhe o processamento em tempo real.</div>
      </div>

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
        <>
          <div className="kpi-grid">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)
              : [
                  { id: 'total', title: 'Total Filas', value: data.kpis[0].value, status: 'neutral', icon: <FiLayers /> },
                  { id: 'succ', title: 'Sucessos', value: data.kpis[1].value, status: 'success', icon: <FiCheckCircle /> },
                  { id: 'err', title: 'Erros', value: data.kpis[2].value, status: 'error', icon: <FiXCircle /> },
                  { id: 'pend', title: 'Aguardando', value: data.kpis[3].value, status: 'warning', icon: <FiAlertTriangle /> },
                ].map((k) => (
                  <KpiCard key={k.id} title={k.title} value={k.value} status={k.status} icon={k.icon} />
                ))}
          </div>

          <div>{loading ? <Skeleton className="h-80" /> : <BarChartAnimated data={data.chart} />}</div>
        </>
      ) : null}
    </div>
  )
}
