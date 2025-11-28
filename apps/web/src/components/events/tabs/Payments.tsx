'use client'

import React, { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { Download, Edit, Trash2, User, FileText, Calendar, DollarSign } from 'lucide-react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTable } from '@/components/ui/data-table'

interface Payment {
  id: string
  guestName: string
  amount: number
  currency: 'USD' | 'KHR'
  method: 'KHQR' | 'Cash' | 'Bank Transfer'
  createdAt: string | Date
}

interface PaymentsProps {
  payments?: Payment[]
  totalRiel?: number
  totalDollars?: number
  totalGuests?: number
  contributingGuests?: number
}

export default function Payments({
  payments = [],
  totalRiel = 0,
  totalDollars = 0,
  totalGuests = 0,
  contributingGuests = 0,
}: PaymentsProps) {
  const formatCurrency = (amount: number, currency: 'USD' | 'KHR') => {
    if (currency === 'USD') {
      return `${amount.toLocaleString()} ដុល្លារ`
    }
    return `${amount.toLocaleString()} រៀល`
  }

  const formatDateKhmer = (date: string | Date) => {
    const d = new Date(date)
    return d.toLocaleDateString('km-KH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  const getMethodLabel = (method: string) => {
    const methodMap: Record<string, string> = {
      'KHQR': 'KHQR',
      'Cash': 'សាច់ប្រាក់',
      'Bank Transfer': 'ការផ្ទេរប្រាក់',
    }
    return methodMap[method] || method
  }

  const columns = useMemo<ColumnDef<Payment>[]>(
    () => [
      {
        accessorKey: 'guestName',
        header: 'ឈ្មោះ',
        cell: ({ row }) => (
          <p className="text-xs sm:text-sm font-semibold text-black">{row.original.guestName}</p>
        ),
      },
      {
        accessorKey: 'amount',
        header: 'ចំនួនចំណងដៃ',
        cell: ({ row }) => (
          <p className="text-xs sm:text-sm text-black">
            {formatCurrency(row.original.amount, row.original.currency)}
          </p>
        ),
      },
      {
        accessorKey: 'method',
        header: 'តាមរយៈ',
        cell: ({ row }) => (
          <p className="text-xs sm:text-sm text-black">{getMethodLabel(row.original.method)}</p>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'ពេលវេលា',
        cell: ({ row }) => (
          <p className="text-xs sm:text-sm text-black">{formatDateKhmer(row.original.createdAt)}</p>
        ),
      },
      {
        id: 'actions',
        header: () => <div className="text-right"></div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 w-7 p-0"
              onClick={(e) => {
                e.stopPropagation()
                console.log('Edit payment', row.original.id)
              }}
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 w-7 p-0 text-red-600 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation()
                console.log('Delete payment', row.original.id)
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    []
  )

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Riel */}
        <Card className="border border-gray-200 p-4 shadow-none">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">សរុប ប្រាក់រៀល</p>
                <p className="text-lg font-bold text-black">{totalRiel.toLocaleString()} រៀល</p>
              </div>
              <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Dollars */}
        <Card className="border border-gray-200 p-4 shadow-none">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">សរុប ប្រាក់ដុល្លារ</p>
                <p className="text-lg font-bold text-black">{totalDollars.toLocaleString()} ដុល្លារ</p>
              </div>
              <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Guests */}
        <Card className="border border-gray-200 p-4 shadow-none">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">ចំនួនភ្ញៀវសរុប</p>
                <p className="text-lg font-bold text-black">{totalGuests} នាក់</p>
              </div>
              <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contributing Guests */}
        <Card className="border border-gray-200 p-4 shadow-none">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">ចំនួនភ្ញៀវដែលបានចងដៃ</p>
                <p className="text-lg font-bold text-black">{contributingGuests} នាក់</p>
              </div>
              <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card className="border border-gray-200 shadow-none p-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-black">តារាងចំណងដៃ</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs h-9">
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  ទាញយក
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Excel</DropdownMenuItem>
                <DropdownMenuItem>PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
            <DataTable
              columns={columns}
              data={payments}
              searchKey="guestName"
              searchPlaceholder="ស្វែងរកចំណងដៃ..."
              fixedHeader={true}
              fixedColumns={1}
              enableFiltering={true}
              enableSorting={true}
              enableColumnVisibility={false}
              showRowCount={false}
              emptyMessage="មិនទាន់មានចំណងដៃ"
            />
            {payments.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-600">
                  សរុប {payments.length} / {payments.length} ចំណងដៃ
                </p>
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  )
}

