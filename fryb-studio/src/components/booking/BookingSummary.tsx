"use client"

import { motion } from "framer-motion"
import { format } from "date-fns"

interface Props {
  data: any
}

export function BookingSummary({ data }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-bold text-white mb-4">Review Your Booking</h3>
      
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
        <div className="flex justify-between border-b border-white/10 pb-4">
          <div>
            <div className="text-sm text-gray-400">Service</div>
            <div className="font-bold text-white text-lg">{data.service?.name}</div>
            <div className="text-sm text-gray-500">{data.service?.type}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Price</div>
            <div className="font-bold text-primary text-xl">₱{data.service?.base_price.toLocaleString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-400">Date & Time</div>
            <div className="text-white">
              {data.date ? format(data.date, "PPP") : "Not selected"} at {data.time}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Location</div>
            <div className="text-white">{data.location}</div>
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-400">Client Details</div>
          <div className="text-white">{data.clientName}</div>
          <div className="text-gray-500 text-sm">{data.clientEmail} • {data.clientPhone}</div>
        </div>

        {data.notes && (
          <div>
            <div className="text-sm text-gray-400">Notes</div>
            <div className="text-white italic">"{data.notes}"</div>
          </div>
        )}
      </div>

      <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg flex items-start gap-3">
        <div className="text-primary mt-1">ℹ️</div>
        <div className="text-sm text-gray-300">
          <p className="mb-1">This is a preliminary booking request. No payment is required yet.</p>
          <p>We will review your request and send a formal quote and contract to your email.</p>
        </div>
      </div>
    </motion.div>
  )
}
