<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { store } from '../store';

const route = useRoute();
const announce = ref({});

onMounted(() => {
  const id = route.params.id; // ดึง id จาก route parameters
  announce.value = store.announcements.find(a => a.id === id) || {};
});
</script>

<template>
  <div class="flex items-center justify-between w-full px-4 py-2">
    <div class="flex flex-1 justify-center">
      <RouterLink to="/posts" :class="{
          'border-b border-hightlight': route.path === '/posts',
        }" class="px-5 py-2.5 text-hightlight font-medium md:text-lg lg:text-xl">
        Announcement
      </RouterLink>
    </div>
  </div>

  <div class="container mx-auto max-w-5xl p-8 border border-gray-200 rounded-lg shadow-md mt-12">
    <!-- Title Section -->
    <h1 class="text-4xl font-bold mb-4 text-hightlight">{{ announce.title }}</h1>

    <!-- Company Section -->
    <div class="flex items-center mb-2">
      <i class="fa-regular fa-building mr-2"></i>
      <h2 class="text-2xl font-semibold">{{ announce.company }}</h2>
    </div>

    <!-- Position Section -->
    <h3 class="text-xl font-medium mb-4">{{ announce.position }}</h3>

    <!-- Description Section -->
    <p>
      {{ announce.description }}
    </p>

    <!-- Contact Information -->
    <div class="contact-info text-sm mt-8">
      <p>Email : <a :href="'mailto:' + announce.email" class="text-hightlight hover:underline">{{ announce.email }}</a></p>
      <p>Tel : <span class="text-hightlight">{{ announce.tel }}</span></p>
    </div>
  </div>
</template>