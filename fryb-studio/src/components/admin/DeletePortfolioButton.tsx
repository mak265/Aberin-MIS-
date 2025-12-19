"use client"

import { Button } from "@/components/ui/Button"
import { Trash2 } from "lucide-react"
import { deletePortfolioItem } from "@/app/admin/portfolio/actions"
import { useState } from "react"

export function DeletePortfolioButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) return
    
    setLoading(true)
    await deletePortfolioItem(id)
    setLoading(false)
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
    >
      {loading ? "..." : "Delete"}
    </button>
  )
}
