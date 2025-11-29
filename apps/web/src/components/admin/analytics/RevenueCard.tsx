'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, ArrowRight, DollarSign, ShoppingCart, CreditCard, Users } from 'lucide-react'
import Link from 'next/link'

interface RevenueCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  description?: string
  trend?: number
  trendValue?: number | string
  showViewReport?: boolean
  viewReportLink?: string
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function RevenueCard({
  title,
  value,
  icon,
  description,
  trend,
  trendValue,
  showViewReport = true,
  viewReportLink = '#',
}: RevenueCardProps) {
  const isPositive = trend !== undefined ? trend >= 0 : true
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <Card className="border border-gray-200 shadow-none">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-600 mb-2">{title}</p>
            <p className="text-2xl md:text-3xl font-bold text-black mb-2">
              {typeof value === 'number' ? formatCurrency(value) : value}
            </p>
            {trend !== undefined && (
              <div className="flex items-center gap-1 mb-2">
                <TrendIcon
                  className={`h-3.5 w-3.5 ${isPositive ? 'text-green-600' : 'text-red-600'}`}
                />
                <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
                  {trendValue && (
                    <span className="ml-1">
                      {typeof trendValue === 'number' ? formatCurrency(trendValue) : trendValue} today
                    </span>
                  )}
                </span>
              </div>
            )}
            {showViewReport && (
              <Link
                href={viewReportLink}
                className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1 mt-2 group"
              >
                View Report
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            {description && !showViewReport && (
              <p className="text-xs text-gray-500 mt-2">{description}</p>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function RevenueCards({ stats }: { stats: any }) {
  // Calculate trends (mock for now, should come from API)
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 10 : 0
    return ((current - previous) / previous) * 100
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <RevenueCard
        title="Total Sales"
        value={stats.totalRevenue}
        icon={<DollarSign className="h-5 w-5 text-gray-600" />}
        trend={10.2}
        trendValue="+1,454.89"
        showViewReport={true}
      />
      <RevenueCard
        title="Total Orders"
        value={stats.templatePurchases.count + stats.activeSubscriptions.count}
        icon={<ShoppingCart className="h-5 w-5 text-gray-600" />}
        trend={20.2}
        trendValue="+1,589"
        showViewReport={true}
      />
      <RevenueCard
        title="Total Visitors"
        value={stats.siteMetrics?.totalUsers || 0}
        icon={<Users className="h-5 w-5 text-gray-600" />}
        trend={-14.2}
        trendValue="-89"
        showViewReport={true}
      />
      <RevenueCard
        title="Refunded"
        value={0}
        icon={<CreditCard className="h-5 w-5 text-gray-600" />}
        trend={12.6}
        trendValue="+48"
        showViewReport={true}
      />
    </div>
  )
}

