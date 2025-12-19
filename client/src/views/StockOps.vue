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
        <div class="card relative overflow-hidden group h-fit">
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

        <!-- Stock Out (Refactored) -->
        <div class="card relative overflow-hidden group border-t-4 border-blue-500 lg:col-span-2">
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
            Stock Out / Delivery
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <!-- Left: Add Items -->
            <div class="space-y-4">
               <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h3 class="font-bold text-gray-700 mb-3 text-sm">Add Items to List</h3>
                  <div class="space-y-3">
                     <div>
                       <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Item</label>
                       <select v-model="tempItem.id" class="input-field">
                         <option value="">Select Item</option>
                         <option v-for="i in items" :key="i._id" :value="i._id">{{ i.name }} (Stock: {{ i.quantity }})</option>
                       </select>
                     </div>
                     <div>
                       <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Quantity</label>
                       <div class="flex gap-2">
                          <input type="number" v-model.number="tempItem.qty" min="1" class="input-field" placeholder="0" />
                          <button @click="addToOutCart" class="btn-primary px-4 py-2 shrink-0 bg-blue-600 hover:bg-blue-700">Add</button>
                       </div>
                     </div>
                  </div>
               </div>

               <!-- Cart List -->
               <div class="border border-gray-200 rounded-xl overflow-hidden">
                  <table class="w-full text-sm text-left">
                     <thead class="bg-gray-100 text-gray-600 font-bold">
                        <tr>
                           <th class="p-2">Item</th>
                           <th class="p-2 text-center">Qty</th>
                           <th class="p-2 w-8"></th>
                        </tr>
                     </thead>
                     <tbody class="divide-y divide-gray-100">
                        <tr v-for="(item, idx) in outCart" :key="idx" class="bg-white">
                           <td class="p-2 font-medium">{{ item.name }}</td>
                           <td class="p-2 text-center">{{ item.qty }}</td>
                           <td class="p-2 text-center">
                              <button @click="removeFromOutCart(idx)" class="text-red-500 hover:text-red-700">
                                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                   <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                 </svg>
                              </button>
                           </td>
                        </tr>
                        <tr v-if="outCart.length === 0">
                           <td colspan="3" class="p-4 text-center text-gray-400 italic">No items selected</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>

            <!-- Right: Details -->
            <div class="space-y-4">
               <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Project (Optional)</label>
                  <select v-model="outForm.projectId" class="input-field" @change="onProjectSelect">
                    <option value="">Select Project</option>
                    <option v-for="p in projects" :key="p._id" :value="p._id">{{ p.name }}</option>
                  </select>
               </div>

               <div class="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <div class="flex items-center justify-between mb-3">
                     <span class="font-bold text-blue-800 text-sm">For Delivery?</span>
                     <label class="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" v-model="outForm.isDelivery" class="sr-only peer">
                       <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                     </label>
                  </div>
                  
                  <div v-if="outForm.isDelivery" class="space-y-3 animate-fade-in">
                     <div>
                        <label class="block text-xs font-bold text-blue-600 uppercase mb-1">Delivery Address</label>
                        <input v-model="outForm.address" class="input-field" placeholder="Enter full address" />
                     </div>
                     <p v-if="outForm.projectId && outForm.coordinates" class="text-xs text-green-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        Map coordinates ready from Project
                     </p>
                     <p v-else class="text-xs text-orange-500">
                        * No project coordinates. Driver will rely on address text.
                     </p>
                  </div>
               </div>

               <div>
                 <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Requested By</label>
                 <input v-model="outForm.requestedBy" class="input-field" placeholder="Name" />
               </div>

               <button @click="submitOut" :disabled="outCart.length === 0" class="btn-primary w-full shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed">
                 Process Stock Out
               </button>
            </div>
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
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const items = ref([]);
const projects = ref([]);

const inForm = ref({ itemId: '', quantity: '', supplier: '' });

// Out Form State
const outCart = ref([]);
const tempItem = ref({ id: '', qty: '' });
const outForm = ref({ 
    projectId: '', 
    requestedBy: '', 
    isDelivery: false, 
    address: '',
    coordinates: null 
});

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

const addToOutCart = () => {
    if(!tempItem.value.id || tempItem.value.qty <= 0) return;
    const item = items.value.find(i => i._id === tempItem.value.id);
    if(!item) return;
    
    // Check stock
    if(item.quantity < tempItem.value.qty) {
        return alert(`Insufficient stock! Available: ${item.quantity}`);
    }

    outCart.value.push({
        id: item._id,
        name: item.name,
        qty: tempItem.value.qty
    });
    tempItem.value = { id: '', qty: '' };
};

const removeFromOutCart = (idx) => {
    outCart.value.splice(idx, 1);
};

const onProjectSelect = () => {
    const proj = projects.value.find(p => p._id === outForm.value.projectId);
    if(proj) {
        outForm.value.address = proj.location;
        outForm.value.coordinates = proj.coordinates;
    } else {
        outForm.value.address = '';
        outForm.value.coordinates = null;
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
  if (outCart.value.length === 0) return;
  
  try {
    // We now use createOrder for everything to unify "Stock Out" and "Delivery"
    // If not delivery, type is 'pickup' (or we can define 'internal')
    
    const orderData = {
        items: outCart.value.map(i => ({ item: i.id, quantity: i.qty })),
        type: outForm.value.isDelivery ? 'delivery' : 'pickup',
        deliveryAddress: outForm.value.address || 'N/A',
        location: outForm.value.coordinates,
        notes: `Requested by: ${outForm.value.requestedBy} | Project: ${outForm.value.projectId || 'None'}`,
        projectId: outForm.value.projectId || undefined // Pass project ID for ledger
    };

    await api.createOrder(orderData);
    
    alert(outForm.value.isDelivery ? 'Delivery Order Created & Stock Deducted!' : 'Stock Out Recorded Successfully!');
    
    // Reset
    outCart.value = [];
    outForm.value = { projectId: '', requestedBy: '', isDelivery: false, address: '', coordinates: null };
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
