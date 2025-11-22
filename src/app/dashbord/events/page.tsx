'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Plus, Settings, Star, Ban, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import CountdownTimer from '@/components/CountdownTimer'
import CreateEventForm from '@/components/events/CreateEventForm'
import { Event } from '@/types/event'

// Sample events with background images
const sampleEvents: (Event & { image: string; time: string; isFavorite?: boolean; isPrivate?: boolean })[] = [
  {
    id: '1',
    title: 'ពិធីភ្ជាប់ពាក្យ',
    description: 'ពិធីភ្ជាប់ពាក្យ និង',
    date: '2025-12-27T07:00:00',
    venue: 'Phnom Penh',
    guestCount: 0,
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    time: '07:00 AM',
    isPrivate: true,
  },
  {
    id: '2',
    title: 'សិរីមង្គលអាពាហ៍ពិពាហ៍',
    description: 'សិរីមង្គលអាពាហ៍ពិពាហ៍ សូរិយា និង ចន្ទ័ធូ',
    date: '2026-01-31T13:11:00',
    venue: 'Siem Reap',
    guestCount: 2,
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    image: 'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=800&q=80',
    time: '01:11 PM',
    isFavorite: true,
  },
]

function EventCard({ event }: { event: typeof sampleEvents[0] }) {
  const [isFavorite, setIsFavorite] = useState(event.isFavorite || false)
  const [isPrivate, setIsPrivate] = useState(event.isPrivate || false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Card className="relative overflow-hidden p-0 border-0">
      {/* Background Image */}
      <div
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${event.image})` }}
      >
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />

        {/* Top Right Icon */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={() => {
              if (event.isPrivate !== undefined) {
                setIsPrivate(!isPrivate)
              } else {
                setIsFavorite(!isFavorite)
              }
            }}
            className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
          >
            {isPrivate ? (
              <Ban className="h-4 w-4 text-gray-300" />
            ) : (
              <Star className={`h-4 w-4 ${isFavorite ? 'text-pink-400 fill-pink-400' : 'text-gray-300'}`} />
            )}
          </button>
        </div>

        {/* Countdown Timer and Event Title - Centered Column */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-full px-4">
          <div className="flex flex-col items-center gap-4">
            {/* Countdown Timer */}
            <div className="w-full flex justify-center">
              <CountdownTimer targetDate={event.date} variant="relative" />
            </div>
            
            {/* Event Title */}
            <div className="text-center">
              <h3 className="text-white text-lg font-semibold mb-1 drop-shadow-lg">{event.title}</h3>
              <p className="text-white/90 text-xs drop-shadow">
                {formatDate(event.date)} at {event.time}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 bg-white">
        <div className="flex items-start gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
            <User className="h-5 w-5 text-pink-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-black mb-1 truncate">{event.description || event.title}</h4>
            <p className="text-xs text-gray-600">
              ចំនួនភ្ញៀវ {event.guestCount} នាក់
            </p>
          </div>
        </div>
        <Link href={`/dashbord/events/${event.id}`}>
          <Button variant="outline" className="w-full text-xs h-8 border-gray-300 hover:bg-gray-50" size="sm">
            <Settings className="h-3.5 w-3.5 mr-1.5" />
            Manage
          </Button>
        </Link>
      </div>
    </Card>
  )
}

export default function EventPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-black">Events</h1>
          <p className="text-xs text-gray-600 mt-0.5">Manage your events</p>
        </div>
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right">
          <DrawerTrigger asChild>
            <Button size="sm" className="text-xs">
              <Plus className="h-3 w-3 mr-1.5" />
              Create Event
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-screen h-full w-full sm:max-w-lg">
            <DrawerHeader>
              <DrawerTitle>Create New Event</DrawerTitle>
              <DrawerDescription>Fill in the details to create a new event</DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-4 overflow-y-auto flex-1">
              <CreateEventForm
                onSuccess={() => {
                  setIsDrawerOpen(false)
                }}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
