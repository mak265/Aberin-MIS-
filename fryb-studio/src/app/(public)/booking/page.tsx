import { BookingWizard } from "@/components/booking/BookingWizard"

export default function BookingPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-background to-secondary/50">
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
          Book Your Session
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Select your package, choose a date, and let us handle the rest.
        </p>
      </div>
      
      <BookingWizard />
    </div>
  )
}
