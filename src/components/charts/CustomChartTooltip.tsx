'use client'

import React from 'react'
import { ChartTooltipContent as BaseChartTooltipContent } from '@/components/ui/chart'

// Type definition for Recharts tooltip props
type TooltipContentProps = {
  active?: boolean
  payload?: Array<{
    value?: unknown
    name?: string
    dataKey?: string
    color?: string
    payload?: unknown
    fill?: string
  }>
  label?: unknown
  labelFormatter?: (label: unknown, payload: unknown[]) => React.ReactNode
  formatter?: (value: unknown, name: unknown, item: unknown, index: number, payload: unknown) => React.ReactNode
  color?: string
  hideLabel?: boolean
  hideIndicator?: boolean
  indicator?: "line" | "dot" | "dashed"
  nameKey?: string
  labelKey?: string
  labelClassName?: string
  className?: string
}

// Custom wrapper component with proper types that works around the type issue
export const CustomChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  TooltipContentProps
>((props, ref) => {
  // Type assertion to work around the type issue in the base component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <BaseChartTooltipContent {...(props as any)} ref={ref} />
})

CustomChartTooltipContent.displayName = "CustomChartTooltipContent"

