"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface TimePickerProps {
  hour?: string
  minute?: string
  onHourChange?: (hour: string) => void
  onMinuteChange?: (minute: string) => void
  hourPlaceholder?: string
  minutePlaceholder?: string
  className?: string
  disabled?: boolean
}

export function TimePicker({
  hour,
  minute,
  onHourChange,
  onMinuteChange,
  hourPlaceholder = "ម៉ោង",
  minutePlaceholder = "នាទី",
  className,
  disabled = false,
}: TimePickerProps) {
  // Generate hour options (00-23)
  const hours = React.useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        value: String(i),
        label: String(i).padStart(2, "0"),
      })),
    []
  )

  // Generate minute options (00-59)
  const minutes = React.useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        value: String(i),
        label: String(i).padStart(2, "0"),
      })),
    []
  )

  return (
    <div className={cn("flex items-center gap-2 flex-1 border border-input rounded-md bg-background px-3 py-2 h-9 relative", className)}>
      <Clock className="h-4 w-4 text-gray-500 shrink-0" />
      <Select value={hour} onValueChange={onHourChange} disabled={disabled}>
        <SelectTrigger className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 h-auto flex-1 p-0 w-auto min-w-[50px] text-sm bg-transparent hover:bg-transparent [&>svg]:opacity-50">
          <SelectValue placeholder={hourPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {hours.map((h) => (
            <SelectItem key={h.value} value={h.value}>
              {h.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-gray-500">:</span>
      <Select value={minute} onValueChange={onMinuteChange} disabled={disabled}>
        <SelectTrigger className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 h-auto flex-1 p-0 w-auto min-w-[50px] text-sm bg-transparent hover:bg-transparent [&>svg]:opacity-50">
          <SelectValue placeholder={minutePlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {minutes.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

