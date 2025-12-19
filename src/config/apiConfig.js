// Resolvedor dinâmico: lê a URL da API em runtime
export const resolveBaseURL = () => {
	const runtime = (typeof window !== 'undefined' && window.__APP_CONFIG__) || {}
	return runtime.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || '/api'
}

// Valores padrão (mantidos para compatibilidade)
export const BASE_URL = resolveBaseURL()
export const TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT || 15000)
