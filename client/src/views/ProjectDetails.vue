<template>
  <div class="page-container">
    <Navbar />

    <div class="container mx-auto px-6">
      <div v-if="project">
        <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <div class="flex items-center gap-3">
              <button @click="$router.push('/projects')" class="text-gray-400 hover:text-blue-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 class="text-3xl font-bold text-gray-800 tracking-tight">{{ project.name }}</h1>
            </div>
            <p class="text-gray-500 mt-1 ml-9">{{ project.location }} | Manager: {{ project.manager || 'N/A' }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span 
              class="px-3 py-1 text-sm font-bold rounded-full uppercase tracking-wide border"
              :class="{
                'bg-green-50 text-green-700 border-green-100': project.status === 'active',
                'bg-blue-50 text-blue-700 border-blue-100': project.status === 'completed',
                'bg-yellow-50 text-yellow-700 border-yellow-100': project.status === 'on-hold'
              }"
            >
              {{ project.status }}
            </span>
          </div>
        </div>

        <!-- Project Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div class="card bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
              <h3 class="text-blue-100 text-sm font-bold uppercase tracking-wider mb-1">Total Items Issued</h3>
              <p class="text-4xl font-extrabold">{{ totalItemsIssued }}</p>
           </div>
           <div class="card bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none">
              <h3 class="text-purple-100 text-sm font-bold uppercase tracking-wider mb-1">Unique Items</h3>
              <p class="text-4xl font-extrabold">{{ uniqueItemsCount }}</p>
           </div>
           <div class="card bg-gradient-to-br from-green-500 to-green-600 text-white border-none">
              <h3 class="text-green-100 text-sm font-bold uppercase tracking-wider mb-1">Last Activity</h3>
              <p class="text-xl font-bold mt-2">{{ lastActivityDate }}</p>
           </div>
        </div>

        <div class="card">
          <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
             <span class="bg-gray-100 text-gray-600 p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Transaction History
          </h2>

          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Item</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Requested By</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="t in transactions" :key="t._id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 text-sm text-gray-600">{{ new Date(t.date).toLocaleString() }}</td>
                  <td class="px-6 py-4 font-medium text-gray-800">{{ t.item?.name || 'Deleted Item' }}</td>
                  <td class="px-6 py-4 font-bold text-blue-600">{{ t.quantity }} {{ t.unit }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ t.requestedBy || 'N/A' }}</td>
                  <td class="px-6 py-4">
                    <div v-if="t.isPaid">
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Paid
                      </span>
                      <span class="text-xs text-gray-500 ml-2">OR: {{ t.orNumber }}</span>
                    </div>
                    <div v-else>
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        Unpaid
                      </span>
                    </div>
                  </td>
                </tr>
                <tr v-if="transactions.length === 0">
                  <td colspan="5" class="px-6 py-12 text-center text-gray-400 italic">
                    No transactions recorded for this project yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-else class="flex items-center justify-center h-64">
         <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';
import Navbar from '../components/Navbar.vue';

const route = useRoute();
const project = ref(null);
const transactions = ref([]);

const fetchProjectDetails = async () => {
  try {
    const [projRes, txnsRes] = await Promise.all([
      api.getProject(route.params.id),
      api.getTransactions({ project: route.params.id, type: 'out' })
    ]);
    project.value = projRes.data;
    transactions.value = txnsRes.data;
  } catch (err) {
    console.error(err);
    alert('Failed to load project details');
  }
};

const totalItemsIssued = computed(() => {
  return transactions.value.reduce((acc, t) => acc + t.quantity, 0);
});

const uniqueItemsCount = computed(() => {
  const items = new Set(transactions.value.map(t => t.item?._id));
  return items.size;
});

const lastActivityDate = computed(() => {
  if (transactions.value.length === 0) return 'No activity';
  const lastDate = new Date(transactions.value[0].date);
  return lastDate.toLocaleDateString();
});

onMounted(() => {
  fetchProjectDetails();
});
</script>
