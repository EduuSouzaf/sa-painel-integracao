import { http, HttpResponse, delay } from 'msw'
import { dashboardHandlers } from './dashboard'
import { filasHandlers } from './filas'

export const handlers = [
  // Auth
  http.post('/login', async ({ request }) => {
    const { email, password } = await request.json()
    await delay(400)
    if (email === 'admin@admin.com' && password === 'admin') {
      return HttpResponse.json({
        token: 'mock-token-123',
        user: { id: 1, name: 'Administrador', email },
      })
    }
    return HttpResponse.json({ message: 'Credenciais inválidas' }, { status: 401 })
  }),
  ...dashboardHandlers,
  ...filasHandlers,
]
