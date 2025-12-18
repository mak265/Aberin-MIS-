<template>
  <div class="page-container">
    <Navbar />

    <div class="container mx-auto px-6">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 tracking-tight">Stock Operations</h1>
          <p class="text-gray-500 mt-1">Manage inventory movements</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Stock In -->
        <div class="card relative overflow-hidden group">
           <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
           </div>
          <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center relative z-10">
            <span class="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </span>
            Stock In
          </h2>
          <form @submit.prevent="submitIn" class="space-y-4 relative z-10">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Item</label>
              <select v-model="inForm.itemId" class="input-field">
                <option value="">Select Item</option>
                <option v-for="i in items" :key="i._id" :value="i._id">{{ i.name }} ({{ i.quantity }} {{ i.unit }})</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Quantity</label>
              <input type="number" v-model.number="inForm.quantity" min="1" class="input-field" placeholder="0" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Supplier</label>
              <input v-model="inForm.supplier" class="input-field" placeholder="Supplier Name" />
            </div>
            <button class="btn-primary w-full shadow-green-500/30 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
              Add Stock
            </button>
          </form>
        </div>

        <!-- Stock Out -->
        <div class="card relative overflow-hidden group border-t-4 border-blue-500">
           <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
           </div>
          <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center relative z-10">
            <span class="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </span>
            Stock Out
          </h2>
          <form @submit.prevent="submitOut" class="space-y-4 relative z-10">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Item</label>
              <select v-model="outForm.itemId" class="input-field">
                <option value="">Select Item</option>
                <option v-for="i in items" :key="i._id" :value="i._id">{{ i.name }} ({{ i.quantity }} {{ i.unit }})</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
               <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Quantity</label>
                  <input type="number" v-model.number="outForm.quantity" min="1" class="input-field" placeholder="0" />
               </div>
               <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Project</label>
                  <select v-model="outForm.projectId" class="input-field">
                    <option value="">Select Project</option>
                    <option v-for="p in projects" :key="p._id" :value="p._id">{{ p.name }}</option>
                  </select>
               </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Requested By</label>
                <input v-model="outForm.requestedBy" class="input-field" placeholder="Name" />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Approved By</label>
                <input v-model="outForm.approvedBy" class="input-field" placeholder="Name" />
              </div>
            </div>

            <!-- Payment Fields -->
            <div class="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-2">
               <div class="flex items-center justify-between mb-3">
                  <label class="text-sm font-bold text-blue-800">Payment Status</label>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="outForm.isPaid" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span class="ml-2 text-xs font-medium text-gray-600">{{ outForm.isPaid ? 'Paid' : 'Unpaid' }}</span>
                  </label>
               </div>
               
               <div v-if="outForm.isPaid" class="transition-all duration-300">
                  <label class="block text-xs font-bold text-blue-600 uppercase mb-1">OR Number</label>
                  <input v-model="outForm.orNumber" class="input-field bg-white border-blue-200 focus:border-blue-500" placeholder="Enter Receipt #" />
               </div>
            </div>

            <button class="btn-primary w-full shadow-blue-500/30">
              Issue Stock
            </button>
          </form>
        </div>

        <!-- Adjustment -->
        <div class="card relative overflow-hidden group">
           <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
           </div>
          <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center relative z-10">
            <span class="bg-yellow-100 text-yellow-600 p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </span>
            Adjustment
          </h2>
          <form @submit.prevent="submitAdjust" class="space-y-4 relative z-10">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Item</label>
              <select v-model="adjForm.itemId" class="input-field">
                <option value="">Select Item</option>
                <option v-for="i in items" :key="i._id" :value="i._id">{{ i.name }} ({{ i.quantity }} {{ i.unit }})</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">New Quantity</label>
              <input type="number" v-model.number="adjForm.newQuantity" min="0" class="input-field" placeholder="0" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Reason</label>
              <input v-model="adjForm.reason" class="input-field" placeholder="Why are you adjusting?" />
            </div>
            <button class="btn-primary w-full shadow-yellow-500/30 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700">
              Update Stock
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import Navbar from '../components/Navbar.vue';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const items = ref([]);
const projects = ref([]);

const inForm = ref({ itemId: '', quantity: '', supplier: '' });
const outForm = ref({ itemId: '', quantity: '', projectId: '', requestedBy: '', approvedBy: '', isPaid: false, orNumber: '' });
const adjForm = ref({ itemId: '', newQuantity: '', reason: '' });

const fetch = async () => {
  try {
    const [itemsRes, projectsRes] = await Promise.all([api.getItems(), api.getProjects()]);
    items.value = itemsRes.data;
    projects.value = projectsRes.data;
  } catch (err) {
    console.error(err);
  }
};

const submitIn = async () => {
  if (!inForm.value.itemId || inForm.value.quantity <= 0) return alert('Invalid input');
  try {
    await api.stockIn(inForm.value);
    alert('Stock In recorded');
    inForm.value = { itemId: '', quantity: '', supplier: '' };
    fetch();
  } catch (err) {
    alert(err.response?.data?.message || 'Failed');
  }
};

const submitOut = async () => {
  if (!outForm.value.itemId || outForm.value.quantity <= 0 || !outForm.value.projectId) return alert('Invalid input');
  try {
    await api.stockOut(outForm.value);
    alert('Stock Out recorded');
    outForm.value = { itemId: '', quantity: '', projectId: '', requestedBy: '', approvedBy: '', isPaid: false, orNumber: '' };
    fetch();
  } catch (err) {
    alert(err.response?.data?.message || 'Failed');
  }
};

const submitAdjust = async () => {
  if (!adjForm.value.itemId || adjForm.value.newQuantity < 0) return alert('Invalid input');
  try {
    await api.adjustStock(adjForm.value);
    alert('Adjustment recorded');
    adjForm.value = { itemId: '', newQuantity: '', reason: '' };
    fetch();
  } catch (err) {
    alert(err.response?.data?.message || 'Failed');
  }
};

onMounted(fetch);
</script>
