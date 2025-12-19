import './Header.css'
import Button from '../common/Button'
import { useTheme } from '../../hooks/useTheme'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { FiSun, FiMoon, FiLogOut } from 'react-icons/fi'

export default function Header({ onToggleSidebar, collapsed }) {
  const { theme, toggle } = useTheme()
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  return (
    <header className={`app-header ${collapsed ? 'collapsed' : ''}`}>
      <div className="left">
        <button className="hamburger" onClick={onToggleSidebar} aria-label="Alternar menu">
          <span />
          <span />
          <span />
        </button>
        <h1 className="logo">Painel Integrações</h1>
      </div>
      <div className="right">
        <Button variant="ghost" onClick={toggle} aria-label="Alternar tema">
          {theme === 'dark' ? <FiSun /> : <FiMoon />} {theme === 'dark' ? 'Claro' : 'Escuro'}
        </Button>
        {user ? (
          <Button variant="ghost" onClick={() => { logout(); navigate('/login') }}>
            <FiLogOut /> Sair
          </Button>
        ) : null}
      </div>
    </header>
  )
}
