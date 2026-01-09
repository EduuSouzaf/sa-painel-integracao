import { useState, useRef, useEffect } from 'react'
import { FiMoreVertical, FiEye, FiFileText, FiRefreshCw, FiCode } from 'react-icons/fi'
import './ActionsMenu.css'

export default function ActionsMenu({ row, onView, onLogs, onReprocess, onViewJson }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const triggerRef = useRef(null)
  const [coords, setCoords] = useState({ top: 0, right: 0 })

  const updatePosition = () => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const estHeight = 240
    const gap = 6
    const openDown = rect.bottom + estHeight <= window.innerHeight
    const top = openDown ? rect.bottom + gap : Math.max(8, rect.top - estHeight - gap)
    const right = Math.max(8, window.innerWidth - rect.right - 4)
    setCoords({ top, right })
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!open) return
    updatePosition()
    const handleWindowChange = () => updatePosition()
    window.addEventListener('scroll', handleWindowChange, true)
    window.addEventListener('resize', handleWindowChange)
    return () => {
      window.removeEventListener('scroll', handleWindowChange, true)
      window.removeEventListener('resize', handleWindowChange)
    }
  }, [open])

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
        onClick={() => {
          const next = !open
          if (next) updatePosition()
          setOpen(next)
        }}
        title="Ver mais ações"
        aria-label="Menu de ações"
        ref={triggerRef}
      >
        <FiMoreVertical size={18} />
      </button>

      {open && (
        <div className="actions-menu-dropdown" style={{ top: coords.top, right: coords.right }}>
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
