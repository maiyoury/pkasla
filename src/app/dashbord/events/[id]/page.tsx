import React from 'react'
import { Calendar, Users, MapPin, Mail, Edit, Trash2 } from 'lucide-react'

export default function EventDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Details</h1>
          <p className="text-gray-600 mt-2">Manage event information and guests</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center space-x-2">
            <Edit className="h-5 w-5" />
            <span>Edit</span>
          </button>
          <button className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition flex items-center space-x-2">
            <Trash2 className="h-5 w-5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Event Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Event Information</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <Calendar className="h-5 w-5 text-rose-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Event Date</p>
                  <p className="font-semibold text-gray-900">December 20, 2024</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <MapPin className="h-5 w-5 text-rose-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Venue</p>
                  <p className="font-semibold text-gray-900">Grand Ballroom, Phnom Penh</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Users className="h-5 w-5 text-rose-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Expected Guests</p>
                  <p className="font-semibold text-gray-900">120 guests</p>
                </div>
              </div>
            </div>
          </div>

          {/* Guest List */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Guest List</h2>
              <button className="text-rose-500 hover:text-rose-600 font-medium">View All</button>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-rose-500 rounded-full flex items-center justify-center text-white font-semibold">
                      G{item}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Guest Name {item}</p>
                      <p className="text-sm text-gray-600">guest{item}@example.com</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Confirmed
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total Invited</p>
                <p className="text-2xl font-bold text-gray-900">120</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">98</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-amber-600">18</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Declined</p>
                <p className="text-2xl font-bold text-red-600">4</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-rose-500 text-white py-3 rounded-lg font-semibold hover:bg-rose-600 transition flex items-center justify-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Send Invitations</span>
              </button>
              <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
                Export Guest List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
