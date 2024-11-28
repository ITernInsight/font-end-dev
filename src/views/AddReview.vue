<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

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
  "Data Scientist",
  "DevOps Developer",
  "Data Analyst"
];

const isDropdownOpen = ref(false);
const selectedPositions = ref<string[]>([]);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const handleCancel = () => {
  router.push('/') // Replace with the actual path to your Home page
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <h1 class="text-center text-2xl font-bold mb-6">Review</h1>
    <form class="space-y-4">
      <div>
        <label class="block text-gray-700">Title <span class="text-red-500">*</span></label>
        <input type="text" class="w-full border rounded-lg px-3 py-2" />
      </div>
      <div>
        <label class="block text-gray-700">Company <span class="text-red-500">*</span></label>
        <input type="text" class="w-full border rounded-lg px-3 py-2" />
      </div>

      <!-- Dropdown Custom สำหรับเลือกตำแหน่งงาน -->
      <div class="relative mb-4">
        <label>Position <span class="text-red-500">*</span></label>
        <div @click="toggleDropdown" class="w-full border rounded-lg px-3 py-2 flex justify-between items-center cursor-pointer">
          <span>{{ selectedPositions.length > 0 ? selectedPositions.join(', ') : 'Select Position' }}</span>
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
        <textarea class="w-full border rounded-lg px-3 py-2" rows="5"></textarea>
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
