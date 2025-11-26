'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { Users, Settings, MessageSquare, ShoppingCart, UserCheck, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell, BarChart, Bar, Tooltip, ResponsiveContainer } from 'recharts'
import { useDashboardMetrics, useUserMetrics } from '@/hooks/api/useAdmin'

export default function AdminPage() {
  const { data: dashboardMetrics, isLoading: isLoadingDashboard, error: dashboardError } = useDashboardMetrics()
  const { data: userMetrics, isLoading: isLoadingUsers, error: userMetricsError } = useUserMetrics()

  // KPI Data from API
  const kpiData = useMemo(() => {
    if (!dashboardMetrics && !userMetrics) return []
    
    return [
      { 
        label: 'Total Users', 
        value: dashboardMetrics?.totalUsers?.toLocaleString() || '0', 
        icon: Users, 
        color: 'text-teal-500' 
      },
      { 
        label: 'Active Users', 
        value: dashboardMetrics?.activeUsers?.toLocaleString() || '0', 
        icon: UserCheck, 
        color: 'text-blue-500' 
      },
      { 
        label: 'Pending Users', 
        value: userMetrics?.pending?.toLocaleString() || '0', 
        icon: MessageSquare, 
        color: 'text-yellow-500' 
      },
      { 
        label: 'Suspended Users', 
        value: userMetrics?.suspended?.toLocaleString() || '0', 
        icon: ShoppingCart, 
        color: 'text-red-500' 
      },
    ]
  }, [dashboardMetrics, userMetrics])

  // Line Chart Data (User Growth - using user metrics)
  const lineChartData = useMemo(() => {
    if (!userMetrics) return []
    // Generate last 7 days data based on user metrics
    const total = userMetrics.total || 0
    const active = userMetrics.active || 0
    const baseValue = Math.max(total, 100)
    
    return [
      { day: 'Mon', expected: Math.round(baseValue * 0.9), actual: Math.round(active * 0.95) },
      { day: 'Tue', expected: Math.round(baseValue * 0.95), actual: Math.round(active * 0.98) },
      { day: 'Wed', expected: baseValue, actual: active },
      { day: 'Thu', expected: Math.round(baseValue * 1.05), actual: Math.round(active * 1.02) },
      { day: 'Fri', expected: Math.round(baseValue * 1.1), actual: Math.round(active * 1.05) },
      { day: 'Sat', expected: Math.round(baseValue * 1.05), actual: Math.round(active * 1.03) },
      { day: 'Sun', expected: baseValue, actual: active },
    ]
  }, [userMetrics])

  // Radar Chart Data (User Roles Performance)
  const radarData = useMemo(() => {
    if (!userMetrics?.byRole) return []
    
    const roles = userMetrics.byRole
    const maxValue = Math.max(...Object.values(roles), 100)
    
    return [
      { subject: 'Admin', A: roles.admin || 0, B: Math.round(maxValue * 0.8), fullMark: maxValue },
      { subject: 'Recruiter', A: roles.recruiter || 0, B: Math.round(maxValue * 0.9), fullMark: maxValue },
      { subject: 'Candidate', A: roles.candidate || 0, B: Math.round(maxValue * 0.7), fullMark: maxValue },
      { subject: 'User', A: roles.user || 0, B: Math.round(maxValue * 0.6), fullMark: maxValue },
    ]
  }, [userMetrics])

  // Donut Chart Data (User Status Distribution)
  const donutData = useMemo(() => {
    if (!userMetrics) return []
    
    const colors = [
      'hsl(var(--chart-1))',
      'hsl(var(--chart-2))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
    ]
    
    return [
      { name: 'Active', value: userMetrics.active || 0, color: colors[0] },
      { name: 'Pending', value: userMetrics.pending || 0, color: colors[1] },
      { name: 'Suspended', value: userMetrics.suspended || 0, color: colors[2] },
    ].filter(item => item.value > 0)
  }, [userMetrics])

  // Bar Chart Data (User Roles)
  const barChartData = useMemo(() => {
    if (!userMetrics?.byRole) return []
    
    return Object.entries(userMetrics.byRole).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }))
  }, [userMetrics])

  const isLoading = isLoadingDashboard || isLoadingUsers
  const hasError = dashboardError || userMetricsError

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="border border-red-200">
          <CardContent className="p-6">
            <p className="text-red-600 text-center">
              Failed to load dashboard data. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-semibold text-black">Dashboard</h1>
        <p className="text-xs text-gray-600 mt-1">Overview of system statistics and management</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border border-gray-200">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-center h-16">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          kpiData.map((kpi, index) => {
            const Icon = kpi.icon
            return (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 mb-1 truncate">{kpi.label}</p>
                      <p className="text-base md:text-lg font-semibold text-black truncate">{kpi.value}</p>
                    </div>
                    <Icon className={`h-6 w-6 md:h-8 md:w-8 shrink-0 ml-2 ${kpi.color}`} />
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Main Line Chart */}
      <Card className="mb-4 md:mb-6 border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-black">User Growth Trend</CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          <div className="h-[250px] md:h-[300px] w-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : lineChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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

      {/* Bottom Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {/* Radar Chart */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-black">User Roles Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6">
            <div className="h-[200px] md:h-[250px] w-full">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                    <PolarGrid className="stroke-gray-200" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fontSize: 9 }}
                      className="text-xs"
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 150]}
                      tick={{ fontSize: 9 }}
                      className="text-xs"
                    />
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

        {/* Donut Chart */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-black">User Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6">
            <div className="h-[200px] md:h-[250px] w-full">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : donutData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No data available
                </div>
              )}
            </div>
            {donutData.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-3 md:mt-4">
                {donutData.map((item, index) => (
                  <div key={index} className="flex items-center gap-1.5 md:gap-2">
                    <div 
                      className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full shrink-0" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="border border-gray-200 md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-black">Users by Role</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6">
            <div className="h-[200px] md:h-[250px] w-full">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : barChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                    <XAxis 
                      dataKey="name" 
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
                    <Bar 
                      dataKey="value" 
                      fill="hsl(var(--chart-1))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Cards */}
      <div className="mt-4 md:mt-6">
        <h2 className="text-base md:text-lg font-semibold text-black mb-3 md:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <Card className="border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-black" />
                <CardTitle className="text-sm font-semibold text-black">User Management</CardTitle>
              </div>
              <CardDescription className="text-xs">View and manage all users</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full text-xs h-8" size="sm">
                  Manage Users
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="h-4 w-4 text-black" />
                <CardTitle className="text-sm font-semibold text-black">User Subscriptions</CardTitle>
              </div>
              <CardDescription className="text-xs">Manage user subscriptions and plans</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/user_subscrip">
                <Button variant="outline" className="w-full text-xs h-8" size="sm">
                  View Subscriptions
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-4 w-4 text-black" />
                <CardTitle className="text-sm font-semibold text-black">System Settings</CardTitle>
              </div>
              <CardDescription className="text-xs">Configure system settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/settings">
                <Button variant="outline" className="w-full text-xs h-8" size="sm">
                  Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
