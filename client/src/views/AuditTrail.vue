<template>
  <div class="page-container">
    <Navbar />

    <div class="container mx-auto px-6">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 tracking-tight">Audit Trail</h1>
          <p class="text-gray-500 mt-1">Monitor system activities and user actions</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="card mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Start Date</label>
            <input type="date" v-model="filters.startDate" class="input-field" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">End Date</label>
            <input type="date" v-model="filters.endDate" class="input-field" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Action Type</label>
            <select v-model="filters.action" class="input-field">
              <option value="">All Actions</option>
              <option value="login">Login</option>
              <option value="register">User Registration</option>
              <option value="create_item">Create Item</option>
              <option value="update_item">Update Item</option>
              <option value="delete_item">Delete Item</option>
              <option value="stock_in">Stock In</option>
              <option value="stock_out">Stock Out</option>
              <option value="create_order">Create Order</option>
              <option value="order_update">Update Order</option>
            </select>
          </div>
          <div>
            <button 
              @click="fetchLogs" 
              class="btn-primary w-full flex items-center justify-center py-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Filter Logs
            </button>
          </div>
        </div>
      </div>

      <!-- Logs Table -->
      <div class="card p-0 overflow-hidden shadow-lg border-0">
        <div v-if="loading" class="flex flex-col items-center justify-center h-64 text-gray-500">
          <svg class="animate-spin h-10 w-10 text-blue-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading audit trail...
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-gray-50 border-b border-gray-100 uppercase tracking-wider text-xs font-bold text-gray-500">
              <tr>
                <th class="px-6 py-4">Timestamp</th>
                <th class="px-6 py-4">User</th>
                <th class="px-6 py-4">Role</th>
                <th class="px-6 py-4">Action</th>
                <th class="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="log in logs" :key="log._id" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4 text-gray-500 font-mono text-xs">
                  {{ new Date(log.timestamp).toLocaleString() }}
                </td>
                <td class="px-6 py-4 font-medium text-gray-900">
                  {{ log.user ? log.user.email : 'System/Deleted User' }}
                </td>
                <td class="px-6 py-4">
                  <span v-if="log.user" class="px-2 py-1 rounded text-xs font-bold uppercase"
                    :class="{
                      'bg-blue-100 text-blue-700': log.user.role === 'admin',
                      'bg-purple-100 text-purple-700': log.user.role === 'warehouse_staff',
                      'bg-orange-100 text-orange-700': log.user.role === 'site_engineer',
                      'bg-emerald-100 text-emerald-700': log.user.role === 'client'
                    }">
                    {{ log.user.role }}
                  </span>
                  <span v-else class="text-gray-400 italic">Unknown</span>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                    {{ log.action }}
                  </span>
                </td>
                <td class="px-6 py-4 text-gray-600 max-w-xs truncate" :title="log.details">
                  {{ log.details }}
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="logs.length === 0" class="text-center py-12 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.586l5.414 5.414a1 1 0 01.586 1.414V19a2 2 0 01-2 2z" />
            </svg>
            <p>No activity logs found.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import Navbar from '../components/Navbar.vue';

const logs = ref([]);
const loading = ref(false);
const filters = ref({
  startDate: '',
  endDate: '',
  action: ''
});

const fetchLogs = async () => {
  loading.value = true;
  try {
    const res = await api.getActivityLogs(filters.value);
    logs.value = res.data;
  } catch (err) {
    console.error(err);
    alert('Failed to fetch activity logs');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchLogs();
});
</script>