'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { RevenueCards } from '@/components/admin/analytics/RevenueCard'
import { RevenuePeriodCard } from '@/components/admin/analytics/RevenuePeriodCard'
import { SubscriptionStatsCard } from '@/components/admin/analytics/SubscriptionStatsCard'
import { UserMetricsCard } from '@/components/admin/analytics/UserMetricsCard'
import { useRevenueStats, useSiteMetrics, useUserMetrics } from '@/hooks/api/useAnalytics'
import { BarChart3, Filter, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function AdminAnalyticsPage() {
  const { data: revenueStats, isLoading: isLoadingRevenue } = useRevenueStats()
  const { data: siteMetrics, isLoading: isLoadingSite } = useSiteMetrics()
  const { data: userMetrics, isLoading: isLoadingUsers } = useUserMetrics()

  const isLoading = isLoadingRevenue || isLoadingSite || isLoadingUsers

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
        <span className="ml-2 text-xs text-gray-600">Loading analytics...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-600 mt-1">Here&apos;re the details of your analysis.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs h-9">
            <Filter className="h-3.5 w-3.5 mr-1.5" />
            Filter By
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs h-9">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Excel</DropdownMenuItem>
              <DropdownMenuItem>PDF</DropdownMenuItem>
              <DropdownMenuItem>CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Top Revenue Cards */}
      {revenueStats && (
        <RevenueCards stats={{ ...revenueStats, siteMetrics }} />
      )}

      {/* Middle Section - Revenue Chart and Stats */}
      {revenueStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenuePeriodCard stats={revenueStats.revenueByPeriod} />
          <SubscriptionStatsCard stats={revenueStats.activeSubscriptions} />
        </div>
      )}

      {/* Bottom Section - User Metrics and Site Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {siteMetrics && (
          <Card className="border border-gray-200 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-gray-600" />
                <CardTitle className="text-sm font-semibold text-black">Site Metrics</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-black">{siteMetrics.totalUsers}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-600">Active Users</p>
                  <p className="text-lg font-bold text-black">{siteMetrics.activeUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {userMetrics && <UserMetricsCard metrics={userMetrics} />}
      </div>

      {/* Template Purchases Summary */}
      {revenueStats && (
        <Card className="border border-gray-200 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-gray-600" />
              <CardTitle className="text-sm font-semibold text-black">Template Purchases</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Total Purchases</p>
                <p className="text-2xl font-bold text-black">{revenueStats.templatePurchases.count}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-black">
                  ${revenueStats.templatePurchases.revenue.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
