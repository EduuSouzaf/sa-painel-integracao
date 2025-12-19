import { http, HttpResponse, delay } from 'msw'

const statuses = ['success', 'error', 'warning', 'neutral']
const flows = ['importacao', 'exportacao', 'validacao']
const types = ['pedido', 'nota', 'produto']

let items = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  createdAt: new Date(Date.now() - Math.random() * 1e10).toISOString(),
  status: statuses[Math.floor(Math.random() * statuses.length)],
  flow: flows[Math.floor(Math.random() * flows.length)],
  type: types[Math.floor(Math.random() * types.length)],
  attempts: Math.floor(Math.random() * 3),
  payload: { ref: `OBJ-${1000 + i}`, random: Math.random().toString(36).slice(2) },
}))

export const filasHandlers = [
  // Lista
  http.get('/filas', async () => {
    await delay(500)
    return HttpResponse.json({ data: items })
  }),

  // Logs por item
  http.get('/filas/:id/logs', async ({ params }) => {
    await delay(400)
    const id = Number(params.id)
    const colorBy = ['green', 'yellow', 'red', 'gray']
    const logs = Array.from({ length: 5 }, (_, i) => ({
      id: `${id}-${i}`,
      level: colorBy[i % colorBy.length],
      ts: new Date(Date.now() - i * 60000).toISOString(),
      message: `Log ${i + 1} do item ${id}`,
      details: { step: i + 1, meta: Math.random().toString(36).slice(2, 8) },
    }))
    return HttpResponse.json({ data: logs })
  }),

  // Reprocessar
  http.post('/filas/:id/reprocessar', async ({ params }) => {
    await delay(700)
    const id = Number(params.id)
    items = items.map((it) => (it.id === id ? { ...it, status: 'success', attempts: it.attempts + 1 } : it))
    return HttpResponse.json({ ok: true })
  }),
]
