"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createPortfolioItem(formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const category_id = formData.get('category_id') as string
  const description = formData.get('description') as string
  const image_url = formData.get('image_url') as string
  const is_featured = formData.get('is_featured') === 'on'

  if (!title || !category_id || !image_url) {
    return { error: 'Missing required fields' }
  }

  const { error } = await supabase
    .from('portfolio')
    .insert({
      title,
      category_id,
      description,
      image_url,
      is_featured
    })

  if (error) return { error: error.message }

  revalidatePath('/admin/portfolio')
  revalidatePath('/portfolio')
  return { success: true }
}

export async function updatePortfolioItem(id: string, formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const category_id = formData.get('category_id') as string
  const description = formData.get('description') as string
  const image_url = formData.get('image_url') as string
  const is_featured = formData.get('is_featured') === 'on'

  const { error } = await supabase
    .from('portfolio')
    .update({
      title,
      category_id,
      description,
      image_url,
      is_featured
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/portfolio')
  revalidatePath('/portfolio')
  return { success: true }
}

export async function deletePortfolioItem(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('portfolio')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/portfolio')
  revalidatePath('/portfolio')
  return { success: true }
}

export async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase.from('categories').select('*').order('name')
  return data || []
}
