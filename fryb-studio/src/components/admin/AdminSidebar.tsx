"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Calendar, 
  Image as ImageIcon, 
  Settings, 
  Users, 
  LogOut,
  DollarSign,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { name: 'Pricing', href: '/admin/pricing', icon: DollarSign },
  { name: 'Portfolio', href: '/admin/portfolio', icon: ImageIcon },
  { name: 'Clients', href: '/admin/clients', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-secondary border-r border-white/10">
      <div className="p-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-serif font-bold text-primary tracking-wider">
          FRYB ADMIN
        </Link>
        <button className="md:hidden text-white" onClick={() => setIsOpen(false)}>
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary font-bold" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <form action="/auth/signout" method="post">
          <button className="flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg w-full transition-colors">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Trigger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-secondary border-b border-white/10 p-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-serif font-bold text-primary tracking-wider">
          FRYB ADMIN
        </Link>
        <button onClick={() => setIsOpen(true)} className="text-white">
          <Menu size={24} />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 h-screen fixed top-0 left-0 bottom-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Sheet */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-secondary shadow-xl"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
