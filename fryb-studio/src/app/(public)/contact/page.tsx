import { Button } from "@/components/ui/Button"
import { Mail, MapPin, Phone, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Contact Info */}
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Get in Touch</h1>
            <p className="text-gray-400 text-lg mb-12">
              Have a question or want to discuss a custom project? We'd love to hear from you.
            </p>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Phone</h3>
                  <p className="text-gray-400">+63 912 345 6789</p>
                  <p className="text-gray-500 text-sm">Mon-Fri from 9am to 6pm</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Email</h3>
                  <p className="text-gray-400">hello@frybstudio.com</p>
                  <p className="text-gray-500 text-sm">We'll respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Studio Location</h3>
                  <p className="text-gray-400">123 Studio Street, Creative City</p>
                  <p className="text-gray-500 text-sm">Visits by appointment only</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Operating Hours</h3>
                  <p className="text-gray-400">Monday - Saturday</p>
                  <p className="text-gray-500 text-sm">9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-secondary/50 border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Name</label>
                  <input type="text" className="w-full bg-black/20 border border-white/10 rounded-md px-4 py-3 text-white focus:border-primary focus:outline-none" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Email</label>
                  <input type="email" className="w-full bg-black/20 border border-white/10 rounded-md px-4 py-3 text-white focus:border-primary focus:outline-none" placeholder="your@email.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Subject</label>
                <select className="w-full bg-black/20 border border-white/10 rounded-md px-4 py-3 text-white focus:border-primary focus:outline-none">
                  <option>General Inquiry</option>
                  <option>Wedding Photography</option>
                  <option>Event Coverage</option>
                  <option>Commercial Project</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Message</label>
                <textarea rows={5} className="w-full bg-black/20 border border-white/10 rounded-md px-4 py-3 text-white focus:border-primary focus:outline-none" placeholder="How can we help you?" />
              </div>

              <Button className="w-full bg-primary text-black font-bold py-6 text-lg">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
