<template>
  <div class="page-container">
    <Navbar />

    <div class="container mx-auto px-6">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 tracking-tight">Inventory Management</h1>
          <p class="text-gray-500 mt-1">Track and manage your stock levels</p>
        </div>
        <button 
          v-if="authStore.user && (authStore.user.role === 'admin' || authStore.user.role === 'warehouse_staff')"
          @click="openModal" 
          class="btn-primary flex items-center shadow-lg shadow-blue-500/30"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Item
        </button>
      </div>

      <!-- Search & Filter Card -->
      <div class="card mb-8">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-grow relative">
             <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search items by name, SKU, or description..." 
              class="input-field pl-10"
            />
          </div>
          
          <div class="w-full md:w-64">
            <select 
              v-model="selectedCategory" 
              class="input-field appearance-none cursor-pointer"
              style="background-image: url(&quot;data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e&quot;); background-position: right 0.5rem center; background-repeat: no-repeat; background-size: 1.5em 1.5em; padding-right: 2.5rem;"
            >
              <option value="">All Categories</option>
              <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
            </select>
          </div>

          <button 
            @click="exportPDF" 
            class="btn-secondary flex items-center justify-center whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      <div class="card overflow-hidden p-0 border-0 shadow-lg">
        <ItemList :items="filteredItems" @edit-item="editItem" @delete-item="deleteItem" />
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
      <div class="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden transform transition-all scale-100">
        <div class="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 class="text-xl font-bold text-gray-800">{{ isEditing ? 'Edit Item' : 'Add New Item' }}</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <ItemForm 
            :item="selectedItem" 
            :isEditing="isEditing" 
            @submit-item="handleItemSubmit" 
            @cancel="closeModal"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api';
import ItemList from '../components/ItemList.vue';
import ItemForm from '../components/ItemForm.vue';
import Navbar from '../components/Navbar.vue';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const items = ref([]);
const categories = ref([]);
const showModal = ref(false);
const isEditing = ref(false);
const selectedItem = ref(null);
const searchQuery = ref('');
const selectedCategory = ref('');

const fetchItems = async () => {
  try {
    const response = await api.getItems();
    items.value = response.data;
  } catch (err) {
    console.error(err);
  }
};

const fetchCategories = async () => {
  try {
    const response = await api.getCategories();
    categories.value = response.data;
  } catch (err) {
    console.error(err);
  }
};

const filteredItems = computed(() => {
  return items.value.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          item.description?.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    const itemCatId = typeof item.category === 'object' && item.category ? item.category._id : item.category;
    const matchesCategory = !selectedCategory.value || itemCatId === selectedCategory.value;

    return matchesSearch && matchesCategory;
  });
});

const openModal = () => {
  selectedItem.value = null;
  isEditing.value = false;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const editItem = (item) => {
  selectedItem.value = { ...item };
  isEditing.value = true;
  showModal.value = true;
};

const deleteItem = async (id) => {
  if (confirm('Are you sure you want to delete this item?')) {
    try {
      await api.deleteItem(id);
      fetchItems();
    } catch (err) {
      alert('Failed to delete item');
    }
  }
};

const handleItemSubmit = async (itemData) => {
  try {
    if (isEditing.value) {
      await api.updateItem(selectedItem.value._id, itemData);
    } else {
      await api.createItem(itemData);
    }
    closeModal();
    fetchItems();
  } catch (err) {
    console.error(err);
    alert('Failed to save item: ' + (err.response?.data?.message || err.message));
  }
};

const exportPDF = () => {
  try {
    const doc = new jsPDF();
    doc.text("Inventory Report", 14, 15);
    
    const tableColumn = ["Name", "Quantity", "Unit", "Price", "Description"];
    const tableRows = filteredItems.value.map(item => [
      item.name,
      item.quantity,
      item.unit || 'piece',
      `$${item.price.toFixed(2)}`,
      item.description || ''
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("inventory_report.pdf");
  } catch (error) {
    console.error("PDF Export Error:", error);
    alert("Failed to export PDF. Please check console for details.");
  }
};

onMounted(() => {
  fetchItems();
  fetchCategories();
});
</script>
