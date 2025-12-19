"use client"

import { useState } from "react"
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
import { createService, updateService } from "@/app/admin/pricing/actions"
import { Service } from "@/types"

interface Props {
  service?: Service
  mode?: 'create' | 'edit'
}

export function ServiceDialog({ service, mode = 'create' }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    let result
    
    if (mode === 'edit' && service) {
      result = await updateService(service.id, formData)
    } else {
      result = await createService(formData)
    }
    
    setLoading(false)
    if (result.success) {
      setOpen(false)
    } else {
      alert(result.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === 'create' ? (
          <Button className="bg-primary text-black font-bold">
            <Plus size={18} className="mr-2" />
            Add New Package
          </Button>
        ) : (
          <button className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
            <Edit size={14} className="mr-1" /> Edit
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-secondary border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add Service Package' : 'Edit Service Package'}</DialogTitle>
          <DialogDescription>
            Configure the pricing and details for this service.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <input
                id="name"
                name="name"
                defaultValue={service?.name}
                className="col-span-3 bg-black/20 border border-white/10 rounded-md px-3 py-2 text-white"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <select
                id="type"
                name="type"
                defaultValue={service?.type}
                className="col-span-3 bg-black/20 border border-white/10 rounded-md px-3 py-2 text-white"
                required
              >
                <option value="photography">Photography</option>
                <option value="videography">Videography</option>
                <option value="package">Full Package</option>
              </select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="base_price" className="text-right">Price (₱)</Label>
              <input
                type="number"
                id="base_price"
                name="base_price"
                defaultValue={service?.base_price}
                className="col-span-3 bg-black/20 border border-white/10 rounded-md px-3 py-2 text-white"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">Duration</Label>
              <input
                id="duration"
                name="duration"
                defaultValue={service?.duration}
                placeholder="e.g. 8 hours"
                className="col-span-3 bg-black/20 border border-white/10 rounded-md px-3 py-2 text-white"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <textarea
                id="description"
                name="description"
                defaultValue={service?.description}
                className="col-span-3 bg-black/20 border border-white/10 rounded-md px-3 py-2 text-white"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is_active" className="text-right">Active</Label>
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                defaultChecked={service?.is_active ?? true}
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
