import './Header.css'
import Button from '../common/Button'
import { useTheme } from '../../hooks/useTheme'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiSun, FiMoon, FiLogOut } from 'react-icons/fi'

export default function Header({ onToggleSidebar, collapsed }) {
  const { theme, toggle } = useTheme()
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const pageTitle = (() => {
    const p = location.pathname || ''
    if (p.startsWith('/filas')) return 'Gerenciamento de Filas'
    if (p.startsWith('/dashboard')) return 'Dashboard'
    if (p.startsWith('/login')) return 'Login'
    return 'Painel Integrações'
  })()

  return (
    <header className={`app-header ${collapsed ? 'collapsed' : ''}`}>
      <div className="left">
        <button className="hamburger" onClick={onToggleSidebar} aria-label="Alternar menu">
          <span />
          <span />
          <span />
        </button>
        <h1 className="page-title" title={pageTitle}>{pageTitle}</h1>
      </div>
      <div className="right">
        <Button variant="ghost" className="header-button" onClick={toggle} aria-label="Alternar tema">
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </Button>
        {user ? (
          <Button variant="ghost" className="header-button" onClick={() => { logout(); navigate('/login') }}>
            <FiLogOut />
          </Button>
        ) : null}
      </div>
    </header>
  )
}
