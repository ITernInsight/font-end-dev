<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import viewIcon from '@/assets/view.png'
import hideIcon from '@/assets/hide.png'

const router = useRouter();

const username = ref('');
const password = ref('');
const rememberMe = ref(false);
const showErrorModal = ref(false);
const errorMessage = ref('');

const savedUsers = ref<{ username: string; password: string }[]>([]);
const showSuggestions = ref(false);
const filteredUsers = ref<{ username: string; password: string }[]>([]);

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:3000/login', {
      username: username.value.trim().toLowerCase(),
      password: password.value,
    });

    const { access_token, user } = response.data;

    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(user));

    window.dispatchEvent(new Event('user-logged-in'));

    if (rememberMe.value) {
      const newUser = {
        username: username.value,
        password: password.value,
      };

      const existing = savedUsers.value.filter(u => u.username !== newUser.username);
      savedUsers.value = [newUser, ...existing];
      localStorage.setItem('rememberedUsers', JSON.stringify(savedUsers.value));
    }

    if (user.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/');
    }
  } catch (error: any) {
    const status = error.response?.status;

    if (status === 401) {
      // กรณี username หรือ password ผิด
      errorMessage.value = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
    } else if (status === 403) {
      // กรณี user ไม่มีสิทธิ์
      errorMessage.value = 'คุณไม่มีสิทธิ์เข้าถึง';
    } else if (status === 404) {
      // กรณี user ไม่พบในระบบ
      errorMessage.value = 'ไม่พบชื่อผู้ใช้นี้ในระบบ';
    } else {
      errorMessage.value = error.response?.data?.message || 'เกิดข้อผิดพลาดจากระบบ';
    }
    showErrorModal.value = true;
  }

};

const closeErrorModal = () => {
  showErrorModal.value = false;
};

const filterSuggestions = () => {
  filteredUsers.value = savedUsers.value.filter(u =>
    u.username.toLowerCase().includes(username.value.toLowerCase())
  );

  const exact = savedUsers.value.find(u => u.username === username.value);
  if (exact) {
    password.value = exact.password;
    showSuggestions.value = false;
    filteredUsers.value = [];
  }
};

const selectUsername = (selectedUsername: string, pwd: string) => {
  username.value = selectedUsername;
  password.value = pwd;
  showSuggestions.value = false;
  filteredUsers.value = [];
  nextTick(() => {
    const passwordInput = document.querySelector<HTMLInputElement>('input[name="password"]');
    if (passwordInput) passwordInput.focus();
  });
};

const hideSuggestions = () => {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 100);
};

onMounted(() => {
  const saved = localStorage.getItem('rememberedUsers');
  if (saved) {
    savedUsers.value = JSON.parse(saved);
  }
});

const showPassword = ref(false)
</script>


<template>
  <div class="register-page flex h-screen overflow-hidden">
    <!-- ✅ ฝั่งซ้าย: fixed ไม่ขยับ -->
    <div class="w-1/2 fixed left-0 inset-y-0 overflow-clip border-b border-transparent">
      <img src="@/assets/login-bg.jpg" alt="Login Background" class="w-full min-h-full object-cover object-top" />
      <div class="absolute inset-0 bg-black bg-opacity-40"></div>
      <div class="absolute inset-0 flex flex-col justify-center items-center text-white px-8">
        <h1 class="text-9xl font-extrabold leading-none text-center">ITern<br />Insight</h1>
        <p class="text-3xl font-bold mt-4 text-center">Online Community For</p>
        <p class="text-3xl font-light mt-4 text-center">School of Information Technology,<br />KMUTT</p>
      </div>
    </div>


    <div class="ml-auto w-1/2 flex items-center justify-center h-screen overflow-hidden">
      <div class="w-full max-w-sm space-y-6 overflow-visible max-h-full">
        <h2 class="text-xl md:text-2xl font-semibold text-center">
          Welcome to the ITern Insight Community
        </h2>

        <!-- ✅ ฟอร์ม -->
        <form @submit.prevent="handleLogin" autocomplete="on" class="space-y-6">
          <!-- Username -->
          <div>
            <label class="text-xs font-medium text-gray-600">Username</label>
            <input type="text" v-model="username" @focus="showSuggestions = true" @input="filterSuggestions"
              @blur="hideSuggestions" placeholder="johndoe123"
              class="w-full border-b border-gray-300 focus:outline-none focus:border-teal-600 text-sm py-1.5"
              required />
            <ul v-if="showSuggestions && filteredUsers.length"
              class="absolute bg-white shadow w-full rounded z-10 max-h-40 overflow-y-auto">
              <li v-for="u in filteredUsers" :key="u.username"
                @mousedown.prevent="selectUsername(u.username, u.password)"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                {{ u.username }}
              </li>
            </ul>
          </div>

          <!-- Password -->
          <div class="relative">
            <label class="text-xs font-medium text-gray-600">Password</label>
            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="********"
              class="w-full border-b border-gray-300 focus:outline-none focus:border-teal-600 text-sm py-1.5 pr-10"
              required />
            <button type="button" @click="showPassword = !showPassword"
              class="absolute right-2 top-1/2 -translate-y-1/2">
              <img :src="showPassword ? hideIcon : viewIcon" class="w-5 h-5" alt="toggle password" />
            </button>
          </div>

          <!-- Remember me -->
          <div class="flex items-center gap-2">
            <input type="checkbox" id="remember" v-model="rememberMe"
              class="accent-teal-600 w-4 h-4 border-gray-300 rounded" />
            <label for="remember" class="text-xs text-gray-600">Remember me</label>
          </div>

          <!-- LOG IN Button -->
          <button type="submit"
            class="w-full w-full bg-gradient-to-b from-button to-button/50 text-white px-4 py-2 rounded-lg shadow-sm py-2 rounded-full shadow-lg transition duration-150 ease-in-out">
            LOG IN
          </button>

          <!-- Forgot password / Register -->
          <div class="text-center text-sm text-gray-500 space-y-2">
            <button @click="router.push('/forgot-password')" class="hover:underline text-teal-600">
              Forgotten password?
            </button>
            <div>
              Already have an account?
              <button @click="router.push('/register')" class="ml-1 hover:underline text-teal-600">
                Register now
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>


</template>

<style scoped></style>
