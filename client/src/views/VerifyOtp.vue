<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Verify & Set Password</h2>
      <p class="mb-6 text-center text-gray-600 text-sm">
        Enter your email, the OTP sent to you, and set your new password.
      </p>
      <form @submit.prevent="handleVerify">
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2">Email</label>
          <input 
            v-model="email" 
            type="email" 
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="user@example.com"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2">OTP Code</label>
          <input 
            v-model="otp" 
            type="text" 
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest font-mono text-xl"
            required
            maxlength="6"
            placeholder="XXXXXX"
          />
          <div class="text-right mt-1">
             <button type="button" @click="resendOtp" :disabled="resendLoading" class="text-xs text-blue-600 font-bold hover:underline disabled:opacity-50">
                {{ resendLoading ? 'Sending...' : 'Resend OTP' }}
             </button>
          </div>
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2">New Password</label>
          <input 
            v-model="newPassword" 
            type="password" 
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minlength="6"
            placeholder="••••••••"
          />
        </div>
        
        <div class="mb-6">
          <label class="block text-gray-700 font-bold mb-2">Confirm Password</label>
          <input 
            v-model="confirmPassword" 
            type="password" 
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minlength="6"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-bold"
        >
          Activate Account
        </button>
        <div class="mt-4 text-center">
             <router-link to="/login" class="text-sm text-blue-600 hover:underline">Back to Login</router-link>
        </div>
      </form>
      <p v-if="error" class="mt-4 text-red-500 text-center text-sm bg-red-50 p-2 rounded">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import api from '../services/api';

const otp = ref('');
const email = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const error = ref('');
const resendLoading = ref(false);
const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
    // Pre-fill email if available from registration flow
    if(authStore.emailForVerification) {
        email.value = authStore.emailForVerification;
    }
});

const resendOtp = async () => {
  if(!email.value) return alert('Please enter your email first');
  
  resendLoading.value = true;
  try {
    await api.resendOtp({ email: email.value });
    alert(`New OTP sent to ${email.value}`);
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to resend OTP');
  } finally {
    resendLoading.value = false;
  }
};

const handleVerify = async () => {
  if (newPassword.value !== confirmPassword.value) {
      error.value = "Passwords do not match";
      return;
  }
  
  try {
    await api.verifyOtp({ 
        email: email.value, 
        otp: otp.value,
        newPassword: newPassword.value 
    });
    
    // Clear temp storage
    authStore.emailForVerification = null;
    localStorage.removeItem('emailForVerification');
    
    alert('Account activated successfully! Please login with your new password.');
    router.push('/login');
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Verification failed';
  }
};
</script>
