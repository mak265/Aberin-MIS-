<template>
  <div class="page-container">
    <Navbar />

    <div class="container mx-auto px-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 tracking-tight">Dashboard Overview</h1>
        <p class="text-gray-500 mt-2">Welcome back! Here's what's happening today.</p>
      </div>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Items -->
        <div class="card card-hover border-l-4 border-blue-500 relative overflow-hidden group">
          <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div class="relative z-10">
            <h2 class="text-blue-600 text-sm font-bold uppercase tracking-wider mb-1">Total Items</h2>
            <p class="text-3xl font-extrabold text-gray-800 mt-2">{{ totalItems }}</p>
            <p class="text-gray-500 text-xs mt-2">Unique SKUs in stock</p>
          </div>
        </div>

        <!-- Total Quantity -->
        <div class="card card-hover border-l-4 border-green-500 relative overflow-hidden group">
          <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div class="relative z-10">
            <h2 class="text-green-600 text-sm font-bold uppercase tracking-wider mb-1">Total Quantity</h2>
            <p class="text-3xl font-extrabold text-gray-800 mt-2">{{ totalQuantity.toLocaleString() }}</p>
            <p class="text-gray-500 text-xs mt-2">Units across all categories</p>
          </div>
        </div>

        <!-- Total Value -->
        <div class="card card-hover border-l-4 border-yellow-500 relative overflow-hidden group">
           <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="relative z-10">
            <h2 class="text-yellow-600 text-sm font-bold uppercase tracking-wider mb-1">Total Value</h2>
            <p class="text-3xl font-extrabold text-gray-800 mt-2">${{ totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</p>
            <p class="text-gray-500 text-xs mt-2">Estimated inventory worth</p>
          </div>
        </div>

        <!-- Pending Orders -->
        <div class="card card-hover border-l-4 border-purple-500 relative overflow-hidden group cursor-pointer" @click="$router.push('/orders-manage')">
           <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div class="relative z-10">
            <h2 class="text-purple-600 text-sm font-bold uppercase tracking-wider mb-1">Pending Orders</h2>
            <p class="text-3xl font-extrabold text-gray-800 mt-2">{{ pendingOrders }}</p>
            <p class="text-gray-500 text-xs mt-2">Orders awaiting approval</p>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <!-- Sales Chart -->
        <div class="card lg:col-span-2">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-800 flex items-center">
              <span class="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </span>
              Sales Trends
            </h2>
            <span class="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase">Last 7 Days</span>
          </div>
          <div class="h-64 w-full">
             <Bar v-if="chartData.labels.length > 0" :data="chartData" :options="chartOptions" />
             <div v-else class="h-full flex flex-col items-center justify-center text-gray-400">
               <p>No sales data available yet.</p>
             </div>
          </div>
        </div>

        <!-- Category Distribution -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-800 flex items-center">
              <span class="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </span>
              Categories
            </h2>
          </div>
          <div class="h-64 w-full relative">
             <Doughnut v-if="categoryData.labels.length > 0" :data="categoryData" :options="doughnutOptions" />
             <div v-else class="h-full flex flex-col items-center justify-center text-gray-400">
               <p>No category data.</p>
             </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Low Stock Table -->
        <div class="card h-full">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-gray-800 flex items-center">
              <span class="bg-red-100 text-red-600 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </span>
              Low Stock Alert
            </h2>
            <router-link to="/inventory" class="text-xs text-blue-600 hover:text-blue-700 font-bold hover:underline uppercase">View All</router-link>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                <tr>
                  <th class="px-4 py-3 text-left rounded-l-lg">Item</th>
                  <th class="px-4 py-3 text-center">Qty</th>
                  <th class="px-4 py-3 text-center rounded-r-lg">Min</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="i in lowStock" :key="i._id" class="hover:bg-gray-50 transition-colors text-sm">
                  <td class="px-4 py-2 font-medium text-gray-800">{{ i.name }}</td>
                  <td class="px-4 py-2 text-center">
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800">
                      {{ i.quantity }}
                    </span>
                  </td>
                  <td class="px-4 py-2 text-center text-gray-500">{{ i.minStock }}</td>
                </tr>
                <tr v-if="lowStock.length === 0">
                  <td colspan="3" class="px-4 py-8 text-center text-gray-500 italic text-sm">
                    All stock levels are healthy!
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Top Projects -->
        <div class="card h-full">
           <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-gray-800 flex items-center">
              <span class="bg-orange-100 text-orange-600 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
              Top Projects
            </h2>
          </div>
          <div class="space-y-4">
             <div v-for="(proj, index) in topProjects" :key="index" class="relative">
                <div class="flex justify-between text-sm mb-1">
                   <span class="font-bold text-gray-700">{{ proj.name || 'Unknown Project' }}</span>
                   <span class="text-gray-500">{{ proj.totalQuantity }} items</span>
                </div>
                <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                   <div class="h-full bg-orange-500 rounded-full" :style="{ width: getProjectPercentage(proj.totalQuantity) + '%' }"></div>
                </div>
             </div>
             <div v-if="topProjects.length === 0" class="text-center text-gray-400 text-sm py-4">
               No project activity yet.
             </div>
          </div>
        </div>

        <!-- Latest Transactions -->
        <div class="card h-full">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-gray-800 flex items-center">
              <span class="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Recent Activity
            </h2>
          </div>
          <div class="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              <div v-for="t in combinedTransactions" :key="t._id" class="flex items-center p-3 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow"
                   :class="t.type === 'in' ? 'bg-green-50/50' : 'bg-blue-50/50'">
                <div class="p-2 rounded-lg mr-3" :class="t.type === 'in' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'">
                   <svg v-if="t.type === 'in'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                    </svg>
                </div>
                <div class="flex-grow min-w-0">
                  <p class="text-sm font-bold text-gray-800 truncate">{{ t.item?.name }}</p>
                  <p class="text-xs text-gray-500 truncate">
                    {{ t.type === 'in' ? 'Stock In' : (t.project?.name || 'Stock Out') }}
                  </p>
                </div>
                <div class="text-right">
                   <span class="block font-bold text-sm" :class="t.type === 'in' ? 'text-green-600' : 'text-blue-600'">
                     {{ t.type === 'in' ? '+' : '-' }}{{ t.quantity }}
                   </span>
                   <span class="text-[10px] text-gray-400">{{ new Date(t.date).toLocaleDateString() }}</span>
                </div>
              </div>
              <div v-if="combinedTransactions.length === 0" class="text-sm text-gray-400 italic text-center py-2">No recent activity</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api';
import Navbar from '../components/Navbar.vue';
import { Bar, Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale);

const items = ref([]);
const salesStats = ref([]);
const lowStock = ref([]);
const latestIn = ref([]);
const latestOut = ref([]);
const pendingOrders = ref(0);
const categoryStats = ref([]);
const topProjects = ref([]);

const fetchDashboardData = async () => {
  try {
    const [dashRes, salesRes] = await Promise.all([
      api.getDashboard(),
      api.getSalesStats()
    ]);
    
    const data = dashRes.data;
    items.value = data.items || [];
    lowStock.value = data.lowStockItems || [];
    latestIn.value = data.latestIn || [];
    latestOut.value = data.latestOut || [];
    pendingOrders.value = data.pendingOrders || 0;
    categoryStats.value = data.categoryStats || [];
    topProjects.value = data.topProjects || [];
    
    salesStats.value = salesRes.data;
  } catch (err) {
    console.error(err);
  }
};

const totalItems = computed(() => items.value.length);
const totalQuantity = computed(() => items.value.reduce((acc, item) => acc + item.quantity, 0));
const totalValue = computed(() => items.value.reduce((acc, item) => acc + (item.quantity * (item.price || 0)), 0));

const combinedTransactions = computed(() => {
  const all = [
    ...latestIn.value.map(t => ({...t, type: 'in'})), 
    ...latestOut.value.map(t => ({...t, type: 'out'}))
  ];
  return all.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
});

const getProjectPercentage = (qty) => {
  if (topProjects.value.length === 0) return 0;
  const max = Math.max(...topProjects.value.map(p => p.totalQuantity));
  return (qty / max) * 100;
};

// Chart Configs
const chartData = computed(() => {
  return {
    labels: salesStats.value.map(stat => stat._id),
    datasets: [
      {
        label: 'Sales ($)',
        backgroundColor: '#3b82f6',
        borderRadius: 6,
        data: salesStats.value.map(stat => stat.totalSales)
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
    x: { grid: { display: false } }
  }
};

const categoryData = computed(() => {
  return {
    labels: categoryStats.value.map(c => c.name || 'Uncategorized'),
    datasets: [{
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1'],
      borderWidth: 0,
      data: categoryStats.value.map(c => c.count)
    }]
  };
});

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'right', labels: { usePointStyle: true, boxWidth: 8 } }
  },
  cutout: '70%'
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 20px;
}
</style>
