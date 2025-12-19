import { Hero } from "@/components/home/Hero"
import { ServicePreview } from "@/components/home/ServicePreview"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      
      <ServicePreview />
      
      {/* CTA Section */}
      <section className="py-24 bg-primary text-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Ready to Create Something Amazing?</h2>
          <p className="text-xl mb-10 opacity-90">
            Let's discuss your project and turn your vision into reality.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-black text-white hover:bg-black/80 text-lg px-8 py-6 border-none">
              <Link href="/booking">Book Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-black text-black hover:bg-black/10 text-lg px-8 py-6">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
