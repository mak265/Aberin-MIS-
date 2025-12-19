import { createClient } from "@/lib/supabase/server"
import { PortfolioDialog } from "@/components/admin/PortfolioDialog"
import { DeletePortfolioButton } from "@/components/admin/DeletePortfolioButton"
import Image from "next/image"

export default async function AdminPortfolioPage() {
  const supabase = await createClient()

  const { data: portfolio } = await supabase
    .from('portfolio')
    .select('*, categories(*)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio Management</h1>
          <p className="text-gray-400">Manage your gallery content.</p>
        </div>
        <PortfolioDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {portfolio && portfolio.length > 0 ? (
          portfolio.map((item: any) => (
            <div key={item.id} className="bg-secondary/50 border border-white/10 rounded-xl overflow-hidden group">
              <div className="relative aspect-square">
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {item.is_featured && (
                  <div className="absolute top-2 right-2 bg-primary text-black text-xs font-bold px-2 py-1 rounded">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="text-primary text-xs font-bold uppercase mb-1">
                  {item.categories?.name || 'Uncategorized'}
                </div>
                <h3 className="text-white font-bold mb-1 truncate">{item.title}</h3>
                <div className="flex justify-between items-center mt-4">
                  <PortfolioDialog item={item} mode="edit" />
                  <DeletePortfolioButton id={item.id} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500 bg-secondary/30 rounded-xl border border-dashed border-white/10">
            <p className="mb-4">No portfolio items found.</p>
            <PortfolioDialog />
          </div>
        )}
      </div>
    </div>
  )
}
