import './BarChartAnimated.css'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function BarChartAnimated({ data }) {
  return (
    <div className="section-card">
      <div className="section-head">
        <div className="section-title">Volume de Processamento</div>
        <div className="section-sub">Histórico de filas processadas nos últimos 6 meses</div>
      </div>
      <div className="section-body">
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" stroke="var(--muted)" />
            <YAxis stroke="var(--muted)" />
            <Tooltip contentStyle={{ background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: '8px' }} />
            <Bar dataKey="total" name="Total de Filas" fill="#3b82f6" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
