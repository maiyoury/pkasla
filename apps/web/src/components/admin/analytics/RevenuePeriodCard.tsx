'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface RevenuePeriodCardProps {
  stats: {
    today: number
    thisWeek: number
    thisMonth: number
    thisYear: number
  }
  showViewReport?: boolean
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function RevenuePeriodCard({ stats, showViewReport = true }: RevenuePeriodCardProps) {
  const periods = [
    { label: 'Today', value: stats.today, period: 'today' },
    { label: 'This Week', value: stats.thisWeek, period: 'week' },
    { label: 'This Month', value: stats.thisMonth, period: 'month' },
    { label: 'This Year', value: stats.thisYear, period: 'year' },
  ]

  return (
    <Card className="border border-gray-200 shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-600" />
            <CardTitle className="text-sm font-semibold text-black">Revenue by Period</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {periods.map((period) => (
            <div key={period.period} className="flex flex-col">
              <p className="text-xs font-medium text-gray-600 mb-1">{period.label}</p>
              <p className="text-lg font-bold text-black">{formatCurrency(period.value)}</p>
            </div>
          ))}
        </div>
        {showViewReport && (
          <div className="pt-3 border-t border-gray-200 mt-4">
            <Link
              href="/admin/analytics/revenue"
              className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1 group"
            >
              View Report
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

