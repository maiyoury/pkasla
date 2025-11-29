'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface SubscriptionStatsCardProps {
  stats: {
    count: number
    monthlyRecurring: number
    yearlyRecurring: number
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

export function SubscriptionStatsCard({ stats, showViewReport = true }: SubscriptionStatsCardProps) {
  return (
    <Card className="border border-gray-200 shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-gray-600" />
          <CardTitle className="text-sm font-semibold text-black">Active Subscriptions</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-600">Total Active</p>
            <p className="text-2xl font-bold text-black">{stats.count}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Monthly MRR</p>
              <p className="text-lg font-bold text-black">{formatCurrency(stats.monthlyRecurring)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Yearly ARR</p>
              <p className="text-lg font-bold text-black">{formatCurrency(stats.yearlyRecurring)}</p>
            </div>
          </div>
          {showViewReport && (
            <div className="pt-2 border-t border-gray-200">
              <Link
                href="/admin/subscriptions"
                className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1 group"
              >
                View Report
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

