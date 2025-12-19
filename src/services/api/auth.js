import { http } from '../httpClient'

// Credenciais válidas padrão (fallback offline)
const VALID_CREDENTIALS = [
  { email: 'admin@admin.com', password: 'admin', name: 'Administrador' },
  { email: 'user@user.com', password: 'user123', name: 'Usuário' }
]

export async function loginApi({ email, password }) {
  try {
    const { data } = await http.post('/login', { email, password })
    
    // Valida a estrutura da resposta
    if (!data) {
      throw new Error('Resposta inválida do servidor')
    }
    
    // Se a API retornar { success: false, message }
    if (data.success === false) {
      throw new Error(data.message || 'Falha ao autenticar')
    }
    
    // Verifica se tem token e user (direto ou dentro de data.data)
    const responseData = data.data || data
    
    if (!responseData.token || !responseData.user) {
      throw new Error('Credenciais inválidas')
    }
    
    return { success: true, ...responseData, error: null }
  } catch (e) {
    const errorMessage = e?.response?.data?.message || e.message || 'Erro de conexão com o servidor'
    
    // Validar credenciais localmente se API falhar
    const validCred = VALID_CREDENTIALS.find(c => c.email === email && c.password === password)
    
    if (validCred) {
      // Credenciais corretas - permitir login mesmo que API falhe
      return {
        success: true,
        token: `offline-${Date.now()}`,
        user: { id: null, name: validCred.name, email },
        offline: true,
        error: errorMessage
      }
    }
    
    // Credenciais incorretas - rejeitar
    throw new Error('Email ou senha incorretos')
  }
}
