<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store'

const router = useRouter()

// ตัวแปร ref สำหรับจัดเก็บข้อมูลที่กรอกในฟอร์ม
const title = ref('')
const company = ref('')
const position = ref([]);
const description = ref('')
const email = ref('')
const tel = ref('')

// รายการตำแหน่งงานที่สามารถเลือกได้
const positions = [
  "Software Developer",
  "Web Designer",
  "Project Manager",
  "QA Tester",
  "Backend Developer",
  "UX/UI Designer",
  "Business Analyst",
  "Full Stack Developer",
  "Marketing Specialist",
  "Data Science",
  "Devops Developer",
  "Data Analyst"
]

// ตัวแปรที่เก็บสถานะของ dropdown
const isDropdownOpen = ref(false);

// ตัวแปรที่เก็บตำแหน่งงานที่เลือก
const selectedPositions = ref<string[]>([]);

// ฟังก์ชันเปิด/ปิด dropdown
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// ฟังก์ชันเพื่อจัดการเมื่อกดปุ่ม Submit
const handleSubmit = () => {
  const newAnnouncement = {
    title: title.value,
    company: company.value,
    position: selectedPositions.value.join(', '), // แปลง array ให้เป็น string
    description: description.value,
    email: email.value,
    tel: tel.value,
  }
  store.addAnnouncement(newAnnouncement)
  router.push('/')
}

const handleCancel = () => {
  router.push('/') // Replace with the actual path to your HomeView page
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <h1 class="text-center text-2xl font-bold mb-6 text-hightlight">Add Announce</h1>
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label class="block font-semibold mb-1">Title <span class="text-red-500">*</span></label>
        <input type="text" v-model="title" class="w-full border rounded-lg px-3 py-2" />
      </div>
      <div class="mb-4">
        <label>Company <span class="text-red-500">*</span></label>
        <input type="text" v-model="company" class="w-full border rounded-lg px-3 py-2" />
      </div>

      <!-- Dropdown Custom สำหรับเลือกตำแหน่งงาน -->
      <div class="relative mb-4">
        <label>Position <span class="text-red-500">*</span></label>
        <div @click="toggleDropdown" class="w-full border rounded-lg px-3 py-2 flex justify-between items-center cursor-pointer">
          <span>{{ selectedPositions.length > 0 ? selectedPositions.join(', ') : 'Select Position' }}</span>
          <i class="fa fa-chevron-down"></i>
        </div>

        <div v-if="isDropdownOpen" class="absolute w-full mt-1 bg-white border rounded shadow-md max-h-64 overflow-y-auto z-10">
          <div v-for="pos in positions" :key="pos" class="flex items-center px-3 py-2 hover:bg-blue-50 cursor-pointer">
            <input type="checkbox" :value="pos" v-model="selectedPositions" class="form-checkbox h-4 w-4 text-blue-600 mr-2">
            <span>{{ pos }}</span>
          </div>
        </div>
      </div>

      <div class="mb-4">
        <label>Description <span class="text-red-500">*</span></label>
        <textarea v-model="description" class="w-full border rounded-lg px-3 py-2" rows="5"></textarea>
      </div>
      <div class="mb-4">
        <label>Email <span class="text-red-500">*</span></label>
        <input type="email" v-model="email" class="w-full border rounded-lg px-3 py-2" />
      </div>
      <div class="mb-4">
        <label>Tel <span class="text-red-500">*</span></label>
        <input type="text" v-model="tel" class="w-full border rounded-lg px-3 py-2" />
      </div>
      <div class="flex justify-center space-x-4 mt-4">
        <button type="button" class="text-white text-xs font-bold bg-gradient-to-b from-button px-4 py-1.5 h-fit to-button/55 shadow-md rounded-lg lg:text-sm"
        @click="handleCancel">
          Cancel
        </button>
        <button type="submit" class="text-white text-xs font-bold bg-gradient-to-b from-button px-4 py-1.5 h-fit to-button/55 shadow-md rounded-lg lg:text-sm">
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

