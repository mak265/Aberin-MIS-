"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { Label } from "@/components/ui/Label"
import { Plus, Edit } from "lucide-react"
import { createPortfolioItem, updatePortfolioItem, getCategories } from "@/app/admin/portfolio/actions"
import { Category } from "@/types"

interface Props {
  item?: any
  mode?: 'create' | 'edit'
}

export function PortfolioDialog({ item, mode = 'create' }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  // Load categories when dialog opens
  const handleOpenChange = async (open: boolean) => {
    setOpen(open)
    if (open && categories.length === 0) {
      const cats = await getCategories()
      setCategories(cats)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    let result
    
    if (mode === 'edit' && item) {
      result = await updatePortfolioItem(item.id, formData)
    } else {
      result = await createPortfolioItem(formData)
    }
    
    setLoading(false)
    if (result.success) {
      setOpen(false)
    } else {
      alert(result.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {mode === 'create' ? (
          <Button className="bg-primary text-black font-bold">
            <Plus size={18} className="mr-2" />
            Add New Item
          </Button>
        ) : (
          <button className="text-xs text-gray-400 hover:text-white flex items-center">
            <Edit size={12} className="mr-1" /> Edit
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-secondary border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add Portfolio Item' : 'Edit Portfolio Item'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Add a new image to your portfolio gallery.' : 'Update portfolio item details.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <input
                id="title"
                name="title"
                defaultValue={item?.title}
                className="col-span-3 bg-black/20 border border-white/10 rounded-md px-3 py-2 text-white"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <select
                id="category"
                name="category_id"
                defaultValue={item?.category_id}
                className="col-span-3 bg-black/20 border border-white/10 rounded-md px-3 py-2 text-white"
                required
              >
                <option value="">Select a category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image_url" className="text-right">
                Image URL
              </Label>
              <input
                id="image_url"
                name="image_url"
                defaultValue={item?.image_url}
                placeholder="https://..."
                className="col-span-3 bg-black/20 border border-white/10 rounded-md px-3 py-2 text-white"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <textarea
                id="description"
                name="description"
                defaultValue={item?.description}
                className="col-span-3 bg-black/20 border border-white/10 rounded-md px-3 py-2 text-white"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is_featured" className="text-right">
                Featured
              </Label>
              <input
                type="checkbox"
                id="is_featured"
                name="is_featured"
                defaultChecked={item?.is_featured}
                className="w-4 h-4"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-primary text-black">
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
