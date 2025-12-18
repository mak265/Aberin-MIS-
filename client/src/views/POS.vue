<template>
  <div class="page-container">
    <Navbar />

    <div class="container mx-auto px-6">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 tracking-tight">Point of Sale</h1>
          <p class="text-gray-500 mt-1">Process transactions efficiently</p>
        </div>
        <div class="text-right">
           <div class="text-sm text-gray-500 font-medium">Current Session</div>
           <div class="text-lg font-bold text-gray-800">{{ new Date().toLocaleDateString() }}</div>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Item Selection -->
        <div class="w-full lg:w-2/3">
          <div class="card h-full flex flex-col">
            <div class="relative mb-6">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Search items by name or SKU..." 
                class="input-field pl-10"
              />
            </div>
            
            <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2 custom-scrollbar" style="max-height: calc(100vh - 300px);">
              <div 
                v-for="item in filteredItems" 
                :key="item._id" 
                class="bg-white border border-gray-100 rounded-xl p-4 cursor-pointer hover:shadow-lg hover:border-blue-200 transition-all duration-200 flex flex-col justify-between group h-full relative"
                @click="addToCart(item)"
                :class="{'opacity-50 pointer-events-none': item.quantity <= 0}"
              >
                 <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div class="bg-blue-600 text-white rounded-full p-1 shadow-md">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                       </svg>
                    </div>
                 </div>

                <div>
                  <div class="flex items-center justify-center h-12 w-12 rounded-lg bg-gray-50 text-gray-400 mb-3 mx-auto group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                     <span class="font-bold text-xl">{{ item.name.charAt(0).toUpperCase() }}</span>
                  </div>
                  <h3 class="font-bold text-gray-800 text-center text-sm leading-tight mb-1">{{ item.name }}</h3>
                  <p class="text-gray-500 text-xs text-center line-clamp-2">{{ item.description }}</p>
                </div>
                
                <div class="mt-4 pt-3 border-t border-gray-50">
                  <div class="flex justify-between items-center text-sm">
                    <span class="font-medium text-gray-600">Stock: {{ item.quantity }}</span>
                    <span class="font-bold text-blue-600">₱{{ item.price.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="filteredItems.length === 0" class="flex-grow flex items-center justify-center text-gray-400">
               <div class="text-center">
                 <p>No items found</p>
               </div>
            </div>
          </div>
        </div>

        <!-- Cart -->
        <div class="w-full lg:w-1/3">
          <div class="card h-full flex flex-col border-t-4 border-blue-600">
            <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span class="bg-blue-100 p-2 rounded-lg text-blue-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </span>
              Current Order
            </h2>
            
            <div class="flex-grow overflow-y-auto pr-1 custom-scrollbar mb-4 space-y-3" style="max-height: 400px;">
              <div v-if="cart.length === 0" class="flex flex-col items-center justify-center h-48 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p class="text-sm font-medium">Cart is empty</p>
                <p class="text-xs">Select items to start sale</p>
              </div>
              
              <div 
                v-for="(item, index) in cart" 
                :key="index" 
                class="bg-gray-50 rounded-xl p-3 border border-gray-100 relative group transition-all hover:bg-white hover:shadow-md hover:border-blue-200"
              >
                <button @click="removeFromCart(index)" class="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
                
                <div class="mb-2 pr-6">
                  <h4 class="font-bold text-gray-800 text-sm">{{ item.name }}</h4>
                  <div class="text-xs text-gray-500 flex gap-2">
                    <span>Stock: {{ item.quantity }}</span>
                    <span>SKU: {{ item.itemCode || '-' }}</span>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2 mb-2">
                   <div>
                      <label class="text-[10px] uppercase font-bold text-gray-400 block mb-1">Qty</label>
                      <input 
                        type="number" 
                        v-model.number="item.qty" 
                        min="1" 
                        :max="item.quantity" 
                        @change="clampQty(index)" 
                        class="w-full text-sm border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                   </div>
                   <div>
                      <label class="text-[10px] uppercase font-bold text-gray-400 block mb-1">Price</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        v-model.number="item.price" 
                        min="0" 
                        @change="clampPrice(index)" 
                        class="w-full text-sm border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                   </div>
                </div>
                
                <div class="flex items-center justify-between pt-2 border-t border-gray-100">
                   <div class="flex items-center gap-1">
                      <select v-model="item.discountType" class="text-xs border border-gray-200 rounded px-1 py-0.5 bg-white">
                        <option :value="null">-</option>
                        <option value="percent">%</option>
                        <option value="fixed">₱</option>
                      </select>
                      <input 
                        v-if="item.discountType"
                        type="number" 
                        v-model.number="item.discountValue" 
                        class="w-12 text-xs border border-gray-200 rounded px-1 py-0.5"
                        placeholder="0"
                      />
                   </div>
                   <span class="font-bold text-blue-600">₱{{ lineTotal(item).toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <!-- Totals Section -->
            <div class="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
               <!-- Tx Discount -->
               <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600 font-medium">Discount</span>
                  <div class="flex items-center gap-2">
                     <select v-model="txDiscount.type" class="text-xs border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none focus:border-blue-500">
                        <option value="none">None</option>
                        <option value="percent">%</option>
                        <option value="fixed">₱</option>
                      </select>
                      <input 
                        v-if="txDiscount.type !== 'none'"
                        type="number" 
                        v-model.number="txDiscount.value" 
                        class="w-16 text-xs border border-gray-200 rounded px-2 py-1"
                        placeholder="0"
                      />
                  </div>
               </div>
               
               <div class="border-t border-gray-200 pt-3 space-y-1 text-sm">
                 <div class="flex justify-between text-gray-500">
                   <span>Subtotal</span>
                   <span>₱{{ subTotal.toFixed(2) }}</span>
                 </div>
                 <div class="flex justify-between text-red-500" v-if="txDiscountAmount > 0">
                   <span>Discount</span>
                   <span>-₱{{ txDiscountAmount.toFixed(2) }}</span>
                 </div>
                 <div class="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t border-gray-200 mt-2">
                   <span>Total Due</span>
                   <span>₱{{ totalDue.toFixed(2) }}</span>
                 </div>
               </div>
            </div>

            <!-- Payment -->
             <div class="mt-4 space-y-3">
               <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="text-[10px] uppercase font-bold text-gray-400 block mb-1">Method</label>
                    <select v-model="payment.method" class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                      <option value="cash">Cash</option>
                      <option value="gcash">GCash</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-[10px] uppercase font-bold text-gray-400 block mb-1">Amount Paid</label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₱</span>
                      <input 
                        type="number" 
                        v-model.number="payment.amount" 
                        class="w-full text-sm border border-gray-200 rounded-lg pl-6 pr-3 py-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold text-gray-800"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
               </div>
               
               <div class="flex justify-between items-center bg-green-50 px-4 py-2 rounded-lg border border-green-100 text-green-700 text-sm font-medium" v-if="change > 0">
                 <span>Change Due</span>
                 <span class="font-bold">₱{{ change.toFixed(2) }}</span>
               </div>
             </div>

            <div class="mt-6">
              <button 
                @click="processSale" 
                :disabled="!canPay || cart.length === 0 || processing"
                class="btn-primary w-full py-3.5 text-lg shadow-lg shadow-blue-500/30 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                <span v-if="processing" class="flex items-center">
                   <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
                <span v-else>Complete Sale</span>
              </button>
            </div>
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

const items = ref([]);
const cart = ref([]);
const searchQuery = ref('');
const processing = ref(false);
const txDiscount = ref({ type: 'none', value: 0 });
const payment = ref({ method: 'cash', amount: 0 });

const fetchItems = async () => {
  try {
    const response = await api.getItems();
    items.value = response.data;
  } catch (err) {
    console.error(err);
  }
};

const filteredItems = computed(() => {
  return items.value.filter(item => 
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const addToCart = (item) => {
  if (item.quantity <= 0) return;
  
  const existingItem = cart.value.find(i => i._id === item._id);
  if (existingItem) {
    if (existingItem.qty < item.quantity) {
      existingItem.qty++;
    }
  } else {
    cart.value.push({ ...item, qty: 1, price: item.price });
  }
};

const removeFromCart = (index) => {
  cart.value.splice(index, 1);
};

const lineTotal = (item) => {
  const base = Number(item.price) * Number(item.qty);
  let disc = 0;
  if (item.discountType === 'percent') {
    disc = Math.max(0, Math.min(base, base * ((Number(item.discountValue || 0)) / 100)));
  } else if (item.discountType === 'fixed') {
    disc = Math.max(0, Math.min(base, Number(item.discountValue || 0)));
  }
  return base - disc;
};

const subTotal = computed(() => cart.value.reduce((acc, item) => acc + lineTotal(item), 0));

const txDiscountAmount = computed(() => {
  const type = txDiscount.value.type;
  const val = Number(txDiscount.value.value || 0);
  const sub = subTotal.value;
  if (type === 'percent') return Math.max(0, Math.min(sub, sub * (val / 100)));
  if (type === 'fixed') return Math.max(0, Math.min(sub, val));
  return 0;
});

const totalDue = computed(() => Math.max(0, subTotal.value - txDiscountAmount.value));

const change = computed(() => {
  if (payment.value.method === 'cash') {
    return Math.max(0, Number((payment.value.amount - totalDue.value).toFixed(2)));
  }
  return 0;
});

const canPay = computed(() => {
  if (payment.value.method === 'cash') return payment.value.amount >= totalDue.value;
  return payment.value.amount >= totalDue.value; // require full payment for non-cash
});

const clampQty = (index) => {
  const item = cart.value[index];
  if (!item) return;
  if (item.qty < 1) item.qty = 1;
  if (item.qty > item.quantity) item.qty = item.quantity;
};

const clampPrice = (index) => {
  const item = cart.value[index];
  if (!item) return;
  if (item.price < 0) item.price = 0;
};

const processSale = async () => {
  if (cart.value.length === 0) return;
  
  processing.value = true;
  try {
    const saleData = {
      items: cart.value.map(item => ({
        item: item._id,
        quantity: item.qty,
        price: item.price,
        name: item.name,
        discountType: item.discountType || null,
        discountValue: Number(item.discountValue || 0)
      })),
      transactionDiscountType: txDiscount.value.type === 'none' ? null : txDiscount.value.type,
      transactionDiscountValue: Number(txDiscount.value.value || 0),
      paymentMethod: payment.value.method,
      amountPaid: Number(payment.value.amount)
    };
    
    await api.createSale(saleData);
    alert('Sale completed successfully!');
    cart.value = [];
    txDiscount.value = { type: 'none', value: 0 };
    payment.value = { method: 'cash', amount: 0 };
    fetchItems(); // Refresh inventory
  } catch (err) {
    alert(err.response?.data?.message || 'Sale failed');
  } finally {
    processing.value = false;
  }
};

onMounted(() => {
  fetchItems();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
