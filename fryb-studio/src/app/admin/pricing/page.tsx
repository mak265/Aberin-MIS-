import { createClient } from "@/lib/supabase/server"
import { ServiceDialog } from "@/components/admin/ServiceDialog"
import { DeleteServiceButton } from "@/components/admin/DeleteServiceButton"
import { BadgeDollarSign, Clock, CheckCircle, XCircle } from "lucide-react"

export default async function AdminPricingPage() {
  const supabase = await createClient()

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Pricing Management</h1>
          <p className="text-gray-400">Manage service packages and pricing.</p>
        </div>
        <ServiceDialog />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {services && services.length > 0 ? (
          services.map((service) => (
            <div key={service.id} className="bg-secondary/50 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-primary/30 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">{service.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                    service.type === 'videography' ? 'bg-purple-500/10 text-purple-400' :
                    service.type === 'package' ? 'bg-green-500/10 text-green-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>
                    {service.type}
                  </span>
                  {!service.is_active && (
                    <span className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded text-xs">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-gray-400 mb-4 md:mb-0 max-w-2xl">
                  {service.description}
                </p>
              </div>

              <div className="flex items-center gap-8 md:border-l md:border-white/10 md:pl-8">
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end text-gray-400 text-sm mb-1">
                    <Clock size={14} />
                    <span>{service.duration}</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    ₱{service.base_price.toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-col gap-2 border-l border-white/10 pl-6">
                  <ServiceDialog service={service} mode="edit" />
                  <DeleteServiceButton id={service.id} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-gray-500 bg-secondary/30 rounded-xl border border-dashed border-white/10">
            <p className="mb-4">No service packages found.</p>
            <ServiceDialog />
          </div>
        )}
      </div>
    </div>
  )
}
