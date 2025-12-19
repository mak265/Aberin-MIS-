"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Service } from "@/types"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { ServiceSelection } from "./ServiceSelection"
import { DateTimeSelection } from "./DateTimeSelection"
import { ClientDetails } from "./ClientDetails"
import { BookingSummary } from "./BookingSummary"
import { useRouter } from "next/navigation"

export function BookingWizard() {
  const [step, setStep] = useState(1)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  
  const [bookingData, setBookingData] = useState({
    service: null as Service | null,
    date: undefined as Date | undefined,
    time: "",
    duration: 4,
    location: "",
    notes: "",
    clientName: "",
    clientEmail: "",
    clientPhone: ""
  })

  const supabase = createClient()

  useEffect(() => {
    async function fetchServices() {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('base_price', { ascending: true })
      
      if (data) setServices(data)
      setLoading(false)
    }
    fetchServices()
  }, [])

  const nextStep = () => setStep(s => s + 1)
  const prevStep = () => setStep(s => s - 1)

  const updateBooking = (data: Partial<typeof bookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }))
  }

  const submitBooking = async () => {
    setSubmitting(true)
    
    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser()
    
    // Prepare payload
    const payload: any = {
      service_id: bookingData.service?.id,
      booking_date: bookingData.date?.toISOString(),
      start_time: bookingData.time,
      duration_hours: bookingData.duration, // Should be from service or user input
      location: bookingData.location,
      client_notes: bookingData.notes,
      total_amount: bookingData.service?.base_price || 0,
      status: 'pending'
    }

    if (user) {
      payload.user_id = user.id
    } else {
      payload.guest_info = {
        name: bookingData.clientName,
        email: bookingData.clientEmail,
        phone: bookingData.clientPhone
      }
    }

    const { error } = await supabase.from('bookings').insert(payload)

    if (error) {
      alert(`Booking failed: ${error.message}`)
      setSubmitting(false)
    } else {
      alert("Booking successfully submitted! We will contact you shortly.")
      router.push('/')
      router.refresh()
    }
  }

  if (loading) return <div className="text-white text-center py-20">Loading services...</div>

  return (
    <div className="max-w-4xl mx-auto bg-secondary/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-2xl">
      <div className="bg-secondary/80 p-6 border-b border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-serif font-bold text-white">Book Your Session</h2>
          <div className="text-sm text-gray-400">Step {step} of 4</div>
        </div>
        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
          <motion.div 
            className="bg-primary h-full"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-6 min-h-[400px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <ServiceSelection 
              key="step1"
              services={services} 
              selected={bookingData.service}
              onSelect={(service) => updateBooking({ service })}
            />
          )}
          {step === 2 && (
            <DateTimeSelection
              key="step2"
              date={bookingData.date}
              time={bookingData.time}
              onUpdate={updateBooking}
            />
          )}
          {step === 3 && (
            <ClientDetails
              key="step3"
              data={bookingData}
              onUpdate={updateBooking}
            />
          )}
          {step === 4 && (
            <BookingSummary
              key="step4"
              data={bookingData}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 border-t border-white/10 flex justify-between bg-secondary/30">
        <Button 
          variant="outline" 
          onClick={prevStep} 
          disabled={step === 1 || submitting}
          className="border-white/20 text-white hover:bg-white/10"
        >
          Back
        </Button>
        
        {step < 4 ? (
          <Button 
            onClick={nextStep}
            disabled={
              (step === 1 && !bookingData.service) ||
              (step === 2 && (!bookingData.date || !bookingData.time)) ||
              (step === 3 && (!bookingData.clientName || !bookingData.clientEmail))
            }
            className="bg-primary text-black font-bold"
          >
            Next Step
          </Button>
        ) : (
          <Button 
            onClick={submitBooking}
            disabled={submitting}
            className="bg-primary text-black font-bold"
          >
            {submitting ? "Processing..." : "Confirm Booking"}
          </Button>
        )}
      </div>
    </div>
  )
}
