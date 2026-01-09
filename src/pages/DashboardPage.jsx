import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardKpiCard from '../components/kpi/DashboardKpiCard'
import SystemHealth from '../components/status/SystemHealth'
import TopErrors from '../components/diagnostics/TopErrors'
import ProcessingChart from '../components/charts/ProcessingChart'
import { FiCheckCircle, FiAlertTriangle, FiXCircle, FiLayers, FiTrendingUp } from 'react-icons/fi'
import Skeleton from '../components/common/Skeleton'
import { getFilas } from '../services/api/filas'
import { toStatusFilas, tipoSapLabel } from '../utils/filasEnums'
import './DashboardPage.css'

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [apiError] = useState(() => {
    const err = sessionStorage.getItem('apiError')
    if (err) {
      sessionStorage.removeItem('apiError')
    }
    return err || ''
  })

  const processFilasData = useCallback((filas) => {
    // KPIs básicos
    const stats = filas.reduce((acc, fila) => {
      const status = toStatusFilas(fila?.status ?? fila?.codigoStatus ?? fila?.situacao)
      if (status === 'success') acc.success++
      else if (status === 'error') acc.error++
      else if (status === 'warning') acc.warning++
      acc.total++
      return acc
    }, { success: 0, error: 0, warning: 0, total: 0 })

    // Variação (últimos 7 dias vs. 7 dias anteriores)
    const now = new Date()
    const start7 = new Date(now)
    start7.setDate(now.getDate() - 7)
    const start14 = new Date(now)
    start14.setDate(now.getDate() - 14)

    const inRange = (d, a, b) => d >= a && d < b
    const asDate = (x) => new Date(x?.createdAt ?? x?.dataCriacao ?? x?.data_criacao ?? now)

    const countsIn = (arr, predicate) => arr.reduce((n, it) => (predicate(it) ? n + 1 : n), 0)
    const last7 = filas.filter((f) => inRange(asDate(f), start7, now))
    const prev7 = filas.filter((f) => inRange(asDate(f), start14, start7))

    const s7 = countsIn(last7, (f) => toStatusFilas(f?.status ?? f?.codigoStatus ?? f?.situacao) === 'success')
    const e7 = countsIn(last7, (f) => toStatusFilas(f?.status ?? f?.codigoStatus ?? f?.situacao) === 'error')
    const w7 = countsIn(last7, (f) => toStatusFilas(f?.status ?? f?.codigoStatus ?? f?.situacao) === 'warning')
    const t7 = last7.length
    const sP = countsIn(prev7, (f) => toStatusFilas(f?.status ?? f?.codigoStatus ?? f?.situacao) === 'success')
    const eP = countsIn(prev7, (f) => toStatusFilas(f?.status ?? f?.codigoStatus ?? f?.situacao) === 'error')
    const wP = countsIn(prev7, (f) => toStatusFilas(f?.status ?? f?.codigoStatus ?? f?.situacao) === 'warning')
    const tP = prev7.length

    const pct = (curr, prev) => {
      if (!prev) return curr ? 100 : 0
      return ((curr - prev) / prev) * 100
    }

    // Taxa de sucesso (priorizar últimos 7 dias)
    const denom7 = s7 + e7
    const successRate = denom7 > 0 ? (s7 / denom7) * 100 : (stats.success + stats.error > 0 ? (stats.success / (stats.success + stats.error)) * 100 : null)
    const denomP = sP + eP
    const successRatePrev = denomP > 0 ? (sP / denomP) * 100 : successRate
    const successRateDelta = successRate !== null && successRatePrev !== null ? successRate - successRatePrev : null

    // Gráfico mensal (6 meses) com séries
    const monthsData = {}
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
      monthsData[key] = { month: key, success: 0, error: 0, warning: 0 }
    }
    filas.forEach((f) => {
      const date = asDate(f)
      const key = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
      if (monthsData[key]) {
        const s = toStatusFilas(f?.status ?? f?.codigoStatus ?? f?.situacao)
        monthsData[key][s] = (monthsData[key][s] || 0) + 1
      }
    })

    // Top erros por tipo SAP (7 dias)
    const errorByType = {}
    last7.forEach((f) => {
      const s = toStatusFilas(f?.status ?? f?.codigoStatus ?? f?.situacao)
      if (s !== 'error') return
      const raw = f
      const tipoSapKey = raw?.tipoSAP ?? raw?.tipoSap ?? raw?.tipo_sap ?? null
      const label = tipoSapKey != null ? tipoSapLabel(tipoSapKey) : 'Sem tipo SAP'
      errorByType[label] = (errorByType[label] || 0) + 1
    })
    const topErrors = Object.entries(errorByType)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)

    return {
      kpis: {
        total: { value: stats.total, delta: pct(t7, tP) },
        success: { value: stats.success, delta: pct(s7, sP) },
        error: { value: stats.error, delta: pct(e7, eP) },
        warning: { value: stats.warning, delta: pct(w7, wP) },
        successRate: { value: successRate, delta: successRateDelta },
      },
      chart: Object.values(monthsData),
      topErrors,
      health: (() => {
        const last6hStart = new Date(now)
        last6hStart.setHours(now.getHours() - 6)
        const last6 = filas.filter((f) => inRange(asDate(f), last6hStart, now))
        const s6 = countsIn(last6, (f) => toStatusFilas(f?.status ?? f?.codigoStatus ?? f?.situacao) === 'success')
        const e6 = countsIn(last6, (f) => toStatusFilas(f?.status ?? f?.codigoStatus ?? f?.situacao) === 'error')
        const d = s6 + e6 > 0 ? (e6 / (s6 + e6)) * 100 : 0
        if (d >= 10 || e6 >= 20) return { level: 'bad', message: `Erros acima do normal nas últimas 6h (${d.toFixed(1)}%)` }
        if (d >= 3 || e6 >= 5) return { level: 'warn', message: `Alguma degradação detectada (${d.toFixed(1)}% de erros)` }
        return { level: 'ok', message: 'Sem anomalias detectadas nas últimas horas' }
      })(),
    }
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const filas = await getFilas()
      const processedData = processFilasData(filas)
      setData(processedData)
    } catch {
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
        <div className="page-subtitle">Saúde atual, tendência e atalho para ação.</div>
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
          {/* Saúde do sistema */}
          {loading ? (
            <Skeleton className="h-14" />
          ) : (
            <SystemHealth level={data.health.level} message={data.health.message} />
          )}

          {/* Cards KPI com tendência */}
          <div className="kpi-grid">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20" />)
            ) : (
              <>
                <DashboardKpiCard
                  title="Total Filas"
                  value={data.kpis.total.value}
                  deltaPct={data.kpis.total.delta}
                  tone="neutral"
                  icon={<FiLayers />}
                  onClick={() => navigate('/filas')}
                />
                <DashboardKpiCard
                  title="Sucessos"
                  value={data.kpis.success.value}
                  deltaPct={data.kpis.success.delta}
                  tone="success"
                  icon={<FiCheckCircle />}
                  onClick={() => navigate('/filas', { state: { presetFilters: { status: 'success' } } })}
                />
                <DashboardKpiCard
                  title="Erros"
                  value={data.kpis.error.value}
                  deltaPct={data.kpis.error.delta}
                  tone="error"
                  icon={<FiXCircle />}
                  onClick={() => navigate('/filas', { state: { presetFilters: { status: 'error' } } })}
                />
                <DashboardKpiCard
                  title="Aguardando"
                  value={data.kpis.warning.value}
                  deltaPct={data.kpis.warning.delta}
                  tone="warning"
                  icon={<FiAlertTriangle />}
                  onClick={() => navigate('/filas', { state: { presetFilters: { status: 'warning' } } })}
                />
                <DashboardKpiCard
                  title="Taxa de Sucesso"
                  value={data.kpis.successRate?.value != null ? `${data.kpis.successRate.value.toFixed(1)}%` : '—'}
                  deltaPct={data.kpis.successRate?.delta ?? null}
                  tone={data.kpis.successRate?.value != null ? (data.kpis.successRate.value >= 98 ? 'success' : data.kpis.successRate.value >= 95 ? 'warning' : 'error') : 'neutral'}
                  icon={<FiTrendingUp />}
                  onClick={() => navigate('/filas', { state: { presetFilters: {} } })}
                />
              </>
            )}
          </div>

          {/* Gráfico + Diagnósticos */}
          <div className="dashboard-sections">
            <div className="section-left">
              {loading ? <Skeleton className="h-80" /> : <ProcessingChart data={data.chart} stacked />}
            </div>
            <div className="section-right">
              {loading ? (
                <Skeleton className="h-80" />
              ) : (
                <div className="right-grid">
                  <TopErrors items={data.topErrors} />
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
