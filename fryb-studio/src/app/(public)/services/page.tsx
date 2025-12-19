import { createClient } from "@/lib/supabase/server"
import { Service } from "@/types"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { Check } from "lucide-react"

export default async function ServicesPage() {
  const supabase = await createClient()
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('base_price', { ascending: true })

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Our Services & Pricing</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Transparent pricing for professional photography and videography services. 
            Choose the package that fits your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service: Service) => (
            <div key={service.id} className="bg-secondary/50 border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col">
              <div className="p-8 flex-grow">
                <div className="text-primary text-sm font-bold uppercase tracking-wider mb-2">
                  {service.type}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{service.name}</h3>
                <div className="text-3xl font-bold text-white mb-6">
                  ₱{service.base_price.toLocaleString()}
                  <span className="text-base font-normal text-gray-500 ml-2">/ {service.duration}</span>
                </div>
                <p className="text-gray-400 mb-6">
                  {service.description}
                </p>
                
                <div className="space-y-3 mb-8">
                  {/* Mock features for now since we don't have a features table yet */}
                  {['High Resolution Images', 'Professional Editing', 'Online Gallery'].map((feature) => (
                    <div key={feature} className="flex items-center text-gray-300 text-sm">
                      <Check className="w-4 h-4 text-primary mr-3" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-8 pt-0 mt-auto">
                <Button asChild className="w-full bg-primary text-black font-bold hover:bg-white transition-colors">
                  <Link href={`/booking`}>Book This Package</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
