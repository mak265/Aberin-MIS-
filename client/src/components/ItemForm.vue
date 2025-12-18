<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h3 class="text-xl font-semibold mb-4">{{ isEditing ? 'Edit Item' : 'Add New Item' }}</h3>
    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2">Name</label>
        <input 
          v-model="form.name" 
          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required 
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2">Category</label>
        <select 
          v-model="form.category" 
          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">None</option>
          <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
        </select>
      </div>
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-gray-700 font-bold mb-2">Quantity</label>
          <input 
            type="number" 
            v-model.number="form.quantity" 
            min="0"
            :class="['w-full px-3 py-2 border rounded', isEditing ? 'bg-gray-100' : 'focus:outline-none focus:ring-2 focus:ring-blue-500']"
            :disabled="isEditing"
          />
        </div>
        <div>
          <label class="block text-gray-700 font-bold mb-2">Unit</label>
          <select 
            v-model="form.unit" 
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="piece">Piece</option>
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="lb">lb</option>
            <option value="oz">oz</option>
            <option value="l">l</option>
            <option value="ml">ml</option>
            <option value="box">Box</option>
            <option value="pack">Pack</option>
          </select>
        </div>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2">Price</label>
        <input 
          type="number" 
          step="0.01" 
          v-model.number="form.price" 
          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required 
          min="0"
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 font-bold mb-2">Description</label>
        <textarea 
          v-model="form.description"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
        ></textarea>
      </div>
      <div class="flex justify-end space-x-3">
        <button 
          type="button" 
          @click="$emit('cancel')"
          class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {{ isEditing ? 'Update' : 'Create' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, onMounted } from 'vue';
import api from '../services/api';

const props = defineProps({
  item: {
    type: Object,
    default: null
  },
  isEditing: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit-item', 'cancel']);

const categories = ref([]);
const form = ref({
  itemCode: '',
  name: '',
  category: '',
  quantity: 0,
  unit: 'piece',
  price: 0,
  minStock: 10,
  description: ''
});

onMounted(async () => {
  try {
    const response = await api.getCategories();
    categories.value = response.data;
  } catch (err) {
    console.error(err);
  }
});

// Initialize form when prop changes or mounts
watch(() => props.item, (newItem) => {
  if (newItem) {
    form.value = { ...newItem };
    // Handle category if it's an object (populated) or string (ID)
    if (form.value.category && typeof form.value.category === 'object') {
      form.value.category = form.value.category._id;
    }
    if (!form.value.unit) form.value.unit = 'piece';
    if (!form.value.minStock) form.value.minStock = 10;
  } else {
    resetForm();
  }
}, { immediate: true });

function resetForm() {
  form.value = {
    itemCode: '',
    name: '',
    category: '',
    quantity: 0,
    unit: 'piece',
    price: 0,
    minStock: 10,
    description: ''
  };
}

const submitForm = () => {
  const payload = { ...form.value };
  if (!payload.category) delete payload.category;
  emit('submit-item', payload);
};
</script>
