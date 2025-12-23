import './Sidebar.css'
import logo from '../../assets/SaaSAgro.png'
import { NavLink } from 'react-router-dom'
import { FiActivity, FiList } from 'react-icons/fi'

export default function Sidebar({ collapsed }) {
  return (
    <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="logo-container" aria-label="Logo SaaSAgro">
        <img src={logo} alt="SaaSAgro" className="logo-image" />
      </div>
      <nav>
        <NavLink to="/dashboard" title="Dashboard" aria-label="Dashboard" className={({ isActive }) => `link ${isActive ? 'active' : ''}`}>
          <FiActivity /> <span>Dashboard</span>
        </NavLink>
        <NavLink to="/filas" title="Filas" aria-label="Filas" className={({ isActive }) => `link ${isActive ? 'active' : ''}`}>
          <FiList /> <span>Filas</span>
        </NavLink>
      </nav>
    </aside>
  )
}
