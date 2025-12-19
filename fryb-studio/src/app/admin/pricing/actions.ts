"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createService(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const base_price = parseFloat(formData.get('base_price') as string)
  const duration = formData.get('duration') as string
  const type = formData.get('type') as string
  const is_active = formData.get('is_active') === 'on'

  if (!name || !base_price || !type) {
    return { error: 'Missing required fields' }
  }

  const { error } = await supabase
    .from('services')
    .insert({
      name,
      description,
      base_price,
      duration,
      type,
      is_active
    })

  if (error) return { error: error.message }

  revalidatePath('/admin/pricing')
  revalidatePath('/services')
  revalidatePath('/booking')
  return { success: true }
}

export async function updateService(id: string, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const base_price = parseFloat(formData.get('base_price') as string)
  const duration = formData.get('duration') as string
  const type = formData.get('type') as string
  const is_active = formData.get('is_active') === 'on'

  const { error } = await supabase
    .from('services')
    .update({
      name,
      description,
      base_price,
      duration,
      type,
      is_active
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/pricing')
  revalidatePath('/services')
  revalidatePath('/booking')
  return { success: true }
}

export async function deleteService(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/pricing')
  revalidatePath('/services')
  revalidatePath('/booking')
  return { success: true }
}
