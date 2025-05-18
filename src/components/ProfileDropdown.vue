<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'; // ✅ เพิ่ม computed
import { useRouter, useRoute } from 'vue-router';
import editIcon from '@/assets/EditProfile.png';
import logoutIcon from '@/assets/logout.png';

const router = useRouter();
const route = useRoute();

const user = ref<{ name: string; email?: string; image?: string; role?: string } | null>(null);
const showMenu = ref(false);
const isLoggedIn = ref(false);

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token'); 
  isLoggedIn.value = false;
  window.dispatchEvent(new Event('user-logged-out'));
  router.push('/posts');
};

const updateUser = () => {
  const stored = localStorage.getItem('user');
  if (stored) {
    const parsed = JSON.parse(stored);
    if (!parsed.name && parsed.email) {
      parsed.name = parsed.email.split('@')[0];
    }
    user.value = parsed;
    isLoggedIn.value = true;
  } else {
    user.value = null;
    isLoggedIn.value = false;
  }
};

onMounted(() => {
  updateUser();
  window.addEventListener('user-logged-in', updateUser);
});

onBeforeUnmount(() => {
  window.removeEventListener('user-logged-in', updateUser);
});

watch(route, () => {
  showMenu.value = false;
  updateUser();
});

const goToEditProfile = () => {
  router.push('/edit-profile');
};

// ✅ เพิ่ม computed สำหรับ URL ของรูป
const profileImageUrl = computed(() => {
  const filename = user.value?.image || '';
  if (filename && filename !== 'null' && filename !== 'undefined') {
    // ป้องกัน cache และตรวจรูปได้ทันทีหลัง upload
    return `http://localhost:9000/iterninsight/${filename}?t=${Date.now()}`;
  }
  return 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png';
});

// const user = JSON.parse(localStorage.getItem('user') || '{}');



</script>

<template>
  <div v-if="isLoggedIn" class="relative">
    <div
      class="flex items-center gap-2 cursor-pointer"
      @click.stop="showMenu = !showMenu"
    >
      <span class="font-semibold hidden sm:inline text-white text-xl">{{ user?.name }}</span>
      <div
        class="w-8 h-8 rounded-full bg-white text-primary font-bold flex items-center justify-center uppercase overflow-hidden"
      >
        <!-- ✅ เปลี่ยนเป็นใช้ computed profileImageUrl -->
        <template v-if="profileImageUrl">
          <img :src="profileImageUrl" alt="Profile" class="w-full h-full object-cover" />
        </template>
        <template v-else>
          {{ user?.name?.charAt(0) || '?' }}
        </template>
      </div>
    </div>

    <!-- Dropdown -->
    <div
      v-if="showMenu"
      class="absolute right-0 mt-2 bg-white rounded-lg shadow-lg w-64 p-4 z-50 text-black"
      @click.stop
    >
      <!-- ลูกศรชี้ -->
      <div class="absolute -top-2 right-4 w-4 h-4 bg-white transform rotate-45 shadow-md"></div>

      <!-- ข้อมูลผู้ใช้ -->
      <div class="flex items-center gap-3 mb-3">
        <div
          class="w-12 h-12 rounded-full bg-white text-primary font-bold flex items-center justify-center uppercase border-2 border-primary overflow-hidden"
        >
          <!-- ✅ ใช้ profileImageUrl อีกจุด -->
          <template v-if="profileImageUrl">
            <img :src="profileImageUrl" alt="Profile" class="w-full h-full object-cover" />
          </template>
          <template v-else>
            {{ user?.name?.charAt(0) || '?' }}
          </template>
        </div>
        <div>
          <p class="font-semibold leading-4 text-primary">{{ user?.name }}</p>
          <p class="text-sm text-gray-700">{{ user?.email }}</p>
        </div>
      </div>

      <hr class="my-2 border-gray-300" />

      <!-- เมนู -->
      <div class="flex flex-col gap-2">
        <button
          class="flex items-center gap-2 text-primary hover:underline"
          @click="goToEditProfile"
        >
          <img :src="editIcon" alt="Edit" class="w-5 h-5" />
          Edit Profile
        </button>
        <button
          class="flex items-center gap-2 text-red-600 hover:underline"
          @click="logout"
        >
          <img :src="logoutIcon" alt="Logout" class="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
