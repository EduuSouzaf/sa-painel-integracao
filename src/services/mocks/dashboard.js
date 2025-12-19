import { http, HttpResponse, delay } from 'msw'

const monthly = Array.from({ length: 12 }, (_, i) => ({
  month: new Date(0, i).toLocaleString('pt-BR', { month: 'short' }),
  success: Math.floor(50 + Math.random() * 150),
  error: Math.floor(Math.random() * 40),
  pending: Math.floor(10 + Math.random() * 60),
}))

export const dashboardHandlers = [
  http.get('/dashboard', async () => {
    await delay(600)
    return HttpResponse.json({
      kpis: [
        { id: 'k1', title: 'Sucesso', value: 3245, status: 'success' },
        { id: 'k2', title: 'Erros', value: 128, status: 'error' },
        { id: 'k3', title: 'Aguardando', value: 412, status: 'warning' },
      ],
      chart: monthly,
    })
  }),
]
