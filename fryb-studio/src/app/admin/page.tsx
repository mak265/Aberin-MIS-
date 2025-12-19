import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { DollarSign, Calendar, Users, TrendingUp } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch quick stats
  const { count: bookingsCount } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })

  const { count: clientsCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'client')

  // Calculate revenue (mocked for now as we don't have real payments yet)
  const { data: bookings } = await supabase
    .from('bookings')
    .select('total_amount')
    .eq('status', 'confirmed')
  
  const totalRevenue = bookings?.reduce((acc, curr) => acc + (curr.total_amount || 0), 0) || 0

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Welcome back to FRYB Studio management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total Revenue" 
          value={`₱${totalRevenue.toLocaleString()}`} 
          icon={DollarSign} 
          trend="+12% from last month"
        />
        <StatsCard 
          title="Total Bookings" 
          value={bookingsCount?.toString() || "0"} 
          icon={Calendar} 
          trend="+5 new this week"
        />
        <StatsCard 
          title="Active Clients" 
          value={clientsCount?.toString() || "0"} 
          icon={Users} 
          trend="+2 new today"
        />
        <StatsCard 
          title="Pending Requests" 
          value="3" 
          icon={TrendingUp} 
          trend="Requires attention"
          highlight
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-secondary/50 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Bookings</h2>
          <div className="text-gray-400 text-sm text-center py-8">
            No recent bookings to display.
          </div>
        </div>

        <div className="bg-secondary/50 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Popular Services</h2>
          <div className="space-y-4">
            {['Wedding Standard Package', 'Prenup Shoot', 'Event Coverage'].map((service, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-white">{service}</span>
                <span className="text-primary font-bold">#{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatsCard({ title, value, icon: Icon, trend, highlight }: any) {
  return (
    <Card className={`bg-secondary/50 border-white/10 ${highlight ? 'border-primary/50' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${highlight ? 'text-primary' : 'text-gray-400'}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        <p className="text-xs text-gray-500 mt-1">{trend}</p>
      </CardContent>
    </Card>
  )
}
