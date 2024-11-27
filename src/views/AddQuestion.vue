<script setup lang="ts">
import { useRouter } from 'vue-router'



const router = useRouter()

// State to manage dropdown visibility

const handleCancel = () => {
  router.push('/') // Replace with the actual path to your Add Announcement page
}
</script>

<template>
   <div class="max-w-4xl mx-auto p-4">
    <h1 class="text-center text-2xl font-bold mb-6">Question</h1>
    <form class="space-y-4">
      <div>
        <label class="block text-gray-700">Title <span class="text-red-500">*</span></label>
        <input type="text" class="w-full border rounded-lg px-3 py-2" />
      </div>
      <div>
        <label class="block text-gray-700">Company <span class="text-red-500">*</span></label>
        <input type="text" class="w-full border rounded-lg px-3 py-2" />
      </div>
      <div>
        <label class="block text-gray-700">Position <span class="text-red-500">*</span></label>
        <select class="w-full border rounded-lg px-3 py-2">
          <option value="">Select Position</option>
          <option value="1">Position 1</option>
          <option value="2">Position 2</option>
        </select>
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
  

  
  <style scoped>
  </style>
  