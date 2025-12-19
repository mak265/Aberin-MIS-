"use client"

import { motion } from "framer-motion"

interface Props {
  data: any
  onUpdate: (data: any) => void
}

export function ClientDetails({ data, onUpdate }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-bold text-white mb-4">Your Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">Full Name</label>
          <input
            type="text"
            value={data.clientName}
            onChange={(e) => onUpdate({ clientName: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">Email Address</label>
          <input
            type="email"
            value={data.clientEmail}
            onChange={(e) => onUpdate({ clientEmail: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="john@example.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">Phone Number</label>
          <input
            type="tel"
            value={data.clientPhone}
            onChange={(e) => onUpdate({ clientPhone: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="+63 900 000 0000"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">Event Location</label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => onUpdate({ location: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Venue Name / Address"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">Special Notes / Requests</label>
        <textarea
          value={data.notes}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Tell us more about your event..."
        />
      </div>
    </motion.div>
  )
}
