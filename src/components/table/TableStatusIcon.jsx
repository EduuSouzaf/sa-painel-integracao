import './TableStatusIcon.css'
import { StatusEnum } from '../../utils/enums'

export default function TableStatusIcon({ status = 'neutral' }) {
  const color =
    status === StatusEnum.SUCCESS ? '#16a34a' : status === StatusEnum.ERROR ? '#dc2626' : status === StatusEnum.WARNING ? '#d97706' : '#6b7280'
  return (
    <span className="status-icon" title={status}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill={color} xmlns="http://www.w3.org/2000/svg">
        <circle cx="5" cy="5" r="5" />
      </svg>
    </span>
  )
}
