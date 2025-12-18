<template>
  <div class="page-container">
    <Navbar />

    <div class="container mx-auto px-6">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 tracking-tight">Order Materials</h1>
          <p class="text-gray-500 mt-1">Browse and request items for your project</p>
        </div>
        <button 
          @click="showCart = true" 
          class="relative btn-primary flex items-center shadow-lg shadow-blue-500/30"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Cart
          <span v-if="cart.length > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-white">
            {{ cartTotalItems }}
          </span>
        </button>
      </div>

      <!-- Item Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="item in items" :key="item._id" class="card p-4 flex flex-col h-full group">
          <div class="h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div class="flex-grow">
             <div class="flex justify-between items-start">
               <h3 class="text-lg font-bold text-gray-800 line-clamp-2">{{ item.name }}</h3>
               <span class="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded">{{ item.unit }}</span>
             </div>
             <p class="text-sm text-gray-500 mt-1 mb-2">Code: {{ item.itemCode || 'N/A' }}</p>
             <div class="flex justify-between items-center mt-2">
               <span class="text-lg font-bold text-blue-600">Available: {{ item.quantity }}</span>
             </div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-100">
             <div class="flex gap-2">
               <input 
                 type="number" 
                 v-model.number="item.orderQty" 
                 min="1" 
                 :max="item.quantity"
                 class="input-field w-20 text-center py-1"
                 placeholder="Qty"
               />
               <button 
                 @click="addToCart(item)" 
                 :disabled="!item.orderQty || item.orderQty <= 0 || item.orderQty > item.quantity"
                 class="btn-primary flex-grow py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 Add
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cart Modal -->
    <div v-if="showCart" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex justify-end z-50">
      <div class="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-in-right">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 class="text-xl font-bold text-gray-800">Your Cart</h2>
          <button @click="showCart = false" class="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex-grow overflow-y-auto p-6 space-y-4">
          <div v-if="cart.length === 0" class="text-center py-12 text-gray-400">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
             </svg>
             <p>Your cart is empty.</p>
          </div>
          <div v-for="(item, index) in cart" :key="index" class="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
             <div>
               <h4 class="font-bold text-gray-800">{{ item.name }}</h4>
               <p class="text-sm text-gray-500">{{ item.quantity }} {{ item.unit }}</p>
             </div>
             <button @click="removeFromCart(index)" class="text-red-500 hover:text-red-700 p-1">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
               </svg>
             </button>
          </div>
        </div>

        <div class="p-6 border-t border-gray-100 bg-gray-50">
          <form @submit.prevent="placeOrder" class="space-y-4">
            <div>
               <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Order Type</label>
               <div class="grid grid-cols-2 gap-4">
                 <label class="cursor-pointer">
                   <input type="radio" v-model="orderType" value="pickup" class="sr-only peer" />
                   <div class="text-center p-3 rounded-lg border-2 border-gray-200 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all">
                     <span class="block text-sm font-bold">Pickup</span>
                   </div>
                 </label>
                 <label class="cursor-pointer">
                   <input type="radio" v-model="orderType" value="delivery" class="sr-only peer" />
                   <div class="text-center p-3 rounded-lg border-2 border-gray-200 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all">
                     <span class="block text-sm font-bold">Delivery</span>
                   </div>
                 </label>
               </div>
            </div>

            <div v-if="orderType === 'delivery'" class="animate-fade-in">
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Delivery Address</label>
              <textarea v-model="deliveryAddress" required class="input-field min-h-[80px]" placeholder="Enter complete address"></textarea>
            </div>

            <div>
               <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Notes</label>
               <input v-model="notes" class="input-field" placeholder="Any special instructions?" />
            </div>

            <button 
              type="submit" 
              :disabled="cart.length === 0 || (orderType === 'delivery' && !deliveryAddress)"
              class="btn-primary w-full py-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import Navbar from '../components/Navbar.vue';

const router = useRouter();
const items = ref([]);
const cart = ref([]);
const showCart = ref(false);
const orderType = ref('pickup');
const deliveryAddress = ref('');
const notes = ref('');

const fetchItems = async () => {
  try {
    const response = await api.getItems();
    // Initialize orderQty for each item
    items.value = response.data.map(i => ({ ...i, orderQty: '' }));
  } catch (err) {
    console.error(err);
  }
};

const addToCart = (item) => {
  const existing = cart.value.find(c => c.item === item._id);
  if (existing) {
    existing.quantity += item.orderQty;
  } else {
    cart.value.push({
      item: item._id,
      name: item.name,
      unit: item.unit,
      quantity: item.orderQty
    });
  }
  item.orderQty = ''; // Reset input
  // Optional: Feedback toast
};

const removeFromCart = (index) => {
  cart.value.splice(index, 1);
};

const cartTotalItems = computed(() => {
  return cart.value.reduce((acc, item) => acc + item.quantity, 0);
});

const placeOrder = async () => {
  try {
    const orderData = {
      items: cart.value.map(c => ({ item: c.item, quantity: c.quantity })),
      type: orderType.value,
      deliveryAddress: orderType.value === 'delivery' ? deliveryAddress.value : undefined,
      notes: notes.value
    };

    await api.createOrder(orderData);
    alert('Order placed successfully!');
    cart.value = [];
    showCart.value = false;
    router.push('/my-orders');
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to place order');
  }
};

onMounted(() => {
  fetchItems();
});
</script>

<style scoped>
.animate-slide-in-right {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
</style>
