<template>
  <div class="page-container">
    <Navbar />
    
    <div class="container mx-auto px-4 py-6 h-[calc(100vh-100px)] flex flex-col">
      <h1 class="text-3xl font-bold text-gray-800 tracking-tight mb-4">Delivery Dashboard</h1>
      
      <div class="flex-grow flex flex-col md:flex-row gap-4 h-full overflow-hidden">
        <!-- Sidebar List -->
        <div class="w-full md:w-1/3 bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
          <div class="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
             <div>
                <h2 class="font-bold text-gray-700">Assigned Deliveries</h2>
                <p class="text-xs text-gray-500">{{ deliveryOrders.length }} active orders</p>
             </div>
             <button @click="fetchOrders" class="text-blue-600 hover:text-blue-800 text-xs font-bold">
               Refresh
             </button>
          </div>
          <div class="p-2 border-b border-gray-100 bg-white">
            <div class="flex gap-2">
               <button 
                 @click="statusFilter = 'pending'"
                 class="flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors border"
                 :class="statusFilter === 'pending' ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'"
               >
                 Pending
               </button>
               <button 
                 @click="statusFilter = 'out_for_delivery'"
                 class="flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors border"
                 :class="statusFilter === 'out_for_delivery' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'"
               >
                 Out for Delivery
               </button>
               <button 
                 @click="statusFilter = 'completed'"
                 class="flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors border"
                 :class="statusFilter === 'completed' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'"
               >
                 Completed
               </button>
               <button 
                 @click="statusFilter = 'all'"
                 class="px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border"
                 :class="statusFilter === 'all' ? 'bg-gray-600 text-white border-gray-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'"
               >
                 All
               </button>
            </div>
          </div>
          <div class="flex-grow overflow-y-auto p-2 space-y-2">
            <div 
              v-for="order in deliveryOrders" 
              :key="order._id"
              @click="focusOrder(order)"
              class="p-4 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
              :class="selectedOrder?._id === order._id ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'bg-white'"
            >
              <div class="flex justify-between items-start mb-2">
                <span class="font-mono text-xs font-bold text-gray-500">#{{ order._id.slice(-6) }}</span>
                <span class="text-xs px-2 py-0.5 rounded-full uppercase font-bold" 
                  :class="{
                    'bg-yellow-100 text-yellow-700': order.status === 'pending',
                    'bg-blue-100 text-blue-700': order.status === 'out_for_delivery',
                    'bg-green-100 text-green-700': order.status === 'completed'
                  }">
                  {{ order.status.replace(/_/g, ' ') }}
                </span>
              </div>
              <p class="text-sm font-bold text-gray-800 mb-1 truncate">{{ order.deliveryAddress || 'No address provided' }}</p>
              <p class="text-xs text-gray-500 mb-2">{{ new Date(order.createdAt).toLocaleDateString() }} • {{ order.user?.email }}</p>
              
              <div class="flex gap-2 mt-2">
                <button 
                  v-if="order.status !== 'completed'"
                  @click.stop="updateStatus(order, 'completed')"
                  class="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-1.5 rounded transition-colors"
                >
                  Mark Delivered
                </button>
                <button 
                  v-if="order.status === 'pending'"
                  @click.stop="updateStatus(order, 'out_for_delivery')"
                  class="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-1.5 rounded transition-colors"
                >
                  Start Delivery
                </button>
              </div>
            </div>
            
            <div v-if="deliveryOrders.length === 0" class="text-center py-12 text-gray-400">
               <p>No active deliveries found.</p>
            </div>
          </div>
        </div>

        <!-- Map View -->
        <div class="w-full md:w-2/3 bg-gray-200 rounded-xl shadow-lg overflow-hidden relative z-0 min-h-[400px]">
           <div id="deliveryMap" class="h-full w-full"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import api from '../services/api';
import Navbar from '../components/Navbar.vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Fix Leaflet icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
L.Marker.prototype.options.icon = DefaultIcon;

const allOrders = ref([]);
const selectedOrder = ref(null);
const searchQuery = ref('');
const statusFilter = ref('active'); // active, completed, all
let map = null;
let markers = {};
let routeControl = null;

const deliveryOrders = computed(() => {
  return allOrders.value.filter(order => {
    const matchesSearch = (order.deliveryAddress || '').toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          order._id.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    // Archive logic: Hide completed orders older than 5 days unless 'all' is selected
    const isCompleted = order.status === 'completed';
    const completionDate = order.updatedAt ? new Date(order.updatedAt) : new Date(order.createdAt);
    const daysSinceCompletion = (new Date() - completionDate) / (1000 * 60 * 60 * 24);
    
    // Filter Logic
    if (statusFilter.value === 'active') {
        return matchesSearch && !isCompleted;
    } else if (statusFilter.value === 'completed') {
        return matchesSearch && isCompleted;
    } else {
        // 'all' - show everything EXCEPT archived (older than 5 days completed)
        // unless we want an explicit 'archive' view.
        // User asked: "put them in archive after 5 days" - implies hiding them from standard view.
        if (isCompleted && daysSinceCompletion > 5) return false;
        return matchesSearch;
    }
  });
});

const fetchOrders = async () => {
  try {
    const res = await api.getOrders();
    // Filter for delivery type orders only
    allOrders.value = res.data.filter(o => o.type === 'delivery' && o.status !== 'cancelled');
    
    // Ensure map container exists before initializing
    await nextTick();
    if (document.getElementById('deliveryMap')) {
        initMap();
    }
  } catch (err) {
    console.error(err);
  }
};

const initMap = () => {
  if (map) {
    map.remove(); // Reset map if re-initializing
  }

  // Default Manila
  map = L.map('deliveryMap').setView([14.5995, 120.9842], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  markers = {};

  // Add markers
  deliveryOrders.value.forEach(order => {
    if (order.location && order.location.lat && order.location.lng) {
      const marker = L.marker([order.location.lat, order.location.lng])
        .addTo(map)
        .bindPopup(`
          <div class="font-sans">
            <h3 class="font-bold">Order #${order._id.slice(-6)}</h3>
            <p class="text-sm">${order.deliveryAddress}</p>
            <p class="text-xs text-gray-500">${order.user?.email}</p>
            <span class="text-xs font-bold uppercase ${getStatusColor(order.status)}">${order.status}</span>
          </div>
        `);
      
      // Store marker reference
      markers[order._id] = marker;

      marker.on('click', () => {
        selectedOrder.value = order;
      });
    }
  });
};

const focusOrder = (order) => {
  selectedOrder.value = order;
  if (order.location && order.location.lat && order.location.lng && map) {
    map.flyTo([order.location.lat, order.location.lng], 16);
    if (markers[order._id]) {
      markers[order._id].openPopup();
    }
  }
};

const getDirections = (order) => {
  if (!order.location || !order.location.lat || !order.location.lng) {
    alert('No location pin for this order.');
    return;
  }

  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      
      // Remove existing route
      if (routeControl) {
        map.removeControl(routeControl);
        routeControl = null;
      }

      // Add new route
      routeControl = L.Routing.control({
        waypoints: [
          L.latLng(latitude, longitude),
          L.latLng(order.location.lat, order.location.lng)
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        lineOptions: {
          styles: [{ color: '#6366f1', opacity: 0.8, weight: 6 }]
        }
      }).addTo(map);

      // Focus map to include both points (handled by fitSelectedRoutes, but we can ensure)
      // map.fitBounds([
      //   [latitude, longitude],
      //   [order.location.lat, order.location.lng]
      // ], { padding: [50, 50] });

    },
    (err) => {
      console.error(err);
      alert('Unable to retrieve your location. Please allow location access.');
    }
  );
};

const updateStatus = async (order, status) => {
  try {
    await api.updateOrderStatus(order._id, status);
    order.status = status; // Optimistic update
    // Update marker popup content if needed, easier to just re-init or let reactivity handle it if we used custom markers (Vue-Leaflet)
    // For raw leaflet, re-binding popup is manual, but simple enough to ignore for now.
  } catch (err) {
    alert('Failed to update status');
  }
};

const getStatusColor = (status) => {
  if (status === 'pending') return 'text-yellow-600';
  if (status === 'out_for_delivery') return 'text-blue-600';
  if (status === 'completed') return 'text-green-600';
  return 'text-gray-600';
};

onMounted(() => {
  fetchOrders();
});
</script>