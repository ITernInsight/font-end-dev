<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { ref } from 'vue';

const route = useRoute();
const isDropdownOpen = ref(false);
</script>

<template>
  <div class="flex flex-col items-center">
    <img
      src="../assets/bg-home.jpg"
      alt=""
      class="relative bg-gray-200 w-full h-fit max-h-[520px]"
    />

    <div class="absolute left-16 top-24 text-white z-10 flex flex-row items-start">
  <!-- ตัว I เส้นขาวบางๆ -->
  <div class="w-[12px] h-[170px] bg-white mr-4 rounded-sm"></div>

  <!-- TERN + NSIGHT -->
  <div class="flex flex-col leading-tight text-6xl font-bold uppercase space-y-4">
    <p>TERN</p>
    <p>NSIGHT</p>
  </div>
</div>


    
    <div class="flex flex-row justify-center items-center">
      <RouterLink
        to="/posts"
        :class="{
          'border-b border-hightlight': route.path === '/posts',
        }"
        class="px-5 py-2.5 text-hightlight font-medium md:text-lg lg:text-xl"
      >
        Announcement
      </RouterLink>

      <!-- Threads Button with Dropdown -->
      <div class="relative">
        <button
          @click="isDropdownOpen = !isDropdownOpen"
          :class="{
            'border-b border-hightlight': route.path === '/reviews' || route.path === '/questions',
          }"
          class="px-5 py-2.5 text-hightlight font-medium md:text-lg lg:text-xl"
        >
          Threads
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="isDropdownOpen"
          class="absolute left-0 mt-2 py-2 bg-white border rounded shadow-lg text-light-text dark:bg-dark-background z-10"
        >
          <RouterLink
            to="/reviews"
            class="block px-4 py-2 text-light-text hover:text-hightlight dark:hover:bg-dark-secondary/5"
            @click="isDropdownOpen = false"
          >
            Review
          </RouterLink>
          <RouterLink
            to="/questions"
            class="block px-4 py-2 text-light-text hover:text-hightlight dark:hover:bg-dark-secondary/5"
            @click="isDropdownOpen = false"
          >
            Question
          </RouterLink>
        </div>
      </div>
    </div>
    <RouterView />
  </div>
</template>
