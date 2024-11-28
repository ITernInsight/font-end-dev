<script setup lang="ts">
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { store } from '../store'
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

const route = useRoute()
const router = useRouter()

// State to manage dropdown visibility
const isDropdownOpen = ref(false)

const handleAddAnnouncement = () => {
  router.push('/adminaddannounce') 
}
const handleEditAnnouncement = (id) => {
  router.push(`/editannounce/${id}`) 
}
const handleDetailAnnouncement = (id) => {
  router.push(`/detailannounce/${id}`) 
};


const deleteAnnouncement = (index) => {
  store.announcements.splice(index, 1); // Delete announcement by index
  localStorage.setItem('announcements', JSON.stringify(store.announcements)); // Update local storage
};


const truncateDescription = (description) => {
  const maxLength = 75; // Set maximum characters to display
  if (description.length > maxLength) {
    return description.substring(0, maxLength) + '...';
  }
  return description;
}
</script>


<template>
  <div class="flex flex-col items-center">
    <img src="../assets/bg-home.jpg" alt="" class="relative bg-gray-200 w-full h-fit max-h-[520px]" />
    <div class="flex items-center justify-between w-full px-4 py-2">
      <div class="flex flex-1 justify-center">
        <RouterLink to="/posts" :class="{
          'border-b border-hightlight': route.path === '/posts',
        }" class="px-5 py-2.5 text-hightlight font-medium md:text-lg lg:text-xl">
          Announcement
        </RouterLink>

        <!-- Threads Button with Dropdown -->
        <div class="relative">
          <button @click="isDropdownOpen = !isDropdownOpen" :class="{
            'border-b border-hightlight': route.path === '/reviews' || route.path === '/questions',
          }" class="px-5 py-2.5 text-hightlight font-medium md:text-lg lg:text-xl">
            Threads
          </button>

          <!-- Dropdown Menu -->
          <div v-if="isDropdownOpen"
            class="absolute left-0 mt-2 py-2 bg-white border rounded shadow-lg text-light-text dark:bg-dark-background z-10">
            <RouterLink to="/addreview"
              class="block px-4 py-2 text-light-text hover:text-hightlight dark:hover:bg-dark-secondary/5"
              @click="isDropdownOpen = false">
              Review
            </RouterLink>
            <RouterLink to="/addquestion"
              class="block px-4 py-2 text-light-text hover:text-hightlight dark:hover:bg-dark-secondary/5"
              @click="isDropdownOpen = false">
              Question
            </RouterLink>
          </div>
        </div>
      </div>

      
      <button
        class="ml-auto text-white text-xs font-bold bg-gradient-to-b from-button px-4 py-1.5 h-fit to-button/50 shadow-md rounded-lg lg:text-sm"
        @click="handleAddAnnouncement">
        Add Announcement
      </button>
    </div>

    <RouterView />

    <!-- ประกาศที่เก็บใน Local Storage -->
    <div class="w-full flex flex-col items-center space-y-2 ">
      <div v-for="(announce, index) in store.announcements" :key="announce.id"
        class="flex items-center justify-between shadow-md rounded-md p-4  w-full max-w-4xl ">
        <div class="flex-1">
          <h2 class="text-lg font-semibold mb-2 text-hightlight">{{ announce.title }}</h2>
          <div class="flex items-center text-xl text-gray-600 mt-2">
            <i class="fa-regular fa-building mr-2"></i>
            <span>  {{ announce.company }}</span>
          </div>
          <p class="text-gray-600">{{ truncateDescription(announce.description) }}</p>
        </div>
        <div class="flex items-center space-x-2">
          
          <button
            class="ml-auto text-white text-xs font-bold bg-gradient-to-b from-button px-4 py-2 h-fit to-button/50 shadow-md rounded-lg lg:text-sm"
            @click="handleDetailAnnouncement(announce.id)">
            Read More</button>

          
          <button @click="handleEditAnnouncement(announce.id)"
            class="w-9 h-9 border-2 border-hightlight rounded-md flex items-center justify-center bg-white text-hightlight">
            <i class="fas fa-pen"></i>
          </button>

          
          <button @click="deleteAnnouncement(index)"
            class="w-9 h-9 border-2 border-hightlight rounded-md flex items-center justify-center bg-white text-hightlight">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
