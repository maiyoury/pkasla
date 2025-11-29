'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, UserX, UserLock, ArrowRight } from 'lucide-react'
import type { UserMetrics } from '@/types/analytics'
import Link from 'next/link'

interface UserMetricsCardProps {
  metrics: UserMetrics
  showViewReport?: boolean
}

export function UserMetricsCard({ metrics, showViewReport = true }: UserMetricsCardProps) {
  const statusItems = [
    {
      label: 'Active',
      value: metrics.active,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Pending',
      value: metrics.pending,
      icon: UserLock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      label: 'Suspended',
      value: metrics.suspended,
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ]

  return (
    <Card className="border border-gray-200 shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-600" />
            <CardTitle className="text-sm font-semibold text-black">User Metrics</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-black">{metrics.total}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200">
            {statusItems.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex flex-col items-center text-center">
                  <div className={`h-10 w-10 rounded-full ${item.bgColor} flex items-center justify-center mb-2`}>
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <p className="text-xs font-medium text-gray-600 mb-1">{item.label}</p>
                  <p className="text-lg font-bold text-black">{item.value}</p>
                </div>
              )
            })}
          </div>
          {Object.keys(metrics.byRole).length > 0 && (
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-600 mb-2">By Role</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(metrics.byRole).map(([role, count]) => (
                  <div
                    key={role}
                    className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-md text-xs font-medium"
                  >
                    <span className="capitalize text-gray-700">{role}:</span>
                    <span className="text-black font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {showViewReport && (
            <div className="pt-2 border-t border-gray-200">
              <Link
                href="/admin/users"
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

