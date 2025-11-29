'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface UserRolesRadarChartProps {
  data: Array<{
    subject: string
    A: number
    B: number
    fullMark: number
  }>
  isLoading?: boolean
}

export function UserRolesRadarChart({ data, isLoading = false }: UserRolesRadarChartProps) {
  return (
    <Card className="border border-gray-200 shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-black">User Roles Overview</CardTitle>
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
        <div className="h-[200px] md:h-[250px] w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <PolarGrid className="stroke-gray-200" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9 }} className="text-xs" />
                <PolarRadiusAxis angle={90} domain={[0, 150]} tick={{ fontSize: 9 }} className="text-xs" />
                <Radar
                  name="Current"
                  dataKey="A"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Target"
                  dataKey="B"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
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

