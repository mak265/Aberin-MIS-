export interface Category {
  id: string
  name: string
  slug: string
  description: string
  sort_order: number
  is_active: boolean
}

export interface Service {
  id: string
  name: string
  description: string
  base_price: number
  duration: string
  type: 'photography' | 'videography' | 'package'
  is_active: boolean
}

export interface Addon {
  id: string
  service_id: string
  name: string
  price: number
  description: string
  is_active: boolean
}

export interface Booking {
  id: string
  user_id: string
  service_id: string
  booking_date: string
  start_time: string
  duration_hours: number
  location: string
  client_notes: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  total_amount: number
  created_at: string
}

export interface PortfolioItem {
  id: string
  category_id: string
  image_url: string
  title: string
  description: string
  tags: string[]
  is_featured: boolean
}
