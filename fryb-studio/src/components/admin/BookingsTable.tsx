"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Check, X, Clock } from "lucide-react"
import { BookingDetailsDialog } from "@/components/admin/BookingDetailsDialog"

interface Props {
  bookings: any[]
}

export function BookingsTable({ bookings }: Props) {
  const [selectedBooking, setSelectedBooking] = useState<any>(null)

  return (
    <>
      <div className="bg-secondary/50 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-sm">
                <th className="px-6 py-4 font-medium">Booking ID</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Service</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings && bookings.length > 0 ? (
                bookings.map((booking: any) => {
                  const clientName = booking.profiles?.full_name || booking.guest_info?.name || 'Unknown Client';
                  const clientEmail = booking.profiles?.email || booking.guest_info?.email || 'No email';
                  
                  return (
                    <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-gray-400 text-xs font-mono">
                        {booking.id.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{clientName}</div>
                        <div className="text-xs text-gray-500">{clientEmail}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {booking.services?.name}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        <div>{format(new Date(booking.booking_date), 'MMM d, yyyy')}</div>
                        <div className="text-xs text-gray-500">{booking.start_time}</div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-6 py-4 text-white font-medium">
                        ₱{booking.total_amount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedBooking(booking)}
                          className="text-gray-400 hover:text-white text-sm underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <BookingDetailsDialog 
        booking={selectedBooking} 
        onClose={() => setSelectedBooking(null)} 
      />
    </>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    confirmed: "bg-green-500/10 text-green-500 border-green-500/20",
    completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  }

  const icons = {
    pending: Clock,
    confirmed: Check,
    completed: Check,
    cancelled: X,
  }

  const Icon = icons[status as keyof typeof icons] || Clock
  const style = styles[status as keyof typeof styles] || styles.pending

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      <Icon size={12} className="mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
