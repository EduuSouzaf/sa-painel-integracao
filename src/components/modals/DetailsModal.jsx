import './DetailsModal.css'
import { useState } from 'react'
import { FiMaximize2, FiMinimize2, FiCheckCircle, FiAlertCircle, FiClock, FiMessageSquare } from 'react-icons/fi'

function syntaxHighlight(json) {
  try {
    if (typeof json !== 'string') json = JSON.stringify(json, null, 2)
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    return json.replace(/"(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, function (match) {
      let cls = 'json-number'
      if (/^"/.test(match)) {
        if (/:$/.test(match)) cls = 'json-key'
        else cls = 'json-string'
      } else if (/true|false/.test(match)) cls = 'json-boolean'
      else if (/null/.test(match)) cls = 'json-null'
      return '<span class="' + cls + '">' + match + '</span>'
    })
  } catch {
    return null
  }
}

export default function DetailsModal({ open, onClose, data }) {
  const [expanded, setExpanded] = useState({})
  const [activeTab, setActiveTab] = useState('timeline')
  
  if (!open) return null
  
  const formatMaybeJson = (val) => {
    if (val === null || val === undefined) return { text: 'null', html: null }
    try {
      const obj = typeof val === 'string' ? JSON.parse(val) : val
      return { text: JSON.stringify(obj, null, 2), html: syntaxHighlight(obj) }
    } catch {
      return { text: String(val), html: null }
    }
  }
  
  const toggleExpand = (field) => {
    setExpanded(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const timelineEvents = [
    {
      id: 'created',
      type: 'created',
      time: data?.createdAt ? new Date(data.createdAt).toLocaleString('pt-BR') : 'N/A',
      title: 'Registro criado',
      icon: <FiClock size={16} />,
    },
    {
      id: 'processed',
      type: data?.status === 'success' ? 'success' : 'error',
      time: data?.createdAt ? new Date(data.createdAt).toLocaleString('pt-BR') : 'N/A',
      title: data?.status === 'success' ? 'Processado com sucesso' : 'Erro no processamento',
      icon: data?.status === 'success' ? <FiCheckCircle size={16} /> : <FiAlertCircle size={16} />,
      details: data?.mensagem || 'Sem detalhes',
    },
  ]
  
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-details-rich" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <strong>Detalhes da Fila {data?.id || ''}</strong>
            <span className="modal-status-badge" style={{ marginLeft: '12px', opacity: 0.7 }}>
              {data?.status === 'success' ? '✓ Sucesso' : data?.status === 'error' ? '✗ Erro' : '⏳ Pendente'}
            </span>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-tabs">
          <button 
            className={`tab ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            Timeline do Processamento
          </button>
          <button 
            className={`tab ${activeTab === 'technical' ? 'active' : ''}`}
            onClick={() => setActiveTab('technical')}
          >
            Dados Técnicos
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'timeline' && (
            <div className="timeline-container">
              {timelineEvents.map((event, idx) => (
                <div key={event.id} className={`timeline-event timeline-${event.type}`}>
                  <div className="timeline-marker">
                    {event.icon}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title">{event.title}</div>
                    <div className="timeline-time">{event.time}</div>
                    {event.details && (
                      <div className="timeline-details">{event.details}</div>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="timeline-info">
                <strong>Tentativas:</strong> {data?.attempts || 0}
              </div>
            </div>
          )}

          {activeTab === 'technical' && (
            <div className="technical-container">
              <div className="detail-field">
                <div className="detail-header">
                  <strong>Envio Original:</strong>
                  <button className="btn-expand" onClick={() => toggleExpand('envioOriginal')} title={expanded.envioOriginal ? 'Recolher' : 'Expandir'}>
                    {expanded.envioOriginal ? <FiMinimize2 size={14} /> : <FiMaximize2 size={14} />}
                  </button>
                </div>
                {(() => {
                  const fmt = formatMaybeJson(data?.envioOriginal)
                  return fmt.html ? (
                    <pre className={`detail-content ${expanded.envioOriginal ? 'expanded' : 'scrollable'} json-highlighted`}>
                      <code dangerouslySetInnerHTML={{ __html: fmt.html }} />
                    </pre>
                  ) : (
                    <div className={`detail-content ${expanded.envioOriginal ? 'expanded' : 'scrollable'}`}>{fmt.text}</div>
                  )
                })()}
              </div>

              <div className="detail-field">
                <div className="detail-header">
                  <strong>Envio:</strong>
                  <button className="btn-expand" onClick={() => toggleExpand('envio')} title={expanded.envio ? 'Recolher' : 'Expandir'}>
                    {expanded.envio ? <FiMinimize2 size={14} /> : <FiMaximize2 size={14} />}
                  </button>
                </div>
                {(() => {
                  const fmt = formatMaybeJson(data?.envio)
                  return fmt.html ? (
                    <pre className={`detail-content ${expanded.envio ? 'expanded' : 'scrollable'} json-highlighted`}>
                      <code dangerouslySetInnerHTML={{ __html: fmt.html }} />
                    </pre>
                  ) : (
                    <div className={`detail-content ${expanded.envio ? 'expanded' : 'scrollable'}`}>{fmt.text}</div>
                  )
                })()}
              </div>

              <div className="detail-field">
                <div className="detail-header">
                  <strong>Resposta:</strong>
                  <button className="btn-expand" onClick={() => toggleExpand('resposta')} title={expanded.resposta ? 'Recolher' : 'Expandir'}>
                    {expanded.resposta ? <FiMinimize2 size={14} /> : <FiMaximize2 size={14} />}
                  </button>
                </div>
                {(() => {
                  const fmt = formatMaybeJson(data?.resposta)
                  return fmt.html ? (
                    <pre className={`detail-content ${expanded.resposta ? 'expanded' : 'scrollable'} json-highlighted`}>
                      <code dangerouslySetInnerHTML={{ __html: fmt.html }} />
                    </pre>
                  ) : (
                    <div className={`detail-content ${expanded.resposta ? 'expanded' : 'scrollable'}`}>{fmt.text}</div>
                  )
                })()}
              </div>

              {data?.mensagem && (
                <div className="detail-field">
                  <strong>Mensagem:</strong> 
                  <div className="detail-content">{String(data.mensagem)}</div>
                </div>
              )}

              {data?.stackTrace && (
                <div className="detail-field">
                  <strong>Stack Trace:</strong>
                  <div className="detail-content">
                    <pre>{String(data.stackTrace)}</pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-close" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  )
}
