import './ProcessingChart.css'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function ProcessingChart({ data, stacked = true }) {
  return (
    <div className="section-card">
      <div className="section-head">
        <div className="section-title">Volume de Processamento</div>
        <div className="section-sub">Sucessos, erros e pendências por mês</div>
      </div>
      <div className="section-body">
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" stroke="var(--muted)" />
            <YAxis stroke="var(--muted)" />
            <Tooltip contentStyle={{ background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: '8px' }} />
            <Legend />
            <Bar dataKey="success" name="Sucesso" fill="#10b981" stackId={stacked ? 'a' : undefined} radius={[4,4,0,0]} />
            <Bar dataKey="error" name="Erro" fill="#ef4444" stackId={stacked ? 'a' : undefined} radius={[4,4,0,0]} />
            <Bar dataKey="warning" name="Aguardando" fill="#f59e0b" stackId={stacked ? 'a' : undefined} radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
