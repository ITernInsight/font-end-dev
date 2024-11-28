<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// ตัวแปร ref สำหรับจัดเก็บข้อมูลที่กรอกในฟอร์ม
const title = ref('');
const company = ref('');
const selectedPositions = ref<string[]>([]);
const description = ref('');

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
];

// ตัวแปรที่เก็บสถานะของ dropdown
const isDropdownOpen = ref(false);

// ฟังก์ชันเปิด/ปิด dropdown
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// ฟังก์ชันสำหรับลบตำแหน่งงานที่เลือก
const removePosition = (pos: string) => {
  selectedPositions.value = selectedPositions.value.filter(p => p !== pos);
};

const handleCancel = () => {
  router.push('/'); // Replace with the actual path to your Home page
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <h1 class="text-center text-2xl font-bold mb-6">Question</h1>
    <form class="space-y-4">
      <div>
        <label class="block text-gray-700">Title <span class="text-red-500">*</span></label>
        <input type="text" v-model="title" class="w-full border rounded-lg px-3 py-2" />
      </div>
      <div>
        <label class="block text-gray-700">Company <span class="text-red-500">*</span></label>
        <input type="text" v-model="company" class="w-full border rounded-lg px-3 py-2" />
      </div>

      <!-- Dropdown Custom สำหรับเลือกตำแหน่งงาน -->
      <div class="relative mb-4">
        <label>Position <span class="text-red-500">*</span></label>
        <div @click="toggleDropdown" class="w-full border rounded-lg px-3 py-2 flex justify-between items-center cursor-pointer">
          <div class="flex flex-wrap gap-2">
            <span v-for="pos in selectedPositions" :key="pos" class="flex items-center bg-blue-100 px-2 py-1 rounded">
              {{ pos }}
              <i class="fa fa-times ml-2 cursor-pointer" @click.stop="removePosition(pos)"></i>
            </span>
            <span v-if="selectedPositions.length === 0">Select Position</span>
          </div>
          <i :class="isDropdownOpen ? 'fa fa-chevron-up' : 'fa fa-chevron-down'"></i>
        </div>

        <div v-if="isDropdownOpen" class="absolute w-full mt-1 bg-white border rounded shadow-md max-h-64 overflow-y-auto z-10">
          <div v-for="pos in positions" :key="pos" class="flex items-center px-3 py-2 hover:bg-blue-50 cursor-pointer">
            <input type="checkbox" :value="pos" v-model="selectedPositions" class="form-checkbox h-4 w-4 text-blue-600 mr-2">
            <span>{{ pos }}</span>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-gray-700">Description <span class="text-red-500">*</span></label>
        <textarea v-model="description" class="w-full border rounded-lg px-3 py-2" rows="5"></textarea>
      </div>
      <div class="flex justify-center space-x-4 mt-4">
        <button type="button" class="text-white text-xs font-bold bg-gradient-to-b from-button px-4 py-1.5 h-fit to-button/50 shadow-md rounded-lg lg:text-sm"
        @click="handleCancel">
          Cancel
        </button>
        <button type="submit" class="text-white text-xs font-bold bg-gradient-to-b from-button px-4 py-1.5 h-fit to-button/50 shadow-md rounded-lg lg:text-sm">
          Submit
        </button>
      </div>
    </form>
  </div>
</template>
