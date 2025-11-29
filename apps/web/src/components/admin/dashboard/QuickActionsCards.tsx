'use client'

import React from 'react'
import Link from 'next/link'
import { Users, Settings, UserCheck, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface QuickAction {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  buttonText: string
}

const quickActions: QuickAction[] = [
  {
    title: 'User Management',
    description: 'View and manage all users',
    icon: Users,
    href: '/admin/users',
    buttonText: 'Manage Users',
  },
  {
    title: 'User Subscriptions',
    description: 'Manage user subscriptions and plans',
    icon: UserCheck,
    href: '/admin/user_subscrip',
    buttonText: 'View Subscriptions',
  },
  {
    title: 'System Settings',
    description: 'Configure system settings',
    icon: Settings,
    href: '/admin/settings',
    buttonText: 'Settings',
  },
]

export function QuickActionsCards() {
  return (
    <div>
      <h2 className="text-base md:text-lg font-semibold text-black mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon
          return (
            <Card
              key={index}
              className="border border-gray-200 shadow-none hover:shadow-sm transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-black">{action.title}</CardTitle>
                </div>
                <CardDescription className="text-xs text-gray-600">{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={action.href}>
                  <Button variant="outline" className="w-full text-xs h-9" size="sm">
                    {action.buttonText}
                    <ArrowRight className="h-3 w-3 ml-1.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

