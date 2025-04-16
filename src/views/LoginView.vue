<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

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
  } catch (error: unknown) {
  let status: number | undefined;

  if (axios.isAxiosError(error)) {
    status = error.response?.status;
    const message = error.response?.data?.message || 'เกิดข้อผิดพลาดจากระบบ';

    if (status === 401) {
      errorMessage.value = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
    } else if (status === 403) {
      errorMessage.value = 'คุณไม่มีสิทธิ์เข้าถึง';
    } else {
      errorMessage.value = message;
    }
  } else {
    errorMessage.value = 'เกิดข้อผิดพลาดที่ไม่สามารถระบุได้';
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
</script>


<template>
  <div class="login-page flex h-screen overflow-hidden">
    <div class="w-1/2 relative">
      <img src="@/assets/login-bg.jpg" alt="Login Background" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-black bg-opacity-40"></div>
      <div class="absolute inset-0 flex flex-col justify-center items-center text-white px-8">
        <h1 class="text-9xl font-extrabold leading-none text-center">ITern<br />Insight</h1>
        <p class="text-3xl font-bold mt-4 text-center">Online Community For</p>
        <p class="text-3xl font-light mt-4 text-center">School of Information Technology,<br />KMUTT</p>
      </div>
    </div>

    <div class="w-1/2 flex flex-col justify-center items-center px-10 relative">
      <h2 class="text-2xl md:text-3xl font-semibold text-center mb-8">
        Welcome to the ITern Insight <p>Community</p>
      </h2>
      <form @submit.prevent="handleLogin" autocomplete="on" class="w-full max-w-sm space-y-4">
        <div class="relative">
          <input
            type="text"
            v-model="username"
            @focus="showSuggestions = true"
            @input="filterSuggestions"
            @blur="hideSuggestions"
            name="username"
            placeholder="Username"
            autocomplete="username"
            class="w-full border border-gray-300 px-4 py-2 rounded"
            required
          />
          <ul
            v-if="showSuggestions && filteredUsers.length"
            class="absolute bg-white shadow w-full rounded z-10 max-h-40 overflow-y-auto"
          >
            <li
              v-for="u in filteredUsers"
              :key="u.username"
              @mousedown.prevent="selectUsername(u.username, u.password)"
              class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {{ u.username }}
            </li>
          </ul>
        </div>

        <input
          type="password"
          v-model="password"
          name="password"
          placeholder="Password"
          autocomplete="current-password"
          class="w-full border border-gray-300 px-4 py-2 rounded"
          required
        />

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <input type="checkbox" id="remember" v-model="rememberMe" />
            <label for="remember" class="text-sm">Remember me</label>
          </div>
          <button
            type="button"
            @click="router.push('/register')"
            class="text-sm text-teal-700 hover:underline"
          >
            Register
          </button>
        </div>

        <button
          type="submit"
          class="w-full bg-gradient-to-b from-button to-button/50 text-white px-4 py-2 rounded-lg shadow-md"
        >
          LOG IN
        </button>
      </form>
    </div>

    <div
      v-if="showErrorModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
    >
      <div class="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h3 class="text-lg font-bold mb-6 text-center text-red-600">
          ❌ {{ errorMessage }}
        </h3>
        <div class="flex justify-center">
          <button
            @click="closeErrorModal"
            class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
