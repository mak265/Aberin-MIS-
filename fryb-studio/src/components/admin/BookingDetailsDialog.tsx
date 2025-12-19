"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog"
import { format } from "date-fns"
import { Check, X, Clock, MapPin, Mail, Phone, Calendar, User } from "lucide-react"

interface BookingDetailsProps {
  booking: any
  onClose: () => void
}

export function BookingDetailsDialog({ booking, onClose }: BookingDetailsProps) {
  if (!booking) return null

  const clientName = booking.profiles?.full_name || booking.guest_info?.name || 'Unknown Client'
  const clientEmail = booking.profiles?.email || booking.guest_info?.email || 'No email'
  const clientPhone = booking.profiles?.phone || booking.guest_info?.phone || 'No phone'

  return (
    <Dialog open={!!booking} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-secondary border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-3">
            Booking Details
            <StatusBadge status={booking.status} />
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            ID: {booking.id}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <h3 className="font-bold text-primary border-b border-white/10 pb-2">Service Info</h3>
            
            <div>
              <div className="text-sm text-gray-400 mb-1">Service Package</div>
              <div className="font-medium">{booking.services?.name || 'Unknown Service'}</div>
              <div className="text-xs text-gray-500 capitalize">{booking.services?.type}</div>
            </div>

            <div>
              <div className="text-sm text-gray-400 mb-1">Date & Time</div>
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>{format(new Date(booking.booking_date), 'PPPP')}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Clock size={14} />
                <span>{booking.start_time} ({booking.duration_hours} hours)</span>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-400 mb-1">Total Amount</div>
              <div className="text-xl font-bold text-green-400">
                ₱{booking.total_amount?.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-primary border-b border-white/10 pb-2">Client Info</h3>
            
            <div>
              <div className="text-sm text-gray-400 mb-1">Name</div>
              <div className="flex items-center gap-2">
                <User size={14} />
                <span>{clientName}</span>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-400 mb-1">Contact</div>
              <div className="flex items-center gap-2 mb-1">
                <Mail size={14} />
                <a href={`mailto:${clientEmail}`} className="hover:text-primary transition-colors">{clientEmail}</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} />
                <a href={`tel:${clientPhone}`} className="hover:text-primary transition-colors">{clientPhone}</a>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-400 mb-1">Location</div>
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                <span>{booking.location}</span>
              </div>
            </div>
          </div>
        </div>

        {booking.client_notes && (
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <div className="text-sm text-gray-400 mb-1">Client Notes</div>
            <p className="italic text-gray-300">"{booking.client_notes}"</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            Close
          </button>
          {/* Future: Add Accept/Reject buttons here */}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    confirmed: "bg-green-500/10 text-green-500 border-green-500/20",
    completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  }

  const style = styles[status as keyof typeof styles] || styles.pending

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
