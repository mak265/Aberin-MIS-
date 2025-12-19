"use client"

import { Button } from "@/components/ui/Button"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account and system preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="bg-secondary/50 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Admin Profile</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
              <input 
                type="email" 
                value="admin@frybstudio.com" 
                disabled 
                className="w-full bg-black/20 border border-white/10 rounded-md px-4 py-2 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Display Name</label>
              <input 
                type="text" 
                defaultValue="FRYB Admin" 
                className="w-full bg-black/20 border border-white/10 rounded-md px-4 py-2 text-white focus:border-primary focus:outline-none"
              />
            </div>
            <div className="pt-2">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black">
                Update Profile
              </Button>
            </div>
          </form>
        </div>

        {/* Security Settings */}
        <div className="bg-secondary/50 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Security</h2>
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start text-left border-white/10 hover:bg-white/5">
              Change Password
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleSignOut}
              disabled={loading}
              className="w-full justify-start text-left bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
            >
              {loading ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
