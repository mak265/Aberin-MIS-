"use client"

import { motion } from "framer-motion"
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css"

interface Props {
  date: Date | undefined
  time: string
  onUpdate: (data: any) => void
}

export function DateTimeSelection({ date, time, onUpdate }: Props) {
  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", 
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
    >
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Select Date</h3>
        <div className="bg-white rounded-lg p-2 text-black inline-block">
          <DayPicker
            mode="single"
            selected={date}
            onSelect={(d) => onUpdate({ date: d })}
            disabled={{ before: new Date() }}
            styles={{
              caption: { color: '#000' },
            }}
          />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Select Start Time</h3>
        <div className="grid grid-cols-2 gap-3">
          {timeSlots.map((slot) => (
            <button
              key={slot}
              onClick={() => onUpdate({ time: slot })}
              className={`p-3 rounded-md text-sm font-medium transition-all ${
                time === slot
                  ? "bg-primary text-black font-bold"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
