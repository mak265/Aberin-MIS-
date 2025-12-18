<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
      <p class="mb-4 text-center text-gray-600">
        Enter the OTP sent to your email (check server console for simulation).
      </p>
      <form @submit.prevent="handleVerify">
        <div class="mb-6">
          <label class="block text-gray-700">OTP Code</label>
          <input 
            v-model="otp" 
            type="text" 
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button 
          type="submit" 
          class="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition"
        >
          Verify
        </button>
      </form>
      <p v-if="error" class="mt-4 text-red-500 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const otp = ref('');
const error = ref('');
const authStore = useAuthStore();
const router = useRouter();

const handleVerify = async () => {
  try {
    await authStore.verifyOtp(otp.value);
    alert('Verification successful! Please login.');
    router.push('/login');
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Verification failed';
  }
};
</script>
