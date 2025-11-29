'use client'

import React, { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar as CalendarIcon, Clock, Edit, Trash2, Save, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

type ScheduleItem = {
  id: string
  date: string // ISO date string, e.g. "2025-12-31"
  time: string // "07:00"
  description?: string
}

export default function Schedules() {
  const [items, setItems] = useState<ScheduleItem[]>([
    // sample demo data for UX preview; can be removed when wired to API
    {
      id: 'a',
      date: '2025-10-24',
      time: '07:00',
      description:
        'បុណ្យភ្ជុំបិណ្ឌសម្របសម្រួលនៅភូមិ និងសួរសុខទុក្ខអ្នកចាស់ៗ',
    },
    {
      id: 'b',
      date: '2025-12-31',
      time: '07:30',
      description:
        'គីឡូទឹកដោះ ទទួលភ្ញៀវ និងត្រៀមពិធីខាងក្នុងសម្មាធានកម្មត្រូវការបង្កើត',
    },
    { id: 'c', date: '2025-12-31', time: '08:15', description: 'ពិធីរៀបចំគ្រួសារ និងទទួលភ្ញៀវ' },
    { id: 'd', date: '2025-12-31', time: '08:30', description: 'ពិធីកាន់បួស បុណ្យជ័យ' },
    {
      id: 'e',
      date: '2026-01-01',
      time: '05:00',
      description: 'បើកពិធីជាផ្លូវការនៅសាលាជាតិអាមេរស៊្តាន',
    },
  ])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedHour, setSelectedHour] = useState<string>('')
  const [selectedMinute, setSelectedMinute] = useState<string>('')
  const [form, setForm] = useState<{ date: string; time: string; description: string }>({
    date: '',
    time: '',
    description: '',
  })

  const isEditing = editingId !== null

  const grouped = useMemo(() => {
    const byDate: Record<string, ScheduleItem[]> = {}
    for (const it of items) {
      byDate[it.date] ??= []
      byDate[it.date].push(it)
    }
    // sort dates asc and items by time asc
    return Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, group]) => ({
        date,
        items: [...group].sort((a, b) => a.time.localeCompare(b.time)),
      }))
  }, [items])

  const resetForm = () => {
    setForm({
      date: '',
      time: '',
      description: '',
    })
    setSelectedDate(undefined)
    setSelectedHour('')
    setSelectedMinute('')
  }

  // Update form.date when selectedDate changes
  React.useEffect(() => {
    if (selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      setForm((f) => ({ ...f, date: dateStr }))
    }
  }, [selectedDate])

  // Update form.time when hour or minute changes
  React.useEffect(() => {
    if (selectedHour && selectedMinute) {
      const timeStr = `${selectedHour.padStart(2, '0')}:${selectedMinute.padStart(2, '0')}`
      setForm((f) => ({ ...f, time: timeStr }))
    }
  }, [selectedHour, selectedMinute])

  const onAddOrSave = () => {
    if (!form.date || !form.time) return
    if (isEditing) {
      setItems((prev) =>
        prev.map((it) => (it.id === editingId ? { ...it, ...form } : it)),
      )
      setEditingId(null)
      resetForm()
      return
    }
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), date: form.date, time: form.time, description: form.description },
    ])
    resetForm()
  }

  const onEdit = (id: string) => {
    const it = items.find((x) => x.id === id)
    if (!it) return
    setForm({ date: it.date, time: it.time, description: it.description ?? '' })
    setSelectedDate(new Date(it.date))
    const [hour, minute] = it.time.split(':')
    setSelectedHour(hour)
    setSelectedMinute(minute)
    setEditingId(id)
  }

  const onDelete = (id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id))
    if (editingId === id) {
      setEditingId(null)
      resetForm()
    }
  }

  return (
    <Card className="border border-gray-200 shadow-none">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-black">កាលវិភាគ (Schedule)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Existing schedules, grouped by date */}
        <div className="divide-y divide-gray-200 rounded-lg border border-gray-200">
          {grouped.length === 0 ? (
            <div className="p-4 text-sm text-gray-600">មិនទាន់មានកាលវិភាគ</div>
          ) : (
            grouped.map(({ date, items: group }) => (
              <div key={date} className="p-4">
                <div className="text-rose-600 font-semibold text-sm mb-3">
                  {new Date(date).toLocaleDateString('km-KH', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </div>
                <div className="space-y-3">
                  {group.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-start justify-between gap-3 rounded-md bg-white"
                    >
                      <div className="flex items-start gap-3">
                        <Clock className="h-4 w-4 mt-0.5 text-gray-500" />
                        <div>
                          <div className="text-[13px] sm:text-sm font-semibold text-black">
                            ចូល {formatTime(it.time)}
                          </div>
                          {it.description && (
                            <div className="text-xs text-gray-600 mt-0.5">{it.description}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => onEdit(it.id)}
                          title="កែប្រែ"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          onClick={() => onDelete(it.id)}
                          title="លុប"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create / Edit form */}
        <div className="rounded-lg border border-gray-200">
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {/* Date Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal text-sm",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "dd/MM/yyyy")
                    ) : (
                      <span>ជ្រើសរើសកាលបរិច្ឆេទ</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    date={selectedDate}
                    onDateChange={setSelectedDate}
                  />
                </PopoverContent>
              </Popover>

              {/* Time Picker */}
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-500 shrink-0" />
                <div className="flex items-center gap-1 flex-1">
                  <Select value={selectedHour} onValueChange={setSelectedHour}>
                    <SelectTrigger className="flex-1 text-sm h-9">
                      <SelectValue placeholder="ម៉ោង" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={String(i)}>
                          {String(i).padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-gray-500">:</span>
                  <Select value={selectedMinute} onValueChange={setSelectedMinute}>
                    <SelectTrigger className="flex-1 text-sm h-9">
                      <SelectValue placeholder="នាទី" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 60 }, (_, i) => (
                        <SelectItem key={i} value={String(i)}>
                          {String(i).padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-700 mb-1">Description</div>
              <Textarea
                placeholder="Write text here ..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="min-h-24"
              />
            </div>
          </div>
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3 flex justify-center">
            <Button onClick={onAddOrSave} className="w-full sm:w-auto px-6">
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  បន្ទាន់សម័យ
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  បញ្ចូល
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function formatTime(time: string): string {
  // "07:00" -> "7:00 ព្រឹក/ល្ងាច" simple heuristic
  const [hStr, m] = time.split(':')
  let h = parseInt(hStr || '0', 10)
  const period = h < 12 ? 'ព្រឹក' : 'ល្ងាច'
  if (h === 0) h = 12
  if (h > 12) h -= 12
  return `${h}:${m} ${period}`
}

