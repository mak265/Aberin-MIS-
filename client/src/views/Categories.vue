<template>
  <div class="page-container">
    <Navbar />

    <div class="container mx-auto px-6">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 tracking-tight">Categories</h1>
          <p class="text-gray-500 mt-1">Organize your inventory items</p>
        </div>
        
        <div class="flex gap-2 w-full md:w-auto">
          <input 
            v-model="newCategoryName" 
            placeholder="New Category Name" 
            class="input-field"
            @keyup.enter="addCategory"
          />
          <button 
            @click="addCategory" 
            class="btn-primary flex items-center shadow-lg shadow-blue-500/30 whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        </div>
      </div>

      <div class="card p-0 overflow-hidden shadow-lg border-0">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr v-for="category in categories" :key="category._id" class="hover:bg-blue-50/30 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 font-bold text-sm">
                      {{ category.name.charAt(0).toUpperCase() }}
                    </div>
                    <span class="font-medium text-gray-800">{{ category.name }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-right whitespace-nowrap">
                  <button 
                    @click="deleteCategory(category._id)" 
                    class="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
              <tr v-if="categories.length === 0">
                <td colspan="2" class="px-6 py-12 text-center text-gray-400">
                  <div class="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <p>No categories found. Create one to get started.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import Navbar from '../components/Navbar.vue';

const categories = ref([]);
const newCategoryName = ref('');

const fetchCategories = async () => {
  try {
    const response = await api.getCategories();
    categories.value = response.data;
  } catch (err) {
    console.error(err);
  }
};

const addCategory = async () => {
  if (!newCategoryName.value.trim()) return;
  try {
    await api.createCategory({ name: newCategoryName.value });
    newCategoryName.value = '';
    fetchCategories();
  } catch (err) {
    alert('Failed to create category');
  }
};

const deleteCategory = async (id) => {
  if (confirm('Are you sure you want to delete this category?')) {
    try {
      await api.deleteCategory(id);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  }
};

onMounted(() => {
  fetchCategories();
});
</script>
