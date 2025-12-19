import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { AlertProvider } from './contexts/AlertContext'

async function bootstrap() {
  // Aguarda até window.__APP_CONFIG__ estar disponível (carregado pelo index.html)
  let attempts = 0;
  while (!window.__APP_CONFIG__ && attempts < 100) {
    await new Promise(resolve => setTimeout(resolve, 50));
    attempts++;
  }

  if (!window.__APP_CONFIG__) {
    console.warn('[Bootstrap] Timeout aguardando app-config, carregando manualmente...');
    try {
      const res = await fetch('/app-config.json', { cache: 'no-store' })
      if (res.ok) {
        const cfg = await res.json()
        window.__APP_CONFIG__ = cfg
      } else {
        window.__APP_CONFIG__ = {}
      }
    } catch {
      window.__APP_CONFIG__ = {}
    }
  }

  if (import.meta.env.DEV) {
    const USE_MSW = import.meta.env.VITE_USE_MSW !== 'false'
    console.log('[Bootstrap] MSW habilitado:', USE_MSW)
    if (USE_MSW) {
      const { worker } = await import('./services/mocks/browser.js')
      await worker.start({ onUnhandledRequest: 'bypass' })
      console.log('[MSW] Mock Service Worker iniciado')
    }
  }

  console.log('[Bootstrap] API Base URL:', window.__APP_CONFIG__?.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || '/api')

  // Aplicar baseURL atualizado ao axios após carregar o app-config
  try {
    const [httpMod, cfgMod] = await Promise.all([
      import('./services/httpClient'),
      import('./config/apiConfig'),
    ])
    httpMod.setBaseURL(cfgMod.resolveBaseURL())
    console.log('[Bootstrap] axios.baseURL aplicado:', httpMod.http?.defaults?.baseURL)
  } catch (e) {
    console.warn('[Bootstrap] Não foi possível aplicar baseURL dinâmico:', e)
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ThemeProvider>
        <AuthProvider>
          <AlertProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </AlertProvider>
        </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>,
  )
}

bootstrap()
