<script setup lang="ts">
import { ref } from 'vue'
import axios, { AxiosError } from 'axios'  // Import AxiosError
import { useRouter } from 'vue-router'
axios.defaults.baseURL = import.meta.env.VITE_ROOT_API

const name = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const phone = ref('')
const position = ref('')
const description = ref('')
const errorMessage = ref('')
const router = useRouter()

const registerUser = async () => {
  try {
    const payload = {
      name: name.value,
      username: username.value,
      email: email.value,
      password: password.value,
      phone: phone.value,
      position: position.value,
      description: description.value,
      image: 'default.jpg'
    }

    console.log('🔁 Sending register payload:', payload)

    await axios.post('https://capstone24.sit.kmutt.ac.th/un3/api/register', payload)

    // ✅ Success -> redirect
    router.push('/login')
  } catch (error) {
    console.error('❌ Registration error:', error)

    // ตรวจสอบว่าข้อผิดพลาดเป็น instance ของ AxiosError หรือไม่
    if (error instanceof AxiosError && error.response) {
      errorMessage.value =
        error.response.data?.message || 'Registration failed. Please try again.'
    } else {
      errorMessage.value = 'An unexpected error occurred. Please try again.'
    }
  }
}
</script>

<template>
  <div class="register-page flex h-screen overflow-hidden">
    <div class="w-1/2 relative">
      <img src="@/assets/login-bg.jpg" alt="Login Background" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-black bg-opacity-40"></div>
      <div class="absolute inset-0 flex flex-col justify-center items-center text-white px-8">
        <h1 class="text-9xl font-extrabold text-center">ITern<br />Insight</h1>
        <p class="text-3xl font-bold mt-4 text-center">Online Community For</p>
        <p class="text-3xl font-light mt-4 text-center">
          School of Information Technology,<br />KMUTT
        </p>
      </div>
    </div>

    <div class="w-1/2 flex flex-col justify-center items-center px-10 relative">
      <h2 class="text-2xl md:text-3xl font-semibold text-center mb-8">Create your account</h2>
      <form @submit.prevent="registerUser" class="w-full max-w-sm space-y-4">
        <input v-model="name" type="text" placeholder="Full Name" required class="input" />
        <input v-model="username" type="text" placeholder="Username" required class="input" />
        <input v-model="email" type="email" placeholder="Email" required class="input" />
        <input v-model="password" type="password" placeholder="Password" required class="input" />
        <input
          v-model="phone"
          type="text"
          placeholder="Phone"
          maxlength="10"
          @input="phone = phone.slice(0, 10)"
          class="input"
        />
        <input v-model="position" type="text" placeholder="Position" class="input" />
        <textarea v-model="description" placeholder="Description" class="input"></textarea>

        <router-link to="/login" class="text-sm text-hightlight hover:underline">Back to Login</router-link>

        <button
          type="submit"
          class="w-full bg-gradient-to-b from-button to-button/50 text-white px-4 py-2 rounded-lg shadow-md"
        >
          REGISTER
        </button>
      </form>

      <!-- Error Modal -->
      <div
        v-if="errorMessage"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
      >
        <div class="bg-white p-6 rounded-lg w-96 shadow-lg">
          <h3 class="text-lg font-bold mb-6 text-center text-red-600">❌ {{ errorMessage }}</h3>
          <div class="flex justify-center">
            <button
              @click="errorMessage = ''"
              class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply w-full border px-4 py-2 rounded;
}
</style>
