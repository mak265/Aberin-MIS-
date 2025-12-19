"use client"

import { motion } from "framer-motion"
import { Service } from "@/types"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  services: Service[]
  selected: Service | null
  onSelect: (service: Service) => void
}

export function ServiceSelection({ services, selected, onSelect }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-bold text-white mb-4">Select a Service Package</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => onSelect(service)}
            className={cn(
              "cursor-pointer rounded-lg border p-6 transition-all relative overflow-hidden",
              selected?.id === service.id
                ? "border-primary bg-primary/10"
                : "border-white/10 bg-secondary/50 hover:border-primary/50"
            )}
          >
            {selected?.id === service.id && (
              <div className="absolute top-3 right-3 bg-primary text-black rounded-full p-1">
                <Check size={14} strokeWidth={3} />
              </div>
            )}
            
            <h4 className="text-lg font-bold text-white mb-2">{service.name}</h4>
            <p className="text-gray-400 text-sm mb-4 min-h-[40px]">{service.description}</p>
            
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <span className="text-primary font-bold text-lg">
                ₱{service.base_price.toLocaleString()}
              </span>
              <span className="text-gray-500 text-sm">
                {service.duration}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
