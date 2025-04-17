<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

interface UserData {
  id?: number
  name: string
  email: string
  phone: string
  position: string
  photoUrl: string
  image?: string;
  
}

const uploadLoading = ref(false)
const router = useRouter()

const defaultUserData: UserData = {
  name: '',
  email: '',
  phone: '',
  position: '',
  photoUrl: ''
}

const user = ref<UserData>({ ...defaultUserData })
const originalUser = ref<UserData>({ ...defaultUserData })
const fileInput = ref<HTMLInputElement | null>(null)

onMounted(() => {
  const stored = localStorage.getItem('user');
  if (stored) {
    const parsed = JSON.parse(stored);
    user.value = parsed;
  }
});



const hasChanges = computed(() => {
  return JSON.stringify(user.value) !== JSON.stringify(originalUser.value)
})

const saveAll = async () => {
  try {
    const token = localStorage.getItem('token')
    const id = user.value.id
    if (!token || !id) throw new Error('No token or user ID found.')
    // uploadFile() // upload file first
    const respond = uploadFile()
    await axios.put(`http://localhost:3000/users/${id}`, user.value, {
      headers: { Authorization: `Bearer ${token}` }
    })

    originalUser.value = { ...user.value }
    localStorage.setItem('user', JSON.stringify(user.value))
    window.dispatchEvent(new Event('user-logged-in'))
  } catch (err: any) {
    const message = err.response?.data?.message || err.message
    if (message.includes('entity too large')) {
      showModalError('The file size exceeds the 2MB limit. Please select a smaller file.')
    } else {
      showModalError('Error: ' + message)
    }
  }
}
const selectedFile = ref<File | null>(null)

const handlePhotoChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const maxSize = 2 * 1024 * 1024
    const allowedTypes = ['image/png', 'image/jpeg']

    if (!allowedTypes.includes(file.type)) {
      showModalError('Only PNG and JPG image files are allowed.')
      return
    }

    if (file.size > maxSize) {
      showModalError('The file size exceeds the 2MB limit. Please select a smaller file.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      user.value.photoUrl = reader.result as string
    }
    reader.readAsDataURL(file)
    selectedFile.value = file
    console.log('Selected file:')
  }
}

const showErrorModal = ref(false)
const errorMessage = ref('')

const showModalError = (msg: string) => {
  errorMessage.value = msg
  showErrorModal.value = true
}

const uploadFile = async () => {
  if (!selectedFile.value) return alert('Please select a file first.');

  const formData = new FormData();
  formData.append('image', selectedFile.value);

  try {
    const response = await axios.post('http://localhost:3000/file-upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    console.log('Upload response:', response.data);

    // ✅ แยกชื่อไฟล์มาเก็บ
    const filename = response.data.image_url.split('/').pop();
    console.log('Image filename:', filename);

    // ✅ ส่งไปอัปเดต backend
    await axios.post('http://localhost:3000/login/update_image', {
      email: user.value.email,
      imageUrl: filename
    });

    // ✅ อัปเดตข้อมูล user ฝั่ง frontend
    user.value.image = filename;

    const stored = localStorage.getItem('user');
    if (stored) {
      const parsedUser = JSON.parse(stored);
      parsedUser.image = filename;
      localStorage.setItem('user', JSON.stringify(parsedUser));
    }

    window.dispatchEvent(new Event('user-logged-in'));
    // router.push('/posts');
    alert('Upload successful!');
    router.push('/posts');

  } catch (error) {
    console.error('Upload failed:', error);
  }
};

const profileImageUrl = computed(() => {
  const filename = user.value?.image || '';
  // if selectedFile is not null, use it
  if (selectedFile.value) {
    return URL.createObjectURL(selectedFile.value);
  }
  if (filename && filename !== 'null' && filename !== 'undefined') {
    // ป้องกัน cache และตรวจรูปได้ทันทีหลัง upload
    return `http://localhost:9000/iterninsight/${filename}?t=${Date.now()}`;
  }
  return 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png';
});




</script>

<template>
  <div class="bg-white shadow-md rounded-lg max-w-md mx-auto my-8">
    <div class="p-6">
      <h1 class="text-2xl font-bold text-center mb-6">Edit Profile</h1>

      <!-- รูปโปรไฟล์ -->
      <div class="flex flex-col items-center mb-6">
        <div class="w-32 h-32 rounded-full border-2 border-[#00465e] mb-4 overflow-hidden">
          <!-- <img
            :src="profileImageUrl || 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png'"
            class="w-full h-full object-cover"
            alt="Profile"
          /> -->
          <!-- <img :src="profileImageUrl" class="w-full h-full object-cover" alt="Profile" /> -->
          <img :src="profileImageUrl" @error="console.log('❌ โหลดรูปไม่สำเร็จ:', profileImageUrl)" />

        </div>
        <label class="cursor-pointer text-[#00465e] hover:text-[#00384c]">
          <input type="file" accept="image/*" class="hidden" ref="fileInput" @change="handlePhotoChange" />
          <span class="underline">Select Photo</span>
          <p class="text-xs text-gray-500 mt-1">JPG or PNG files only</p>
        </label>

      </div>

      <!-- ข้อมูลโปรไฟล์ -->
      <div class="space-y-4">
        <div
          v-for="field in ['name', 'email', 'phone', 'position']"
          :key="field"
          class="flex justify-between items-center border-b pb-2"
        >
          <span class="font-medium text-gray-700 capitalize">{{ field }}</span>
          <div class="flex items-center w-2/3">
            <input
              v-model="user[field as keyof UserData]"
              :type="field === 'phone' ? 'tel' : 'text'"
              :maxlength="field === 'phone' ? 10 : undefined"
              @input="field === 'phone' ? (user.phone = user.phone.replace(/\D/g, '').slice(0, 10)) : null"
              class="w-full text-right focus:outline-none"
            />
          </div>
        </div>
      </div>

      <!-- ปุ่ม Save / Cancel -->
      <div class="mt-6 text-center flex justify-center gap-4">
        <button
          @click="saveAll"
          :disabled="!hasChanges"
          :class="[
            'px-6 py-2 rounded text-white transition',
            hasChanges ? 'bg-[#00465e] hover:bg-[#00384c] cursor-pointer' : 'bg-gray-400 cursor-not-allowed'
          ]"
        >
          Save
        </button>
        <button
          @click="$router.push('/posts')"
          class="px-6 py-2 rounded text-white bg-red-500 hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>

  <!-- Modal Error -->
  <div v-if="showErrorModal" class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
      <h2 class="text-lg font-semibold text-red-600 mb-4">Error</h2>
      <p class="text-sm text-gray-700 mb-6">{{ errorMessage }}</p>
      <div class="text-right">
        <button
          @click="showErrorModal = false"
          class="px-4 py-2 bg-[#00465e] text-white rounded hover:bg-[#00384c]"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
