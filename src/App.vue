<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import ProfileDropdown from '@/components/ProfileDropdown.vue'

const route = useRoute()
const router = useRouter()

const isLoggedIn = ref(false)

const checkLoginStatus = () => {
  const user = localStorage.getItem('user')
  try {
<<<<<<< HEAD
    isLoggedIn.value = !!JSON.parse(user ?? 'null') // ตรวจสอบว่า user มีค่าและเป็น JSON ที่ถูกต้อง
=======
    isLoggedIn.value = !!JSON.parse(user)
>>>>>>> 70133af (Initial commit)
  } catch {
    isLoggedIn.value = false
  }
}

onMounted(() => {
  checkLoginStatus() // ตรวจสอบสถานะการล็อกอินเมื่อโหลดหน้า
  window.addEventListener('user-logged-in', checkLoginStatus)
})

onBeforeUnmount(() => {
  window.removeEventListener('user-logged-in', checkLoginStatus)
})

// ตรวจสอบการเปลี่ยนเส้นทาง
watch(
  () => route.path,
  () => {
    checkLoginStatus()
  }
)
</script>

<template>
  <header class="sticky top-0 left-0 z-50 flex flex-row w-full bg-primary p-2 justify-between items-center lg:px-4">
    <div class="flex flex-col text-white">
      <span class="text-base font-bold lg:text-lg">ITern Insight</span>
      <span class="text-xs font-light lg:text-sm">
        School of Information Technology, KMUTT
      </span>
    </div>

    <!-- แสดง ProfileDropdown ถ้า login แล้ว -->
    <ProfileDropdown v-if="isLoggedIn" />

    <!-- แสดงปุ่ม Log In ถ้ายังไม่ได้ login -->
    <button v-if="isLoggedIn === false && route.name !== 'login'&& route.name !== 'register' " @click="router.push('/login') "
      class="text-white text-xs font-bold bg-gradient-to-b from-button px-4 py-1.5 h-fit to-button/50 shadow-md rounded-lg lg:text-sm">
      Log In
    </button>
  </header>

  <RouterView />

  <footer
<<<<<<< HEAD
    class="relative bottom-0 flex flex-col gap-y-2 w-full bg-light-background dark:bg-dark-background pt-4 border-t border-light-border dark:border-dark-border font-Noto"
  ></footer>
=======
    class="relative bottom-0 flex flex-col gap-y-2 w-full bg-light-background dark:bg-dark-background pt-4 border-t border-light-border dark:border-dark-border font-Noto">
  </footer>
>>>>>>> 70133af (Initial commit)
</template>
