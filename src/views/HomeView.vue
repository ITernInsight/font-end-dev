<script setup lang="ts">
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import { ref, onMounted, watch, onUnmounted } from 'vue';

const route = useRoute();
const router = useRouter();
const isDropdownOpen = ref(false);
const isLoggedIn = ref(false);

const checkLogin = () => {
  const token = localStorage.getItem('token');
  isLoggedIn.value = !!token && token !== 'undefined' && token !== '';

  // ถ้าออกจากระบบและอยู่ในหน้า threads ให้ redirect
  if (!isLoggedIn.value && (route.path === '/reviews' || route.path === '/questions')) {
    router.push('/');
  }
};

const handleLogout = () => {
  localStorage.removeItem('token');
  window.dispatchEvent(new Event('user-logged-out'));
};

onMounted(() => {
  checkLogin();
  window.addEventListener('storage', checkLogin);
  window.addEventListener('user-logged-in', checkLogin);
  window.addEventListener('user-logged-out', checkLogin);
});

onUnmounted(() => {
  window.removeEventListener('storage', checkLogin);
  window.removeEventListener('user-logged-in', checkLogin);
  window.removeEventListener('user-logged-out', checkLogin);
});

watch(route, () => {
  checkLogin();
});
</script>

<template>
  <div class="flex flex-col items-center">
    <img src="../assets/bg-home.jpg" alt="" class="relative bg-gray-200 w-full h-fit max-h-[520px]" />

    <div class="absolute left-16 top-48 text-white z-10 flex flex-row items-start">
      <div class="w-[20px] h-[256px] bg-white mr-4 rounded-sm"></div>

      <div class="flex flex-col leading-tight text-8xl font-bold uppercase space-y-4">
        <p>TERN</p>
        <p>NSIGHT</p>
      </div>
    </div>

    <div class="flex flex-row justify-center items-center">
      <RouterLink to="/posts" :class="{
        'border-b border-hightlight': route.path === '/posts',
      }" class="px-5 py-2.5 text-hightlight font-medium md:text-lg lg:text-xl">
        Announcement
      </RouterLink>

      <template v-if="isLoggedIn">
        <div class="relative">
          <button @click="isDropdownOpen = !isDropdownOpen" :class="{
            'border-b border-hightlight': route.path === '/reviews' || route.path === '/questions',
          }" class="px-5 py-2.5 text-hightlight font-medium md:text-lg lg:text-xl">
            Threads
          </button>

          <div v-if="isDropdownOpen"
            class="absolute left-0 mt-2 py-2 bg-white border rounded shadow-lg text-light-text dark:bg-dark-background z-10">
            <RouterLink to="/reviews"
              class="block px-4 py-2 text-light-text hover:text-hightlight dark:hover:bg-dark-secondary/5"
              @click="isDropdownOpen = false">
              Review
            </RouterLink>
            <RouterLink to="/questions"
              class="block px-4 py-2 text-light-text hover:text-hightlight dark:hover:bg-dark-secondary/5"
              @click="isDropdownOpen = false">
              Question
            </RouterLink>
          </div>
        </div>
      </template>
    </div>

    <RouterView :key="isLoggedIn" />
  </div>
</template>
