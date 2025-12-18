<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Reset Password</h2>
      <form @submit.prevent="handleReset">
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input 
            v-model="email" 
            type="email" 
            class="w-full px-3 py-2 border rounded bg-gray-100"
            readonly
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">OTP</label>
          <input 
            v-model="otp" 
            type="text" 
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700">New Password</label>
          <input 
            v-model="newPassword" 
            type="password" 
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minlength="6"
          />
        </div>
        <button 
          type="submit" 
          class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
        >
          Reset Password
        </button>
      </form>
      <p v-if="error" class="mt-4 text-red-500 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';

const email = ref(localStorage.getItem('emailForReset') || '');
const otp = ref('');
const newPassword = ref('');
const error = ref('');
const router = useRouter();

const handleReset = async () => {
  try {
    await api.resetPassword({ 
      email: email.value, 
      otp: otp.value, 
      newPassword: newPassword.value 
    });
    alert('Password reset successful! Please login.');
    localStorage.removeItem('emailForReset');
    router.push('/login');
  } catch (err) {
    error.value = err.response?.data?.message || 'Reset failed';
  }
};
</script>
