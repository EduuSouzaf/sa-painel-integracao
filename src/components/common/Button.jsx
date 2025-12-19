import './Button.css'

export default function Button({ children, variant = 'primary', loading = false, className = '', ...props }) {
  return (
    <button className={`btn btn-${variant} ${loading ? 'btn-loading' : ''} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? <span className="spinner" /> : null}
      <span className="btn-text">{children}</span>
    </button>
  )
}
