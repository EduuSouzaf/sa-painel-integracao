import React from 'react';
import './Modal.css';

function copy(text) {
  try {
    navigator.clipboard.writeText(text)
  } catch (e) {
    console.log('Clipboard copy failed:', e)
  }
}

function syntaxHighlight(json) {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, null, 2);
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/"(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, function (match) {
    let cls = 'json-number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'json-key';
      } else {
        cls = 'json-string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'json-boolean';
    } else if (/null/.test(match)) {
      cls = 'json-null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}

export default function JsonViewer({ data, title = 'JSON', onClose }) {
  let pretty = '';
  let highlighted = '';
  let isJson = false;
  
  try {
    // Se data é uma string, tenta fazer parse primeiro para indentar
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    pretty = JSON.stringify(parsed, null, 2);
    highlighted = syntaxHighlight(parsed);
    isJson = true;
  } catch {
    // Se falhar o parse, tenta stringify direto ou converte para string
    try { 
      pretty = JSON.stringify(data, null, 2); 
      highlighted = syntaxHighlight(data);
      isJson = true;
    } catch { 
      pretty = String(data ?? ''); 
      highlighted = pretty;
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ width: 820 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <strong>{title}</strong>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="modal-close" onClick={() => copy(pretty)} title="Copiar JSON">Copiar</button>
            <button className="modal-close" onClick={onClose} aria-label="Fechar">✕</button>
          </div>
        </div>
        <div className="modal-content" style={{ background: 'var(--bg)', padding: 0 }}>
          <pre style={{ margin: 0, padding: 12, overflow: 'auto', maxHeight: '70vh' }} className="json-highlighted">
            <code dangerouslySetInnerHTML={{ __html: highlighted }} />
          </pre>
        </div>
      </div>
    </div>
  );
}
