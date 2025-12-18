<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
    <div class="container mx-auto px-6">
      <div class="h-16 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md"></div>
          <div class="font-bold text-lg tracking-wide text-white">InventorySystem</div>
        </div>
        <div class="hidden md:flex items-center space-x-1">
          <router-link v-if="authStore.user" 
            to="/dashboard" 
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="$route.path === '/dashboard' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'"
          >Dashboard</router-link>
          <router-link v-if="authStore.user && authStore.user.role === 'client'" 
            to="/order-catalog" 
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="$route.path === '/order-catalog' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'"
          >Order</router-link>
          <router-link v-if="authStore.user && authStore.user.role === 'client'" 
            to="/my-orders" 
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="$route.path === '/my-orders' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'"
          >My Orders</router-link>
          <router-link v-if="authStore.user && (authStore.user.role === 'warehouse_staff' || authStore.user.role === 'admin')" 
            to="/orders-manage" 
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="$route.path === '/orders-manage' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'"
          >Manage Orders</router-link>
          <router-link v-if="authStore.user && (authStore.user.role === 'warehouse_staff' || authStore.user.role === 'admin')" 
            to="/stock" 
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="$route.path === '/stock' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'"
          >Stock</router-link>
          <router-link v-if="authStore.user && (authStore.user.role === 'admin' || authStore.user.role === 'warehouse_staff' || authStore.user.role === 'site_engineer')" 
            to="/inventory" 
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="$route.path === '/inventory' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'"
          >Inventory</router-link>
          <router-link v-if="authStore.user && (authStore.user.role === 'warehouse_staff' || authStore.user.role === 'admin')"
            to="/pos" 
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="$route.path === '/pos' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'"
          >POS</router-link>
          <router-link v-if="authStore.user && authStore.user.role === 'admin'" 
            to="/projects" 
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="$route.path === '/projects' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'"
          >Projects</router-link>
          <router-link v-if="authStore.user && (authStore.user.role === 'admin' || authStore.user.role === 'warehouse_staff')" 
            to="/categories" 
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="$route.path === '/categories' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'"
          >Categories</router-link>
          <router-link v-if="authStore.user && (authStore.user.role === 'admin' || authStore.user.role === 'site_engineer' || authStore.user.role === 'warehouse_staff')" 
            to="/transactions" 
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="$route.path === '/transactions' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'"
          >Records</router-link>
          <router-link v-if="authStore.user && (authStore.user.role === 'admin' || authStore.user.role === 'site_engineer')" 
            to="/reports" 
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="$route.path === '/reports' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'"
          >Reports</router-link>
          <router-link v-if="authStore.user && authStore.user.role === 'admin'" 
            to="/users" 
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="$route.path === '/users' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'"
          >Users</router-link>
          <router-link v-if="authStore.user && (authStore.user.role === 'warehouse_staff' || authStore.user.role === 'admin')" 
            to="/sales-history" 
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="$route.path === '/sales-history' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'"
          >Sales</router-link>
          <button @click="logout" class="ml-2 inline-flex items-center px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors">Logout</button>
        </div>
        <button class="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none" @click="menuOpen = !menuOpen">
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
    </div>
    <div v-if="menuOpen" class="md:hidden border-t border-gray-800">
      <div class="px-6 py-3 space-y-1">
        <router-link 
          to="/dashboard" 
          class="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path === '/dashboard' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'"
        >Dashboard</router-link>
        <router-link v-if="authStore.user && authStore.user.role === 'client'" 
          to="/order-catalog" 
          class="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path === '/order-catalog' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'"
        >Order</router-link>
        <router-link v-if="authStore.user && authStore.user.role === 'client'" 
          to="/my-orders" 
          class="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path === '/my-orders' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'"
        >My Orders</router-link>
        <router-link v-if="authStore.user && (authStore.user.role === 'warehouse_staff' || authStore.user.role === 'admin')" 
          to="/orders-manage" 
          class="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path === '/orders-manage' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'"
        >Manage Orders</router-link>
        <router-link v-if="authStore.user && (authStore.user.role === 'warehouse_staff' || authStore.user.role === 'admin')" 
          to="/stock" 
          class="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path === '/stock' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'"
        >Stock</router-link>
        <router-link v-if="authStore.user && (authStore.user.role === 'admin' || authStore.user.role === 'warehouse_staff' || authStore.user.role === 'site_engineer')" 
          to="/inventory" 
          class="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path === '/inventory' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'"
        >Inventory</router-link>
        <router-link v-if="authStore.user && (authStore.user.role === 'warehouse_staff' || authStore.user.role === 'admin')"
          to="/pos" 
          class="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path === '/pos' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'"
        >POS</router-link>
        <router-link v-if="authStore.user && authStore.user.role === 'admin'" 
          to="/projects" 
          class="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path === '/projects' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'"
        >Projects</router-link>
        <router-link v-if="authStore.user && (authStore.user.role === 'admin' || authStore.user.role === 'warehouse_staff')" 
          to="/categories" 
          class="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path === '/categories' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'"
        >Categories</router-link>
        <router-link v-if="authStore.user && (authStore.user.role === 'admin' || authStore.user.role === 'site_engineer' || authStore.user.role === 'warehouse_staff')" 
          to="/transactions" 
          class="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path === '/transactions' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'"
        >Records</router-link>
        <router-link v-if="authStore.user && (authStore.user.role === 'admin' || authStore.user.role === 'site_engineer')" 
          to="/reports" 
          class="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path === '/reports' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'"
        >Reports</router-link>
        <router-link v-if="authStore.user && authStore.user.role === 'admin'" 
          to="/users" 
          class="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path === '/users' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'"
        >Users</router-link>
        <router-link v-if="authStore.user && (authStore.user.role === 'warehouse_staff' || authStore.user.role === 'admin')" 
          to="/sales-history" 
          class="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path === '/sales-history' ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'"
        >Sales</router-link>
        <button @click="logout" class="w-full mt-2 inline-flex items-center justify-center px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors">Logout</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const menuOpen = ref(false);

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
