<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <div class="container mx-auto px-6 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">User Management</h1>
      
      <!-- Create User -->
      <div class="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 class="text-xl font-semibold mb-4">Create New User</h2>
        <form @submit.prevent="createNewUser" class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="newUser.email" type="email" class="w-full px-3 py-2 border rounded" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input v-model="newUser.password" type="password" class="w-full px-3 py-2 border rounded" required minlength="6" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select v-model="newUser.role" class="w-full px-3 py-2 border rounded">
              <option value="warehouse_staff">Warehouse Staff</option>
              <option value="site_engineer">Site Engineer</option>
              <option value="admin">Admin</option>
              <option value="client">Client (Suki)</option>
            </select>
          </div>
          <div>
            <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create</button>
          </div>
        </form>
        <p v-if="createError" class="text-red-600 mt-2">{{ createError }}</p>
        <p v-if="createSuccess" class="text-green-600 mt-2">{{ createSuccess }}</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <div v-if="loading" class="text-center py-4 text-gray-500">Loading users...</div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead class="bg-gray-100">
              <tr>
                <th class="py-3 px-4 text-left font-semibold text-gray-700">Email</th>
                <th class="py-3 px-4 text-left font-semibold text-gray-700">Role</th>
                <th class="py-3 px-4 text-left font-semibold text-gray-700">Created At</th>
                <th class="py-3 px-4 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="user in users" :key="user._id" class="hover:bg-gray-50">
                <td class="py-3 px-4">{{ user.email }}</td>
                <td class="py-3 px-4">
                  <select 
                    v-model="user.role" 
                    @change="updateRole(user)"
                    class="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="{
                      'bg-blue-100 text-blue-800': user.role === 'admin',
                      'bg-green-100 text-green-800': user.role === 'warehouse_staff',
                      'bg-purple-100 text-purple-800': user.role === 'site_engineer',
                      'bg-orange-100 text-orange-800': user.role === 'client'
                    }"
                  >
                    <option value="admin">Admin</option>
                    <option value="warehouse_staff">Warehouse Staff</option>
                    <option value="site_engineer">Site Engineer</option>
                    <option value="client">Client (Suki)</option>
                  </select>
                </td>
                <td class="py-3 px-4 text-gray-600">{{ new Date(user.createdAt).toLocaleDateString() }}</td>
                <td class="py-3 px-4">
                  <button 
                    @click="deleteUser(user)" 
                    class="text-red-500 hover:text-red-700 transition"
                    title="Delete User"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-if="users.length === 0" class="text-center py-4 text-gray-500">No users found.</p>
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

const users = ref([]);
const loading = ref(true);
const authStore = useAuthStore();
const newUser = ref({ email: '', password: '', role: 'warehouse_staff' });
const createError = ref('');
const createSuccess = ref('');

const fetchUsers = async () => {
  try {
    const response = await api.getUsers();
    users.value = response.data;
  } catch (err) {
    console.error('Failed to fetch users:', err);
    alert('Failed to fetch users');
  } finally {
    loading.value = false;
  }
};

const updateRole = async (user) => {
  try {
    await api.updateUserRole(user._id, user.role);
    alert(`Role updated for ${user.email}`);
  } catch (err) {
    console.error('Failed to update role:', err);
    alert('Failed to update role: ' + (err.response?.data?.message || err.message));
    // Revert change if failed (optional, would require tracking original state)
    fetchUsers(); 
  }
};

const deleteUser = async (user) => {
  if (confirm(`Are you sure you want to delete ${user.email}? This action cannot be undone.`)) {
    try {
      await api.deleteUser(user._id);
      users.value = users.value.filter(u => u._id !== user._id);
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert('Failed to delete user: ' + (err.response?.data?.message || err.message));
    }
  }
};

const createNewUser = async () => {
  createError.value = '';
  createSuccess.value = '';
  try {
    await api.createUser(newUser.value);
    createSuccess.value = `User created: ${newUser.value.email}`;
    newUser.value = { email: '', password: '', role: 'warehouse_staff' };
    await fetchUsers();
  } catch (err) {
    createError.value = err.response?.data?.message || err.message || 'Failed to create user';
  }
};

onMounted(() => {
  fetchUsers();
});
</script>
