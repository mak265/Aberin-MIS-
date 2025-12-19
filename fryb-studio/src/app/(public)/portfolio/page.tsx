import { createClient } from "@/lib/supabase/server"
import Image from "next/image"

export default async function PortfolioPage() {
  const supabase = await createClient()
  
  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  // Fetch portfolio items (for now fetching all, in real app might want pagination or per category)
  const { data: portfolio } = await supabase
    .from('portfolio')
    .select('*, categories(*)')
    .order('created_at', { ascending: false })

  // Since we don't have portfolio data yet, let's use some placeholders if empty
  const portfolioItems = portfolio?.length ? portfolio : [
    {
      id: '1',
      image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2940&auto=format&fit=crop',
      title: 'Wedding Emotions',
      category: 'Weddings',
      size: 'large'
    },
    {
      id: '2',
      image_url: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=2940&auto=format&fit=crop',
      title: 'Couple Sunset',
      category: 'Weddings',
      size: 'normal'
    },
    {
      id: '3',
      image_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=2550&auto=format&fit=crop',
      title: 'Fashion Portrait',
      category: 'Portraits',
      size: 'tall'
    },
    {
      id: '4',
      image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2940&auto=format&fit=crop',
      title: 'Corporate Event',
      category: 'Events',
      size: 'normal'
    },
    {
      id: '5',
      image_url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2942&auto=format&fit=crop',
      title: 'Product Shoot',
      category: 'Commercial',
      size: 'wide'
    },
  ]

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Portfolio</h1>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button className="px-6 py-2 rounded-full bg-primary text-black font-bold">All</button>
            {categories?.map(cat => (
              <button key={cat.id} className="px-6 py-2 rounded-full bg-secondary/50 text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolioItems.map((item: any, i) => (
            <div 
              key={item.id} 
              className={`relative group overflow-hidden rounded-lg cursor-pointer ${
                item.size === 'large' ? 'md:col-span-2 md:row-span-2' : 
                item.size === 'wide' ? 'md:col-span-2' : 
                item.size === 'tall' ? 'row-span-2' : ''
              } aspect-square md:aspect-auto`}
            >
              <Image
                src={item.image_url}
                alt={item.title}
                width={800}
                height={800}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="text-primary font-bold tracking-wider text-sm mb-2 uppercase">
                    {item.category || item.categories?.name}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white">{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
