<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import ProfileDropdown from '@/components/ProfileDropdown.vue';


const route = useRoute();
const router = useRouter();

const isLoggedIn = ref(false);
const userRole = ref<string | null>(null);

// ตรวจสอบสถานะการล็อกอิน
const checkLoginStatus = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    isLoggedIn.value = false;
    userRole.value = null;
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT Payload
    const currentTime = Math.floor(Date.now() / 1000); // เวลาปัจจุบันในรูปแบบ Unix Timestamp

    if (payload.exp > currentTime) {
      isLoggedIn.value = true;
      userRole.value = payload.role || null;
    } else {
      // Token หมดอายุ
      logout();
    }
  } catch {
    logout();
  }
};

// ฟังก์ชัน Logout
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  isLoggedIn.value = false;
  userRole.value = null;
  router.push('/login'); 
};

onMounted(() => {
  checkLoginStatus();
  window.addEventListener('user-logged-in', checkLoginStatus);
  window.addEventListener('user-logged-out', logout);
});

onBeforeUnmount(() => {
  window.removeEventListener('user-logged-in', checkLoginStatus);
  window.removeEventListener('user-logged-out', logout);
});

watch(
  () => route.path,
  () => {
    checkLoginStatus();
  }
);
</script>

<template>
  <header
    class="sticky top-0 left-0 z-50 flex flex-row w-full bg-primary p-2 justify-between items-center lg:px-4"
  >
    <div class="flex flex-col text-white">
      <span class="text-base font-bold lg:text-lg">ITern Insight</span>
      <span class="text-xs font-light lg:text-sm">
        School of Information Technology, KMUTT
      </span>
    </div>

    <div class="flex items-center gap-2">
      <!-- แสดงปุ่ม Profile Dropdown หากล็อกอิน -->
      <ProfileDropdown v-if="isLoggedIn" />

      <!-- แสดงปุ่ม Login หากไม่ได้ล็อกอิน -->
      <button
        v-if="!isLoggedIn && route.name !== 'login'"
        @click="router.push('/login')"
        class="text-white text-xs font-bold bg-gradient-to-b from-button px-4 py-1.5 h-fit to-button/50 shadow-md rounded-lg lg:text-sm"
      >
        Log In
      </button>
    </div>
  </header>

  <RouterView />

  <footer
    class="relative bottom-0 flex flex-col gap-y-2 w-full bg-light-background dark:bg-dark-background pt-4 border-t border-light-border dark:border-dark-border font-Noto"
  ></footer>
</template>