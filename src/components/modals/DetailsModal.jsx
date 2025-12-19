import './DetailsModal.css'
import { useState } from 'react'
import { FiMaximize2, FiMinimize2 } from 'react-icons/fi'

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
  
  if (!open) return null
  
  const formatMaybeJson = (val) => {
    if (val === null || val === undefined) return { text: 'null', html: null }
    try {
      const obj = typeof val === 'string' ? JSON.parse(val) : val
      return { text: JSON.stringify(obj, null, 2), html: syntaxHighlight(obj) }
    } catch {
      // não é JSON válido, retorna texto simples
      return { text: String(val), html: null }
    }
  }
  
  const toggleExpand = (field) => {
    setExpanded(prev => ({ ...prev, [field]: !prev[field] }))
  }
  
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-details" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <strong>Detalhes da Fila {data?.id || ''}</strong>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
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
          <div className="detail-field">
            <strong>Mensagem:</strong> {String(data?.mensagem ?? '—')}
          </div>
          <div className="detail-field">
            <strong>StackTrace:</strong>
            <div className="detail-content">{String(data?.stackTrace ?? '—')}</div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-close" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  )
}
