<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div class="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Forgot Password</h1>
        <p class="text-gray-500 mt-2">Reset your account password</p>
      </div>

      <!-- Step 1: Request OTP -->
      <form v-if="step === 1" @submit.prevent="requestOtp" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
          <input 
            v-model="email" 
            type="email" 
            required 
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            placeholder="Enter your email"
          />
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex justify-center items-center"
        >
          <svg v-if="loading" class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Sending...' : 'Send OTP' }}
        </button>
        
        <div class="text-center">
            <router-link to="/login" class="text-sm text-gray-500 hover:text-blue-600 font-bold">Back to Login</router-link>
        </div>
      </form>

      <!-- Step 2: Verify & Reset -->
      <form v-else @submit.prevent="resetPassword" class="space-y-6">
        <div class="bg-blue-50 p-4 rounded-lg text-sm text-blue-700 mb-4">
            OTP sent to <strong>{{ email }}</strong>
        </div>
        
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Enter OTP</label>
          <input 
            v-model="otp" 
            type="text" 
            required 
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-center tracking-widest font-mono text-xl"
            placeholder="XXXXXX"
            maxlength="6"
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">New Password</label>
          <input 
            v-model="newPassword" 
            type="password" 
            required 
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-500/30 flex justify-center items-center"
        >
           <svg v-if="loading" class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Resetting...' : 'Reset Password' }}
        </button>
        
        <div class="text-center space-y-2">
            <button type="button" @click="step = 1" class="text-sm text-blue-600 hover:underline font-bold">Resend OTP / Change Email</button>
            <div class="block">
                <router-link to="/login" class="text-sm text-gray-500 hover:text-blue-600 font-bold">Back to Login</router-link>
            </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const step = ref(1);
const email = ref('');
const otp = ref('');
const newPassword = ref('');
const loading = ref(false);

const requestOtp = async () => {
    loading.value = true;
    try {
        await api.forgotPassword({ email: email.value });
        step.value = 2;
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to send OTP');
    } finally {
        loading.value = false;
    }
};

const resetPassword = async () => {
    loading.value = true;
    try {
        await api.resetPassword({ 
            email: email.value,
            otp: otp.value,
            newPassword: newPassword.value
        });
        alert('Password reset successful! Please login.');
        router.push('/login');
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to reset password');
    } finally {
        loading.value = false;
    }
};
</script>