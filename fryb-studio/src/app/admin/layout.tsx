import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/AdminSidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full pt-16 md:pt-0 md:pl-64">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
