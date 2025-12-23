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
import ActionsMenu from './ActionsMenu'
import TableFilters from './TableFilters'
import ActiveFilters from './ActiveFilters'
import { statusLabel, statusColor } from '../../utils/enums'
import { fluxoFilasLabel, metodoFilasLabel, tipoSapBadgeInfo } from '../../utils/filasEnums'
import { FiEye, FiFileText, FiRefreshCw, FiCode, FiFile, FiCheckSquare, FiSliders } from 'react-icons/fi'

export default function Table({
  data,
  loading,
  onView,
  onLogs,
  onReprocess,
  onViewJson,
  rowsPerPage = 50,
  onRefresh,
  onToggleFilters,
  onRowsPerPageChange,
  showFilters,
  onFilterChange,
  onCloseFilters,
  filters,
  onRemoveFilter,
  onClearAllFilters,
  hideActiveFiltersWhenOpen = true,
  extraActions,
}) {
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
        cell: ({ row }) => {
          const info = tipoSapBadgeInfo(row.original?.raw?.tipoSAP)
          const title = `${info.tooltipPrimary}\n${info.tooltipSecondary}`
          return <Badge color={info.color} className="badge-type" title={title}>{info.label}</Badge>
        },
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
        cell: ({ row, getValue }) => {
          const v = getValue()
          const item = row.original
          const attempts = item?.attempts || 0
          const createdAt = item?.createdAt ? new Date(item.createdAt).toLocaleString('pt-BR') : 'N/A'
          const tooltip = `Tentativas: ${attempts}\nÚltima execução: ${createdAt}`
          
          return (
            <div className="status-cell" title={tooltip}>
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
            <ActionsMenu
              row={r}
              onView={onView}
              onLogs={onLogs}
              onReprocess={onReprocess}
              onViewJson={onViewJson}
            />
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

  const effectiveData = useMemo(() => {
    if (!globalFilter) return data || []
    const g = String(globalFilter).toLowerCase()
    return (data || []).filter((item) => {
      const idMatch = String(item.id).toLowerCase().includes(g)
      const statusMatch = String(item.status).toLowerCase().includes(g)
      const objetoMatch = String(item?.raw?.objeto ?? '').toLowerCase().includes(g)
      return idMatch || statusMatch || objetoMatch
    })
  }, [data, globalFilter])

  const table = useReactTable({
    data: effectiveData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: rowsPerPage,
      },
    },
  })

  useEffect(() => {
    table.setPageSize(rowsPerPage)
  }, [rowsPerPage, table])

  return (
    <div className="table-wrap">
      <div className="table-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <input
            className="table-search"
            type="text"
            placeholder="Buscar..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{ flex: 1, minWidth: 260 }}
          />
        </div>
        <div className="table-toolbar-actions">
          {extraActions ? (
            <div className="table-extra-actions">{extraActions}</div>
          ) : null}
          <div className="rows-per-page-control">
            <label htmlFor="rows-select">Linhas:</label>
            <select
              id="rows-select"
              className="rows-select"
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange?.(Number(e.target.value))}
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>
          <button
            className="table-btn table-btn-filters"
            onClick={onToggleFilters}
            title="Filtros avançados"
          >
            <FiSliders size={15} />
          </button>
          <button
            className="table-btn table-btn-refresh"
            onClick={onRefresh}
            title="Atualizar dados"
          >
            <FiRefreshCw size={15} />
          </button>
        </div>
      </div>

      {(!hideActiveFiltersWhenOpen || !showFilters) && (
        <ActiveFilters
          filters={filters || {}}
          onRemoveFilter={onRemoveFilter}
          onClearAll={onClearAllFilters}
        />
      )}

      {showFilters && (
        <TableFilters onFilterChange={onFilterChange} onClose={onCloseFilters} />
      )}

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
