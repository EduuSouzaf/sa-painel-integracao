import './LogsModal.css'
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
    return String(json ?? '—')
  }
}

function formatMaybeJson(value) {
  if (value === null || value === undefined) return { text: '—', html: null }
  try {
    const obj = typeof value === 'string' ? JSON.parse(value) : value
    return { text: JSON.stringify(obj, null, 2), html: syntaxHighlight(obj) }
  } catch {
    const s = String(value)
    // mesmo não sendo JSON válido, retorna texto simples
    return { text: s, html: null }
  }
}

export default function LogsModal({ open, onClose, logs = [], filaId }) {
  const [expandedFields, setExpandedFields] = useState({})

  const toggleExpand = (logId, fieldName) => {
    const key = `${logId}-${fieldName}`
    setExpandedFields(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const isExpanded = (logId, fieldName) => {
    return expandedFields[`${logId}-${fieldName}`] || false
  }

  if (!open) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <strong>Logs da Fila {filaId ?? ''}</strong>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="logs-body">
          {logs.map((l) => (
            <details key={l.id} className={`log-item ${l.levelClass}`}>
              <summary>
                <span className={`log-badge ${l.label === 'SUCESSO' ? 'success' : l.label === 'ERRO' ? 'error' : 'warning'}`}>{l.label}</span>
                <span className="log-time">{new Date(l.ts).toLocaleString('pt-BR')}</span>
                <span className="log-msg">{l.message}</span>
              </summary>
              <div className="log-details">
                <div className="detail-field"><strong>Detalhes:</strong></div>
                <div className="detail-field"><strong>Código Erro:</strong> {l.details.codigoErro ?? '—'}</div>
                <div className="detail-field"><strong>Linha:</strong> {l.details.linha ?? '—'}</div>
                <div className="detail-field"><strong>Classe:</strong> {l.details.classe ?? '—'}</div>
                <div className="detail-field"><strong>Método:</strong> {l.details.metodo ?? '—'}</div>
                <div className="detail-field">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong>Parametros:</strong>
                    {(() => {
                      const fmt = formatMaybeJson(l.details.parametros)
                      if (fmt.html) {
                        return (
                          <button 
                            className="expand-btn" 
                            onClick={() => toggleExpand(l.id, 'parametros')}
                            title={isExpanded(l.id, 'parametros') ? 'Recolher' : 'Expandir'}
                          >
                            {isExpanded(l.id, 'parametros') ? <FiMinimize2 size={14} /> : <FiMaximize2 size={14} />}
                          </button>
                        )
                      }
                      return null
                    })()}
                  </div>
                  {(() => {
                    const fmt = formatMaybeJson(l.details.parametros)
                    return fmt.html ? (
                      <pre className={`json-view json-highlighted ${isExpanded(l.id, 'parametros') ? 'expanded' : ''}`}><code dangerouslySetInnerHTML={{ __html: fmt.html }} /></pre>
                    ) : (
                      <pre className="json-view">{fmt.text}</pre>
                    )
                  })()}
                </div>
                <div className="detail-field"><strong>StackTrace:</strong>
                  <pre className="json-view">{String(l.details.stackTrace ?? '—')}</pre>
                </div>
                <div className="detail-field">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong>Json:</strong>
                    {(() => {
                      const fmt = formatMaybeJson(l.details.json)
                      if (fmt.html) {
                        return (
                          <button 
                            className="expand-btn" 
                            onClick={() => toggleExpand(l.id, 'json')}
                            title={isExpanded(l.id, 'json') ? 'Recolher' : 'Expandir'}
                          >
                            {isExpanded(l.id, 'json') ? <FiMinimize2 size={14} /> : <FiMaximize2 size={14} />}
                          </button>
                        )
                      }
                      return null
                    })()}
                  </div>
                  {(() => {
                    const fmt = formatMaybeJson(l.details.json)
                    return fmt.html ? (
                      <pre className={`json-view json-highlighted ${isExpanded(l.id, 'json') ? 'expanded' : ''}`}><code dangerouslySetInnerHTML={{ __html: fmt.html }} /></pre>
                    ) : (
                      <pre className="json-view">{fmt.text}</pre>
                    )
                  })()}
                </div>
                <div className="detail-field"><strong>Xml:</strong>
                  <pre className="json-view">{String(l.details.xml ?? '—')}</pre>
                </div>
                <div className="detail-field"><strong>Livre:</strong>
                  <pre className="json-view">{String(l.details.livre ?? '—')}</pre>
                </div>
                <div className="detail-field"><strong>Mensagem:</strong> {l.details.mensagem ?? '—'}</div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
