import Link from "next/link"
import { Instagram, Facebook, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-2xl font-serif font-bold text-primary tracking-wider block mb-6">
              FRYB STUDIO
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Capturing life's most precious moments with artistic vision and technical excellence. Your story, beautifully told.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/portfolio" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mr-3 text-primary" />
                <span>123 Studio Street, Creative City</span>
              </li>
              <li className="flex items-center text-gray-400 text-sm">
                <Phone className="w-4 h-4 mr-3 text-primary" />
                <span>+63 912 345 6789</span>
              </li>
              <li className="flex items-center text-gray-400 text-sm">
                <Mail className="w-4 h-4 mr-3 text-primary" />
                <span>hello@frybstudio.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-black transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-black transition-all">
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} FRYB Studio. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-500 hover:text-white text-xs">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-white text-xs">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
