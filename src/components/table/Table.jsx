import './Table.css'
import { useEffect, useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import Badge from '../common/Badge'
import Skeleton from '../common/Skeleton'
import Button from '../common/Button'
import { statusLabel, statusColor } from '../../utils/enums'
import { fluxoFilasLabel, metodoFilasLabel, tipoAgroLabel, tipoSapLabel } from '../../utils/filasEnums'
import { FiEye, FiFileText, FiRefreshCw, FiCode, FiFile, FiCheckSquare } from 'react-icons/fi'

export default function Table({ data, loading, onView, onLogs, onReprocess, onViewJson }) {
  const columns = useMemo(
    () => [
      { header: 'ID', accessorKey: 'id' },
      {
        header: 'Data',
        accessorKey: 'createdAt',
        cell: (info) => new Date(info.getValue()).toLocaleString('pt-BR'),
      },
      {
        header: 'Base SAP',
        cell: ({ row }) => row.original?.raw?.baseDadosSAP ?? '—',
      },
      {
        header: 'Base Agro',
        cell: ({ row }) => row.original?.raw?.baseDadosAgro ?? '—',
      },
      {
        header: 'Tipo SAP',
        cell: ({ row }) => tipoSapLabel(row.original?.raw?.tipoSAP),
      },
      {
        header: 'Tipo Agro',
        cell: ({ row }) => tipoAgroLabel(row.original?.raw?.tipoAgro),
      },
      {
        header: 'Fluxo',
        accessorKey: 'flow',
        cell: ({ row }) => {
          const fluxoKey = row.original?.raw?.fluxo
          const label = fluxoFilasLabel(fluxoKey)
          const status = row.original?.status
          let color = '#adb5bd'
          if (status === 'success') color = '#198754'
          else if (status === 'error') color = '#dc3545'
          else if (status === 'warning') color = '#ffc107'
          const isIn = Number(fluxoKey) === 1
          const isOut = Number(fluxoKey) === 2
          const arrow = isIn || isOut ? (
            <svg width="22" height="22" viewBox="0 0 22 22" style={{ verticalAlign: 'middle' }}>
              <circle cx="11" cy="11" r="10" fill={color} />
              {isIn ? (
                <path d="M11 7v7M11 14l-3-3M11 14l3-3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              ) : (
                <path d="M11 15V8M11 8l-3 3M11 8l3 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              )}
            </svg>
          ) : null
          return (
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              <span style={{ marginRight: 6 }}>{arrow}</span>
              {label}
            </span>
          )
        },
      },
      {
        header: 'Método',
        accessorKey: 'method',
        cell: ({ row }) => metodoFilasLabel(row.original?.raw?.metodo ?? row.original?.method),
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ getValue }) => {
          const v = getValue()
          return (
            <div className="flex items-center">
              <Badge color={statusColor(v)}>{statusLabel(v)}</Badge>
            </div>
          )
        },
        filterFn: 'includesString',
      },
      {
        header: 'ID Objeto SAP',
        cell: ({ row }) => row.original?.raw?.idObjeto ?? '—',
      },
      {
        header: 'ID Objeto Agro',
        cell: ({ row }) => row.original?.raw?.idObjetoAgro ?? '—',
      },
      {
        header: 'AÇÕES',
        cell: ({ row }) => {
          const r = row.original
          return (
            <div className="table-actions">
              <button className="action-btn btn-detalhes" onClick={() => onView(r)} title="Ver detalhes">
                Detalhes
              </button>
              <button className="action-btn btn-logs" onClick={() => onLogs(r)} title="Ver logs">
                Logs
              </button>
              {r.status === 'error' ? (
                <button className="action-btn btn-reprocessar" onClick={() => onReprocess(r)} title="Reprocessar">
                  Reprocessar
                </button>
              ) : null}
              {r?.raw?.envio ? (
                <button className="action-btn btn-envio" onClick={() => onViewJson?.(r, 'envio', 'Envio')} title="Ver envio">
                  Envio
                </button>
              ) : null}
              {r?.raw?.envioOriginal ? (
                <button className="action-btn btn-envio-original" onClick={() => onViewJson?.(r, 'envioOriginal', 'Envio Original')} title="Ver envio original">
                  Envio Original
                </button>
              ) : null}
            </div>
          )
        },
      },
    ],
    [onView, onLogs, onReprocess, onViewJson]
  )

  const [globalFilter, setGlobalFilter] = useState('')
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setGlobalFilter(inputValue), 300)
    return () => clearTimeout(t)
  }, [inputValue])

  const table = useReactTable({
    data: data || [],
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="table-wrap">
      {/* toolbar removida: manter apenas busca principal da página */}

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} onClick={h.column.getToggleSortingHandler()}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {{ asc: ' ↑', desc: ' ↓' }[h.column.getIsSorted()] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {columns.map((_, j) => (
                      <td key={j}>
                        <Skeleton />
                      </td>
                    ))}
                  </tr>
                ))
              : table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell ?? cell.column.columnDef.accessorKey, cell.getContext())}</td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <div className="table-paginate">
        <Button variant="ghost" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Anterior
        </Button>
        <span>
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </span>
        <Button variant="ghost" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Próxima
        </Button>
      </div>
    </div>
  )
}
