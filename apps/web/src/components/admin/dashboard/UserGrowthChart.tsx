'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface UserGrowthChartProps {
  data: Array<{ day: string; expected: number; actual: number }>
  isLoading?: boolean
}

export function UserGrowthChart({ data, isLoading = false }: UserGrowthChartProps) {
  return (
    <Card className="border border-gray-200 shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-black">User Growth Trend</CardTitle>
          <Link
            href="/admin/analytics"
            className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1 group"
          >
            View Report
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-3 md:p-6">
        <div className="h-[250px] md:h-[300px] w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 10 }}
                  className="text-xs"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 10 }}
                  className="text-xs"
                  width={40}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="expected"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Expected"
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Actual"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

