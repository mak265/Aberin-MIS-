<template>
  <div class="page-container">
    <Navbar />

    <div class="container mx-auto px-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 tracking-tight">Welcome, {{ authStore.user?.email.split('@')[0] }}!</h1>
        <p class="text-gray-500 mt-2">Here's a summary of your orders and activity.</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Active Orders -->
        <div class="card card-hover border-l-4 border-blue-500 relative overflow-hidden group cursor-pointer" @click="$router.push('/my-orders')">
           <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="relative z-10">
            <h2 class="text-blue-600 text-sm font-bold uppercase tracking-wider mb-1">Active Orders</h2>
            <p class="text-4xl font-extrabold text-gray-800 mt-2">{{ activeOrders }}</p>
            <p class="text-gray-500 text-xs mt-2">In progress or ready</p>
          </div>
        </div>

        <!-- Completed Orders -->
        <div class="card card-hover border-l-4 border-green-500 relative overflow-hidden group">
           <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="relative z-10">
            <h2 class="text-green-600 text-sm font-bold uppercase tracking-wider mb-1">Completed</h2>
            <p class="text-4xl font-extrabold text-gray-800 mt-2">{{ completedOrders }}</p>
            <p class="text-gray-500 text-xs mt-2">Successfully delivered/picked up</p>
          </div>
        </div>

        <!-- Total Spent (Optional, maybe hidden if not relevant) -->
        <div class="card card-hover border-l-4 border-purple-500 relative overflow-hidden group">
           <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="relative z-10">
            <h2 class="text-purple-600 text-sm font-bold uppercase tracking-wider mb-1">Total Spent</h2>
            <p class="text-4xl font-extrabold text-gray-800 mt-2">{{ formatCurrency(totalSpent) }}</p>
            <p class="text-gray-500 text-xs mt-2">Lifetime purchases</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <!-- Recent Orders -->
         <div class="card">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-bold text-gray-800 flex items-center">
                <span class="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </span>
                Recent Orders
              </h2>
              <router-link to="/my-orders" class="text-xs text-blue-600 hover:text-blue-700 font-bold hover:underline uppercase">View All</router-link>
            </div>
            <div class="space-y-4">
               <div v-for="order in recentOrders" :key="order._id" class="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div>
                    <p class="text-sm font-bold text-gray-800">Order #{{ order._id.slice(-6).toUpperCase() }}</p>
                    <p class="text-xs text-gray-500">{{ new Date(order.createdAt).toLocaleDateString() }} • {{ order.items.length }} Items</p>
                  </div>
                  <span 
                    class="px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide border"
                    :class="{
                      'bg-yellow-50 text-yellow-700 border-yellow-100': order.status === 'pending',
                      'bg-blue-50 text-blue-700 border-blue-100': order.status === 'confirmed',
                      'bg-purple-50 text-purple-700 border-purple-100': order.status === 'ready_for_pickup' || order.status === 'out_for_delivery',
                      'bg-green-50 text-green-700 border-green-100': order.status === 'completed',
                      'bg-red-50 text-red-700 border-red-100': order.status === 'cancelled'
                    }"
                  >
                    {{ formatStatus(order.status) }}
                  </span>
               </div>
               <div v-if="recentOrders.length === 0" class="text-center py-8 text-gray-400">
                  No orders yet.
               </div>
            </div>
         </div>

         <!-- Quick Actions -->
         <div class="card bg-gradient-to-br from-gray-800 to-gray-900 text-white border-none">
            <h2 class="text-xl font-bold mb-6">Quick Actions</h2>
            <div class="space-y-4">
               <button @click="$router.push('/order-catalog')" class="w-full flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 group">
                  <div class="flex items-center">
                    <div class="p-3 rounded-lg bg-blue-500 group-hover:bg-blue-400 transition-colors mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div class="text-left">
                      <p class="font-bold text-lg">New Order</p>
                      <p class="text-gray-300 text-sm">Browse catalog and place order</p>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
               </button>
               
               <button @click="$router.push('/my-orders')" class="w-full flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 group">
                  <div class="flex items-center">
                    <div class="p-3 rounded-lg bg-purple-500 group-hover:bg-purple-400 transition-colors mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <div class="text-left">
                      <p class="font-bold text-lg">Track Orders</p>
                      <p class="text-gray-300 text-sm">View status and history</p>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
               </button>
            </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';
import Navbar from '../components/Navbar.vue';

const authStore = useAuthStore();
const orders = ref([]);

const fetchOrders = async () => {
  try {
    const response = await api.getMyOrders();
    orders.value = response.data;
  } catch (err) {
    console.error(err);
  }
};

const activeOrders = computed(() => {
  return orders.value.filter(o => !['completed', 'cancelled'].includes(o.status)).length;
});

const completedOrders = computed(() => {
  return orders.value.filter(o => o.status === 'completed').length;
});

const totalSpent = computed(() => {
  return orders.value
    .filter(o => o.status !== 'cancelled')
    .reduce((acc, o) => acc + (o.totalAmount || 0), 0);
});

const recentOrders = computed(() => {
  return orders.value.slice(0, 5);
});

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
};

const formatStatus = (status) => {
  const map = {
    'pending': 'Pending',
    'confirmed': 'Confirmed',
    'ready_for_pickup': 'Pickup Ready',
    'out_for_delivery': 'Delivering',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  };
  return map[status] || status;
};

onMounted(() => {
  fetchOrders();
});
</script>
