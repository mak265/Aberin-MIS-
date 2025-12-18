<template>
  <div class="overflow-x-auto">
    <table class="w-full" v-if="items.length > 0">
      <thead class="bg-gray-50 border-b border-gray-100">
        <tr>
          <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Item Details</th>
          <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
          <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
          <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
          <th class="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100 bg-white">
        <tr v-for="item in items" :key="item._id" class="group hover:bg-blue-50/50 transition-colors duration-150">
          <td class="px-6 py-4">
            <div class="flex items-center">
              <div class="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3 font-bold text-lg">
                {{ item.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <div class="font-bold text-gray-900">{{ item.name }}</div>
                <div class="text-xs text-gray-500" v-if="item.itemCode">SKU: {{ item.itemCode }}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
              :class="item.quantity > (item.minStock || 10) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
              {{ item.quantity }} {{ item.unit || 'piece' }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap font-bold text-gray-700">
            ${{ item.price.toFixed(2) }}
          </td>
          <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
            {{ item.description || '-' }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button 
              @click="$emit('edit-item', item)"
              class="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors mr-2"
            >
              Edit
            </button>
            <button 
              @click="$emit('delete-item', item._id)"
              class="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-else class="p-16 text-center">
      <div class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900">No items found</h3>
      <p class="mt-1 text-gray-500">Get started by creating a new inventory item.</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
});
</script>
