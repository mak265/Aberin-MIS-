import { createClient } from "@/lib/supabase/server"
import { format } from "date-fns"
import { Mail, Phone, Calendar } from "lucide-react"

export default async function AdminClientsPage() {
  const supabase = await createClient()

  // Fetch profiles with role 'client'
  const { data: clients } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'client')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Client Management</h1>
        <p className="text-gray-400">View and manage registered clients.</p>
      </div>

      <div className="bg-secondary/50 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-sm">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Contact Info</th>
                <th className="px-6 py-4 font-medium">Joined Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {clients && clients.length > 0 ? (
                clients.map((client) => (
                  <tr key={client.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{client.full_name || 'N/A'}</div>
                      <div className="text-xs text-gray-500 font-mono">{client.id.slice(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      <div className="flex items-center gap-2 mb-1">
                        <Mail size={14} className="text-primary" />
                        <span>{client.email}</span>
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Phone size={14} />
                          <span>{client.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-500" />
                        <span>{format(new Date(client.created_at), 'PPP')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary hover:text-primary/80 text-sm font-medium">
                        View History
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No clients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
