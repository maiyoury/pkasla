'use client'

import React, { useState, useMemo } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
} from '@tanstack/react-table'
import { ArrowUpDown, ArrowUp, ArrowDown, Search, X, ChevronLeft, ChevronRight, Columns, Loader2, Download, FileText, FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { Table as TanStackTable } from '@tanstack/react-table'

export type TableSize = 'small' | 'middle' | 'large'

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[] // Alias: dataSource
  dataSource?: TData[] // Ant Design compatibility
  searchKey?: string
  searchPlaceholder?: string
  fixedHeader?: boolean
  fixedColumns?: number // Number of columns to fix from left
  enableFiltering?: boolean
  enableSorting?: boolean
  enablePagination?: boolean
  enableRowSelection?: boolean
  enableColumnVisibility?: boolean
  enableExport?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  emptyMessage?: string
  loading?: boolean
  loadingMessage?: string
  size?: TableSize
  className?: string
  headerClassName?: string
  bodyClassName?: string
  tableClassName?: string
  onRowClick?: (row: TData) => void
  onRowSelectionChange?: (selectedRows: TData[]) => void
  onChange?: (pagination: any, filters: any, sorter: any, extra: any) => void
  showRowCount?: boolean
  maxHeight?: string
  scroll?: {
    x?: number | string
    y?: number | string
  }
  rowSelection?: {
    type?: 'checkbox' | 'radio'
    selectedRowKeys?: string[]
    onChange?: (selectedRowKeys: string[], selectedRows: TData[]) => void
    getCheckboxProps?: (record: TData) => { disabled?: boolean }
  }
  // Custom render props
  renderToolbarBefore?: (table: TanStackTable<TData>) => React.ReactNode
  renderToolbarAfter?: (table: TanStackTable<TData>) => React.ReactNode
  renderHeader?: (table: TanStackTable<TData>) => React.ReactNode
  renderFooter?: (table: TanStackTable<TData>) => React.ReactNode
  renderEmpty?: () => React.ReactNode
  renderRow?: (row: TData, index: number, table: TanStackTable<TData>) => React.ReactNode
  // Bulk actions
  bulkActions?: Array<{
    label: string
    icon?: React.ReactNode
    onClick: (selectedRows: TData[]) => void
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  }>
  // Export options
  exportOptions?: {
    filename?: string
    onExport?: (data: TData[], format: 'csv' | 'json') => void
    formats?: ('csv' | 'json')[]
  }
  // Table instance access
  tableRef?: React.RefObject<TanStackTable<TData>>
}

export function DataTable<TData, TValue>({
  columns,
  data,
  dataSource,
  searchKey,
  searchPlaceholder = 'Search...',
  fixedHeader = true,
  fixedColumns = 0,
  enableFiltering = true,
  enableSorting = true,
  enablePagination = true,
  enableRowSelection = false,
  enableColumnVisibility = true,
  enableExport = false,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 20, 30, 50, 100],
  emptyMessage = 'No results found.',
  loading = false,
  loadingMessage = 'Loading...',
  size = 'middle',
  className,
  headerClassName,
  bodyClassName,
  tableClassName,
  onRowClick,
  onRowSelectionChange,
  onChange,
  showRowCount = false,
  maxHeight,
  scroll,
  rowSelection: rowSelectionConfig,
  renderToolbarBefore,
  renderToolbarAfter,
  renderHeader,
  renderFooter,
  renderEmpty,
  renderRow,
  bulkActions,
  exportOptions,
  tableRef,
}: DataTableProps<TData, TValue>) {
  // Use dataSource if provided (Ant Design compatibility), otherwise use data
  const tableData = dataSource || data
  
  // Determine if row selection is enabled
  const isRowSelectionEnabled = enableRowSelection || !!rowSelectionConfig
  
  // Calculate scroll height from scroll.y or maxHeight
  const scrollHeight = scroll?.y 
    ? typeof scroll.y === 'number' ? `${scroll.y}px` : scroll.y
    : maxHeight || '600px'
  
  // Size-based padding classes
  const sizeClasses = {
    small: {
      cell: 'p-1.5 sm:p-2',
      header: 'p-1.5 sm:p-2 text-xs',
      input: 'h-8 text-xs',
      button: 'h-7 text-xs',
    },
    middle: {
      cell: 'p-2 sm:p-3',
      header: 'p-2 sm:p-3 text-xs sm:text-sm',
      input: 'h-9 text-sm',
      button: 'h-8 text-xs',
    },
    large: {
      cell: 'p-3 sm:p-4',
      header: 'p-3 sm:p-4 text-sm sm:text-base',
      input: 'h-10 text-base',
      button: 'h-9 text-sm',
    },
  }
  
  const sizeClass = sizeClasses[size]
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  })

  // Enhanced columns with sorting
  const enhancedColumns = useMemo(() => {
    if (!enableSorting) return columns

    return columns.map((column) => {
      // Skip actions column, select column, and columns without accessorKey
      const columnId = column.id || (column as any).accessorKey
      if (columnId === 'actions' || columnId === 'select' || !(column as any).accessorKey) {
        return column
      }

      // If header is already a function, keep it as is
      const originalHeader = column.header
      const isHeaderFunction = typeof originalHeader === 'function'

      return {
        ...column,
        header: isHeaderFunction
          ? originalHeader
          : ({ column: col }) => {
              const headerContent = originalHeader || (column as any).accessorKey || columnId || ''
              return (
                <Button
                  variant="ghost"
                  onClick={() => col.toggleSorting(col.getIsSorted() === 'asc')}
                  className="h-8 px-2 lg:px-3 -ml-3 hover:bg-transparent"
                >
                  {headerContent}
                  {col.getIsSorted() === 'asc' ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                  ) : col.getIsSorted() === 'desc' ? (
                    <ArrowDown className="ml-2 h-4 w-4" />
                  ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                  )}
                </Button>
              )
            },
      }
    }) as ColumnDef<TData, TValue>[]
  }, [columns, enableSorting])

  // Initialize row selection from rowSelectionConfig if provided
  React.useEffect(() => {
    if (rowSelectionConfig?.selectedRowKeys) {
      const initialSelection: RowSelectionState = {}
      rowSelectionConfig.selectedRowKeys.forEach((key) => {
        const row = tableData.find((item: any) => item.id === key || (item as any).key === key)
        if (row) {
          const rowIndex = tableData.indexOf(row)
          initialSelection[rowIndex.toString()] = true
        }
      })
      setRowSelection(initialSelection)
    }
  }, [rowSelectionConfig?.selectedRowKeys, tableData])

  const table = useReactTable({
    data: tableData,
    columns: enhancedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    enableRowSelection: isRowSelectionEnabled,
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater
      setSorting(newSorting)
      
      // Call onChange if provided
      if (onChange) {
        const sorter = newSorting.length > 0 ? {
          field: newSorting[0].id,
          order: newSorting[0].desc ? 'descend' : 'ascend',
        } : null
        onChange(
          {
            current: pagination.pageIndex + 1,
            pageSize: pagination.pageSize,
          },
          {},
          sorter,
          { action: 'sort', currentDataSource: tableData }
        )
      }
    },
    onColumnFiltersChange: (updater) => {
      const newFilters = typeof updater === 'function' ? updater(columnFilters) : updater
      setColumnFilters(newFilters)
      
      // Call onChange if provided
      if (onChange) {
        onChange(
          {
            current: pagination.pageIndex + 1,
            pageSize: pagination.pageSize,
          },
          newFilters,
          null,
          { action: 'filter', currentDataSource: tableData }
        )
      }
    },
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === 'function' ? updater(rowSelection) : updater
      setRowSelection(newSelection)
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' ? updater(pagination) : updater
      setPagination(newPagination)
      
      // Call onChange if provided
      if (onChange) {
        onChange(
          {
            current: newPagination.pageIndex + 1,
            pageSize: newPagination.pageSize,
          },
          {},
          null,
          { action: 'paginate', currentDataSource: tableData }
        )
      }
    },
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination,
    },
  })

  // Notify parent of row selection changes
  React.useEffect(() => {
    if (isRowSelectionEnabled) {
      const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original)
      const selectedKeys = selectedRows.map((row: any) => row.id || (row as any).key)
      
      if (onRowSelectionChange) {
        onRowSelectionChange(selectedRows)
      }
      
      if (rowSelectionConfig?.onChange) {
        rowSelectionConfig.onChange(selectedKeys, selectedRows)
      }
    }
  }, [rowSelection, onRowSelectionChange, isRowSelectionEnabled, table, rowSelectionConfig])

  const filteredRowCount = table.getFilteredRowModel().rows.length
  const totalRowCount = data.length
  const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original)
  const selectedCount = selectedRows.length

  // Export functions
  const handleExportCSV = () => {
    const visibleColumns = table.getVisibleLeafColumns()
    const headers = visibleColumns.map((col) => col.id || col.columnDef.id || '')
    const rows = table.getFilteredRowModel().rows.map((row) =>
      visibleColumns.map((col) => {
        const cell = row.getValue(col.id || '')
        return cell != null ? String(cell).replace(/"/g, '""') : ''
      })
    )

    const csvContent = [
      headers.map((h) => `"${h}"`).join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${exportOptions?.filename || 'export'}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    if (exportOptions?.onExport) {
      exportOptions.onExport(table.getFilteredRowModel().rows.map((r) => r.original), 'csv')
    }
  }

  const handleExportJSON = () => {
    const data = table.getFilteredRowModel().rows.map((row) => row.original)
    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${exportOptions?.filename || 'export'}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    if (exportOptions?.onExport) {
      exportOptions.onExport(data, 'json')
    }
  }

  // Expose table instance via ref
  React.useImperativeHandle(tableRef, () => table, [table])

  return (
    <div className={cn('space-y-4', className)}>
      {/* Custom Header */}
      {renderHeader && (
        <div className="mb-4">
          {renderHeader(table)}
        </div>
      )}

      {/* Toolbar: Search, Column Visibility, Row Count */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {/* Custom Toolbar Before */}
          {renderToolbarBefore && renderToolbarBefore(table)}

          {/* Bulk Actions */}
          {isRowSelectionEnabled && selectedCount > 0 && bulkActions && bulkActions.length > 0 && (
            <div className="flex items-center gap-2">
              {bulkActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'outline'}
                  size="sm"
                  className={cn(sizeClass.button, 'text-xs')}
                  onClick={() => action.onClick(selectedRows)}
                >
                  {action.icon && <span className="mr-1.5">{action.icon}</span>}
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          {/* Search */}
          {enableFiltering && searchKey && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={searchPlaceholder}
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className={cn('pl-9 pr-9', sizeClass.input)}
              />
              {globalFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setGlobalFilter('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Right side: Column Visibility, Export & Row Count */}
        <div className="flex items-center gap-2">
          {showRowCount && (
            <div className="text-xs text-gray-600 hidden sm:block">
              {enableFiltering && globalFilter
                ? `${filteredRowCount} of ${totalRowCount}`
                : `${totalRowCount}`}
            </div>
          )}

          {/* Export */}
          {enableExport && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className={cn(sizeClass.button, 'text-xs')}>
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {(!exportOptions?.formats || exportOptions.formats.includes('csv')) && (
                  <DropdownMenuItem onClick={handleExportCSV}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export CSV
                  </DropdownMenuItem>
                )}
                {(!exportOptions?.formats || exportOptions.formats.includes('json')) && (
                  <DropdownMenuItem onClick={handleExportJSON}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export JSON
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Column Visibility Toggle */}
          {enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className={cn(sizeClass.button, 'text-xs')}>
                  <Columns className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Columns</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Custom Toolbar After */}
          {renderToolbarAfter && renderToolbarAfter(table)}
        </div>
      </div>

      {/* Table Container with Fixed Header */}
      <div className={cn('relative rounded-md border border-gray-200', tableClassName)}>
        <div
          className={cn(
            'overflow-auto',
            fixedHeader && 'relative',
            scroll?.x && 'overflow-x-auto'
          )}
          style={{
            ...(fixedHeader && { maxHeight: scrollHeight }),
            ...(scroll?.x && { 
              maxWidth: typeof scroll.x === 'number' ? `${scroll.x}px` : scroll.x 
            }),
          }}
        >
          <Table>
            <TableHeader
              className={cn(
                fixedHeader && 'sticky top-0 z-10 bg-white',
                headerClassName
              )}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b border-gray-200">
                  {headerGroup.headers.map((header, index) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        sizeClass.header,
                        'font-semibold text-black',
                        fixedColumns > 0 &&
                          index < fixedColumns &&
                          'sticky left-0 z-20 bg-white border-r border-gray-200',
                        fixedHeader &&
                          fixedColumns > 0 &&
                          index < fixedColumns &&
                          'z-30'
                      )}
                      style={
                        fixedColumns > 0 && index < fixedColumns
                          ? {
                              left: index === 0 ? 0 : `${index * 150}px`, // Adjust based on column width
                            }
                          : undefined
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className={bodyClassName}>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      <p className="text-sm text-gray-600">{loadingMessage}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, rowIndex) => {
                  // Custom row rendering
                  if (renderRow) {
                    return (
                      <React.Fragment key={row.id}>
                        {renderRow(row.original, rowIndex, table)}
                      </React.Fragment>
                    )
                  }

                  // Default row rendering
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className={cn(
                        'border-b border-gray-200 last:border-b-0',
                        onRowClick && 'cursor-pointer hover:bg-gray-50',
                        enableRowSelection && row.getIsSelected() && 'bg-gray-50'
                      )}
                      onClick={() => onRowClick?.(row.original)}
                    >
                      {row.getVisibleCells().map((cell, index) => (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            sizeClass.cell,
                            fixedColumns > 0 &&
                              index < fixedColumns &&
                              'sticky left-0 z-10 bg-white border-r border-gray-200'
                          )}
                          style={
                            fixedColumns > 0 && index < fixedColumns
                              ? {
                                  left: index === 0 ? 0 : `${index * 150}px`, // Adjust based on column width
                                }
                              : undefined
                          }
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {renderEmpty ? renderEmpty() : <p className="text-sm text-gray-600">{emptyMessage}</p>}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {enablePagination && !loading && table.getPageCount() > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-600 hidden sm:block">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px] text-xs">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-600 hidden sm:block">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronLeft className="h-4 w-4" />
                <ChevronLeft className="h-4 w-4 -ml-2" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronRight className="h-4 w-4" />
                <ChevronRight className="h-4 w-4 -ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Row Count Footer */}
      {!enablePagination && showRowCount && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <div className="text-xs text-gray-600">
            {enableFiltering && globalFilter
              ? `Showing ${filteredRowCount} of ${totalRowCount} results`
              : `Total: ${totalRowCount} results`}
          </div>
        </div>
      )}

      {/* Custom Footer */}
      {renderFooter && (
        <div className="mt-4">
          {renderFooter(table)}
        </div>
      )}
    </div>
  )
}

