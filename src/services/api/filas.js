import { http } from '../httpClient'

export async function getFilas() {
  const { data } = await http.get('/fila')
  if (data?.success === false) throw new Error(data?.message || 'Falha ao obter filas')
  return data?.data ?? []
}

export async function getLogsById(id) {
  const { data } = await http.get(`/logs/${id}`)
  if (data?.success === false) throw new Error(data?.message || 'Falha ao obter logs')
  const items = data?.data?.result ?? []
  return items.map((x) => ({
    id: x.id,
    ts: x.createdAt || x.data,
    message: x.mensagem,
    level: x.tipo,
    levelClass: x.tipo === 0 ? 'log-green' : x.tipo === 1 ? 'log-red' : 'log-yellow',
    label: x.tipo === 0 ? 'SUCESSO' : x.tipo === 1 ? 'ERRO' : x.tipo === 2 ? 'AVISO' : 'INFO',
    details: {
      codigoErro: x.codigoErro,
      linha: x.linha,
      classe: x.classe,
      metodo: x.metodo,
      parametros: x.parametros,
      stackTrace: x.stackTrace,
      json: x.json,
      xml: x.xml,
      livre: x.livre,
      mensagem: x.mensagem,
    },
  }))
}

export async function reprocessar(id) {
  const { data } = await http.post(`/reprocessafila/${id}`)
  if (data?.success === false) throw new Error(data?.message || 'Falha ao reprocessar')
  return data
}

export async function reprocessarErros() {
  // Endpoint para reprocessamento em lote de registros com status ERRO
  const { data } = await http.post('/reprocessafila/errors')
  if (data?.success === false) throw new Error(data?.message || 'Falha ao reprocessar erros')
  return data
}
