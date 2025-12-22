import { useState, useRef, useEffect } from 'react'
import { FiMoreVertical, FiEye, FiFileText, FiRefreshCw, FiCode } from 'react-icons/fi'
import './ActionsMenu.css'

export default function ActionsMenu({ row, onView, onLogs, onReprocess, onViewJson }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const actions = [
    {
      id: 'logs',
      icon: <FiFileText size={16} />,
      label: 'Logs',
      action: () => {
        onLogs(row)
        setOpen(false)
      },
      show: true,
    },
    {
      id: 'detalhes',
      icon: <FiEye size={16} />,
      label: 'Detalhes',
      action: () => {
        onView(row)
        setOpen(false)
      },
      show: true,
    },
    {
      id: 'reprocessar',
      icon: <FiRefreshCw size={16} />,
      label: 'Reprocessar',
      action: () => {
        onReprocess(row)
        setOpen(false)
      },
      show: row.status === 'error',
    },
    {
      id: 'envio',
      icon: <FiCode size={16} />,
      label: 'Envio',
      action: () => {
        onViewJson?.(row, 'envio', 'Envio')
        setOpen(false)
      },
      show: !!row?.raw?.envio,
    },
    {
      id: 'envio-original',
      icon: <FiCode size={16} />,
      label: 'Envio Original',
      action: () => {
        onViewJson?.(row, 'envioOriginal', 'Envio Original')
        setOpen(false)
      },
      show: !!row?.raw?.envioOriginal,
    },
  ]

  const visibleActions = actions.filter(a => a.show)

  return (
    <div className="actions-menu-wrapper" ref={menuRef}>
      <button
        className="actions-menu-trigger"
        onClick={() => setOpen(!open)}
        title="Ver mais ações"
        aria-label="Menu de ações"
      >
        <FiMoreVertical size={18} />
      </button>

      {open && (
        <div className="actions-menu-dropdown">
          {visibleActions.map((action) => (
            <button
              key={action.id}
              className="menu-item"
              onClick={action.action}
              title={action.label}
            >
              <span className="menu-icon">{action.icon}</span>
              <span className="menu-label">{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
