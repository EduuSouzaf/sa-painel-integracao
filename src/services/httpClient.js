import axios from 'axios'
import { resolveBaseURL, TIMEOUT } from '../config/apiConfig'

export const http = axios.create({
  baseURL: resolveBaseURL(),
  timeout: TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
})

// Permite atualizar a baseURL depois que o app-config é carregado
export function setBaseURL(url) {
  http.defaults.baseURL = url || resolveBaseURL()
}

// Permite registrar um handler externo para 401
let unauthorizedHandler = null
export function onUnauthorized(handler) { unauthorizedHandler = handler }

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      unauthorizedHandler?.(err)
    }
    return Promise.reject(err)
  },
)
