"use client"

import { Trash2 } from "lucide-react"
import { deleteService } from "@/app/admin/pricing/actions"
import { useState } from "react"

export function DeleteServiceButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this service package? This action cannot be undone.")) return
    
    setLoading(true)
    await deleteService(id)
    setLoading(false)
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center ml-4"
    >
      <Trash2 size={14} className="mr-1" /> {loading ? "..." : "Delete"}
    </button>
  )
}
