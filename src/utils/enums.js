export const StatusEnum = Object.freeze({ SUCCESS: 'success', ERROR: 'error', WARNING: 'warning', NEUTRAL: 'neutral' })

export const FluxoEnum = Object.freeze({ IMPORTACAO: 'importacao', EXPORTACAO: 'exportacao', VALIDACAO: 'validacao' })

export const TipoObjetoEnum = Object.freeze({ PEDIDO: 'pedido', NOTA: 'nota', PRODUTO: 'produto' })

export const MetodoEnum = Object.freeze({ CREATE: 'create', UPDATE: 'update', DELETE: 'delete', CONSULTA: 'consulta' })

export function toStatus(v) {
  if (typeof v === 'string') {
    const s = v.toLowerCase()
    if (['success', 'error', 'warning', 'neutral'].includes(s)) return s
    if (['ok', 'sucesso', 'concluido', 'concluído'].includes(s)) return StatusEnum.SUCCESS
    if (['fail', 'failed', 'erro'].includes(s)) return StatusEnum.ERROR
    if (['warn', 'aviso'].includes(s)) return StatusEnum.WARNING
    return StatusEnum.NEUTRAL
  }
  if (typeof v === 'number') {
    if (v === 1) return StatusEnum.SUCCESS
    if (v === 2) return StatusEnum.ERROR
    if (v === 3) return StatusEnum.WARNING
    return StatusEnum.NEUTRAL
  }
  return StatusEnum.NEUTRAL
}

const lower = (v) => (typeof v === 'string' ? v.toLowerCase() : typeof v === 'number' ? String(v).toLowerCase() : '')

export function statusLabel(s) {
  const k = lower(s)
  return k === 'success' ? 'Sucesso' : k === 'error' ? 'Erro' : k === 'warning' ? 'Pendente' : 'Neutro'
}

export function statusColor(s) {
  const k = lower(s)
  return k === 'success' ? 'green' : k === 'error' ? 'red' : k === 'warning' ? 'amber' : 'gray'
}

export function toFluxo(v) {
  if (typeof v === 'string') {
    const s = v.toLowerCase()
    if (['importacao', 'importação'].includes(s)) return FluxoEnum.IMPORTACAO
    if (['exportacao', 'exportação'].includes(s)) return FluxoEnum.EXPORTACAO
    if (['validacao', 'validação'].includes(s)) return FluxoEnum.VALIDACAO
    return FluxoEnum.IMPORTACAO
  }
  if (typeof v === 'number') {
    if (v === 1) return FluxoEnum.IMPORTACAO
    if (v === 2) return FluxoEnum.EXPORTACAO
    if (v === 3) return FluxoEnum.VALIDACAO
    return FluxoEnum.IMPORTACAO
  }
  return FluxoEnum.IMPORTACAO
}

export function fluxoLabel(f) {
  const k = lower(f)
  return k === 'importacao' ? 'Importação' : k === 'exportacao' ? 'Exportação' : k === 'validacao' ? 'Validação' : 'Importação'
}

export function toTipo(v) {
  if (typeof v === 'string') return v.toLowerCase()
  if (typeof v === 'number') return v === 1 ? 'pedido' : v === 2 ? 'nota' : v === 3 ? 'produto' : 'desconhecido'
  return 'desconhecido'
}

export function tipoLabel(t) {
  const k = lower(t)
  return k === 'pedido' ? 'Pedido' : k === 'nota' ? 'Nota' : k === 'produto' ? 'Produto' : 'Desconhecido'
}

export function toMetodo(v) {
  if (typeof v === 'string') {
    const s = v.toLowerCase()
    if (['create', 'inserir', 'inclusao', 'inclusão'].includes(s)) return MetodoEnum.CREATE
    if (['update', 'atualizar', 'atualizacao', 'atualização'].includes(s)) return MetodoEnum.UPDATE
    if (['delete', 'excluir', 'remocao', 'remoção'].includes(s)) return MetodoEnum.DELETE
    if (['consulta', 'get', 'read'].includes(s)) return MetodoEnum.CONSULTA
    return MetodoEnum.CONSULTA
  }
  if (typeof v === 'number') {
    if (v === 1) return MetodoEnum.CREATE
    if (v === 2) return MetodoEnum.UPDATE
    if (v === 3) return MetodoEnum.DELETE
    if (v === 4) return MetodoEnum.CONSULTA
    return MetodoEnum.CONSULTA
  }
  return MetodoEnum.CONSULTA
}

export function metodoLabel(m) {
  const k = lower(m)
  return k === 'create' ? 'CREATE' : k === 'update' ? 'UPDATE' : k === 'delete' ? 'DELETE' : 'CONSULTA'
}
