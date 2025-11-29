"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface CalendarProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  className?: string
}

export function Calendar({
  date,
  onDateChange,
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(
    date ? new Date(date.getFullYear(), date.getMonth(), 1) : new Date()
  )

  React.useEffect(() => {
    if (date) {
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1))
    }
  }, [date])

  const today = new Date()
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const days: (number | null)[] = []
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null)
  }
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  const monthNames = [
    "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
    "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"
  ]

  const weekDays = ["អា", "ច", "អ", "ព", "ព្រ", "សុ", "ស"]

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(year, month, day)
    onDateChange?.(selectedDate)
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    )
  }

  const isSelected = (day: number) => {
    if (!date) return false
    return (
      day === date.getDate() &&
      month === date.getMonth() &&
      year === date.getFullYear()
    )
  }

  return (
    <div className={cn("p-3", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={goToPreviousMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-semibold">
          {monthNames[month]} {year}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={goToNextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 h-8 flex items-center justify-center"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={index} className="h-9" />
          }
          return (
            <Button
              key={index}
              variant={isSelected(day) ? "default" : "ghost"}
              className={cn(
                "h-9 w-9 p-0 text-sm",
                isToday(day) && !isSelected(day) && "bg-accent font-semibold",
                isSelected(day) && "bg-primary text-primary-foreground"
              )}
              onClick={() => handleDateClick(day)}
            >
              {day}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

