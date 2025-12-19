const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://sewglpdgwvgmlovpjbpb.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNld2dscGRnd3ZnbWxvdnBqYnBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA4ODM2OCwiZXhwIjoyMDgxNjY0MzY4fQ.9jePKUxfAkLTqDyZIqVD-e-A-MkS_Op8Qtmkciou9ds'

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function seedData() {
  console.log('Seeding data...')

  // 1. Seed Categories (Ensure they exist)
  const categories = [
    { name: 'Weddings', slug: 'weddings', description: 'Wedding photography and videography' },
    { name: 'Events', slug: 'events', description: 'Corporate and private events' },
    { name: 'Portraits', slug: 'portraits', description: 'Professional and creative portraits' },
    { name: 'Commercial', slug: 'commercial', description: 'Brand and product photography' }
  ]

  for (const cat of categories) {
    const { data } = await supabase.from('categories').select('id').eq('slug', cat.slug).single()
    if (!data) {
      await supabase.from('categories').insert(cat)
      console.log(`Created category: ${cat.name}`)
    }
  }

  // Get Category IDs
  const { data: cats } = await supabase.from('categories').select('*')
  const weddingCat = cats.find(c => c.slug === 'weddings')
  const eventsCat = cats.find(c => c.slug === 'events')
  const portraitsCat = cats.find(c => c.slug === 'portraits')
  const commercialCat = cats.find(c => c.slug === 'commercial')

  // 2. Seed Services (Additional)
  const services = [
    { name: 'Drone Coverage Add-on', description: 'Aerial footage for your event', base_price: 5000, duration: '2 hours', type: 'videography', is_active: true },
    { name: 'Photo Album (Premium)', description: 'Hardcover, 40 pages, premium paper', base_price: 8000, duration: 'N/A', type: 'package', is_active: true },
    { name: 'Same Day Edit (SDE)', description: 'On-site video editing for reception playback', base_price: 15000, duration: '6 hours', type: 'videography', is_active: true }
  ]

  for (const service of services) {
    const { data } = await supabase.from('services').select('id').eq('name', service.name).single()
    if (!data) {
      await supabase.from('services').insert(service)
      console.log(`Created service: ${service.name}`)
    }
  }

  // 3. Seed Portfolio Items
  const portfolioItems = [
    { 
      title: 'Beach Wedding Sunset', 
      category_id: weddingCat?.id, 
      image_url: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=2940&auto=format&fit=crop', 
      description: 'Golden hour shot at Boracay', 
      is_featured: true 
    },
    { 
      title: 'Corporate Summit 2023', 
      category_id: eventsCat?.id, 
      image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2940&auto=format&fit=crop', 
      description: 'Annual tech summit coverage', 
      is_featured: false 
    },
    { 
      title: 'Fashion Editorial', 
      category_id: portraitsCat?.id, 
      image_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=2550&auto=format&fit=crop', 
      description: 'Studio shoot for magazine', 
      is_featured: true 
    },
    { 
      title: 'Product Launch', 
      category_id: commercialCat?.id, 
      image_url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2942&auto=format&fit=crop', 
      description: 'New gadget reveal event', 
      is_featured: false 
    }
  ]

  if (weddingCat) {
    for (const item of portfolioItems) {
       // Check duplication loosely by title
       const { data } = await supabase.from('portfolio').select('id').eq('title', item.title).single()
       if (!data) {
         await supabase.from('portfolio').insert(item)
         console.log(`Created portfolio item: ${item.title}`)
       }
    }
  }

  // 4. Seed Clients & Bookings (Mock)
  // We'll create some mock users first directly in profiles if we can, but usually profiles are linked to auth.users.
  // Since we can't easily create auth users via script without admin API (which we have), let's do 2 more users.
  
  const mockClients = [
    { email: 'client1@test.com', password: 'password123', name: 'Maria Santos', phone: '09171234567' },
    { email: 'client2@test.com', password: 'password123', name: 'Juan Cruz', phone: '09187654321' }
  ]

  for (const client of mockClients) {
    const { data: user, error } = await supabase.auth.admin.createUser({
      email: client.email,
      password: client.password,
      email_confirm: true,
      user_metadata: { full_name: client.name }
    })

    if (user && user.user) {
      console.log(`Created client: ${client.email}`)
      // Update profile with phone
      await supabase.from('profiles').update({ phone: client.phone }).eq('id', user.user.id)
      
      // Create a mock booking for this client
      const { data: service } = await supabase.from('services').select('id, base_price').limit(1).single()
      
      if (service) {
        await supabase.from('bookings').insert({
          user_id: user.user.id,
          service_id: service.id,
          booking_date: new Date().toISOString().split('T')[0],
          start_time: '14:00:00',
          duration_hours: 4,
          location: 'Makati City',
          status: Math.random() > 0.5 ? 'confirmed' : 'pending',
          total_amount: service.base_price,
          client_notes: 'Please arrive early.'
        })
        console.log(`Created booking for: ${client.email}`)
      }
    } else if (error?.message?.includes('already registered')) {
        console.log(`Client ${client.email} already exists.`)
    }
  }

  console.log('Seeding completed!')
}

seedData()
