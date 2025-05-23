<template>
  <div class="absolute bg-white border shadow-lg rounded-lg p-4 w-64 z-50">
    <router-link :to="`/users/${user.id}`" class="flex items-start gap-3 no-underline hover:underline">
      <img :src="user?.image?.startsWith('http') ? user.image : `http://localhost:9000/iterninsight/${user.image}`"
        alt="Profile" class="w-10 h-10 rounded-full object-cover" />


      <div>
        <p class="font-bold text-base text-black">{{ user.name }}</p>
        <p class="text-gray-600 text-sm">{{ user.position }}</p>
        <p class="text-gray-500 text-sm truncate">{{ user.email }}</p>
        <p class="text-gray-500 text-sm mt-1 line-clamp-2">{{ user.description }}</p>
      </div>
    </router-link>
  </div>
</template>


<script setup lang="ts">
defineProps({ user: Object });

</script>
