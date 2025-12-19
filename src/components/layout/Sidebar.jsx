import './Sidebar.css'
import logo from '../../assets/SaaSAgro.png'
import { NavLink } from 'react-router-dom'
import { FiActivity, FiList } from 'react-icons/fi'

export default function Sidebar({ collapsed }) {
  return (
    <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <img src={logo} alt="SaaSAgro" className="sidebar-logo" />
        {/* Removido texto: apenas a logo conforme solicitado */}
      </div>
      <nav>
        <NavLink to="/dashboard" className={({ isActive }) => `link ${isActive ? 'active' : ''}`}>
          <FiActivity /> <span>Dashboard</span>
        </NavLink>
        <NavLink to="/filas" className={({ isActive }) => `link ${isActive ? 'active' : ''}`}>
          <FiList /> <span>Filas</span>
        </NavLink>
      </nav>
    </aside>
  )
}
