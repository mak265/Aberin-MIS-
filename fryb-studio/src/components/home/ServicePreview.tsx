"use client"

import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { motion } from "framer-motion"
import { Camera, Video, Heart, Users } from "lucide-react"

const services = [
  {
    icon: Heart,
    title: "Weddings",
    description: "Capture the magic of your special day with our cinematic wedding photography and videography.",
    image: "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=2940&auto=format&fit=crop"
  },
  {
    icon: Users,
    title: "Events",
    description: "From corporate gatherings to private parties, we document every important moment.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2940&auto=format&fit=crop"
  },
  {
    icon: Camera,
    title: "Portraits",
    description: "Professional headshots, family portraits, and creative sessions that show your best self.",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=2550&auto=format&fit=crop"
  },
  {
    icon: Video,
    title: "Commercial",
    description: "High-quality visuals for your brand, products, and marketing campaigns.",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2942&auto=format&fit=crop"
  }
]

export function ServicePreview() {
  return (
    <section className="py-24 bg-secondary/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Our Services</h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We offer a comprehensive range of photography and videography services tailored to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative bg-background border border-white/5 rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300"
            >
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all z-10" />
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <service.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {service.description}
                </p>
                <Link href="/services" className="text-primary text-sm font-medium hover:underline inline-flex items-center">
                  Learn More &rarr;
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
