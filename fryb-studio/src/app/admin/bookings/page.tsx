import { createClient } from "@/lib/supabase/server"
import { BookingsTable } from "@/components/admin/BookingsTable"

// This is a server component that fetches bookings
export default async function AdminBookingsPage() {
  const supabase = await createClient()

  // Fetch bookings with related data
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      *,
      profiles:user_id (full_name, email, phone),
      services:service_id (name, type)
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Booking Management</h1>
          <p className="text-gray-400">Manage client bookings and requests.</p>
        </div>
      </div>

      <BookingsTable bookings={bookings || []} />
    </div>
  )
}
