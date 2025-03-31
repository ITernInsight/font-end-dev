<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface UserData {
  name: string
  email: string
  phone: string
  position: string
  photoUrl: string
}

const defaultUserData: UserData = {
  name: '',
  email: '',
  phone: '',
  position: '',
  photoUrl: ''
}

const user = ref<UserData>({ ...defaultUserData })
const originalUser = ref<UserData>({ ...defaultUserData }) // 🟢 เก็บค่าก่อนแก้

// แก้ไขประเภทให้กับ `editing` และเพิ่ม `photoUrl`
const editing = ref<{ [key in keyof UserData]: boolean }>({
  name: false,
  email: false,
  phone: false,
  position: false,
  photoUrl: false // เพิ่ม `photoUrl` เข้าไป
})

const fileInput = ref<HTMLInputElement | null>(null)

onMounted(() => {
  const stored = localStorage.getItem('user')
  if (stored) {
    const parsedUser = JSON.parse(stored)
    user.value = { ...defaultUserData, ...parsedUser }
    originalUser.value = { ...user.value }
  }
})

const toggleEdit = (field: keyof UserData) => { // เปลี่ยนเป็น keyof UserData
  originalUser.value = { ...user.value } // 🟢 บันทึกก่อนแก้
  editing.value[field] = true
}

const saveEdit = (field: keyof UserData) => { // เปลี่ยนเป็น keyof UserData
  editing.value[field] = false
  localStorage.setItem('user', JSON.stringify(user.value))
  window.dispatchEvent(new Event('user-logged-in'))
}

const cancelEdit = (field: keyof UserData) => { // เปลี่ยนเป็น keyof UserData
  user.value[field] = originalUser.value[field]
  editing.value[field] = false
}

const handlePhotoChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const maxSize = 2 * 1024 * 1024 // ขนาดสูงสุด 2MB
    if (file.size > maxSize) {
      alert('The file size exceeds the 2MB limit. Please select a smaller file.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      user.value.photoUrl = reader.result as string
      localStorage.setItem('user', JSON.stringify(user.value))
      window.dispatchEvent(new Event('user-logged-in'))
    }
    reader.readAsDataURL(file)
  }
}
</script>

<template>
  <div class="bg-white shadow-md rounded-lg max-w-md mx-auto my-8">
    <div class="p-6">
      <h1 class="text-2xl font-bold text-center mb-6">Edit Profile</h1>

      <!-- รูปโปรไฟล์ -->
      <div class="flex flex-col items-center mb-6">
        <div class="w-32 h-32 rounded-full border-2 border-[#00465e] mb-4 overflow-hidden">
          <img
            :src="user.photoUrl || 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png'"
            class="w-full h-full object-cover"
            alt="Profile"
          />
        </div>
        <label class="cursor-pointer text-[#00465e] hover:text-[#00384c]">
          <input type="file" accept="image/*" class="hidden" ref="fileInput" @change="handlePhotoChange" />
          <span class="underline">Select Photo</span>
          <p class="text-xs text-gray-500 mt-1">JPG or PNG files only</p>
        </label>
      </div>

      <!-- ข้อมูลโปรไฟล์ -->
      <div class="space-y-4">
        <!-- Field Template -->
        <div
          v-for="field in ['name', 'email', 'phone', 'position']"
          :key="field"
          class="flex justify-between items-center border-b pb-2"
        >
          <span class="font-medium text-gray-700 capitalize">{{ field }}</span>
          <div class="flex items-center">
            <input
              v-if="editing[field as keyof UserData]"
              v-model="user[field as keyof UserData]"
              :type="field === 'phone' ? 'tel' : 'text'"
              :maxlength="field === 'phone' ? 10 : undefined"
              @input="field === 'phone' ? (user.phone = user.phone.replace(/\\D/g, '').slice(0, 10)) : null"
              class="border-b border-gray-300 text-right focus:outline-none focus:border-[#00465e]"
            />
            <span v-else-if="field !== 'email'">{{ user[field as keyof UserData] }}</span>
            <a v-else :href="`mailto:${user.email}`" class="text-[#00465e]">{{ user.email }}</a>

            <button v-if="!editing[field as keyof UserData]" @click="toggleEdit(field as keyof UserData)" class="ml-2 edit-btn">✏️</button>

            <div v-else class="ml-2 flex space-x-2">
              <button @click="saveEdit(field as keyof UserData)" class="text-green-500 hover:text-green-700">✅</button>
              <button @click="cancelEdit(field as keyof UserData)" class="text-red-500 hover:text-red-700">❌</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.edit-btn {
  color: #00465e;
  transition: color 0.2s ease;
}
.edit-btn:hover {
  color: #00384c;
}
</style>
