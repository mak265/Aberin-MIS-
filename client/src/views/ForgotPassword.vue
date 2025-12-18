<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
      <p class="mb-4 text-center text-gray-600">
        Enter your email to receive a password reset OTP.
      </p>
      <form @submit.prevent="handleRequestReset">
        <div class="mb-6">
          <label class="block text-gray-700">Email</label>
          <input 
            v-model="email" 
            type="email" 
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button 
          type="submit" 
          class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Send OTP
        </button>
      </form>
      <p class="mt-4 text-center">
        <router-link to="/login" class="text-blue-500 hover:underline">Back to Login</router-link>
      </p>
      <p v-if="message" class="mt-4 text-green-500 text-center">{{ message }}</p>
      <p v-if="error" class="mt-4 text-red-500 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';

const email = ref('');
const message = ref('');
const error = ref('');
const router = useRouter();

const handleRequestReset = async () => {
  try {
    await api.forgotPassword({ email: email.value });
    message.value = 'OTP sent! Redirecting...';
    // Pass email to next page via route query or local storage
    localStorage.setItem('emailForReset', email.value);
    setTimeout(() => router.push('/reset-password'), 1500);
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to send OTP';
  }
};
</script>
