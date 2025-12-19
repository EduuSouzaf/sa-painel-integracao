import './App.css'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import { Outlet, Route, Routes, Navigate, useLocation } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import FilasPage from './pages/FilasPage'
import { useState } from 'react'
import { useAuth } from './hooks/useAuth'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="app-shell">
      <Header collapsed={collapsed} onToggleSidebar={() => setCollapsed((s) => !s)} />
      <Sidebar collapsed={collapsed} />
      <main className={`app-content ${collapsed ? 'content-collapsed' : ''}`}>
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/filas" element={<FilasPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
