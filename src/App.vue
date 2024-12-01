<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <header
    class="sticky top-0 left-0 z-50 flex flex-row w-full bg-primary p-2 justify-between items-center lg:px-4"
  >
    <div class="flex flex-col text-white">
      <span class="text-base font-bold lg:text-lg">ITern Insight</span>
      <span class="text-xs font-light lg:text-sm">School of Information Technology, KMUTT</span>
    </div>
    <button
      v-if="!route.path.includes('/admin')"
      class="text-white text-xs font-bold bg-gradient-to-b from-button px-4 py-1.5 h-fit to-button/50 shadow-md rounded-lg lg:text-sm"
    >
      Log In
    </button>
  </header>

  <RouterView />

  <footer
    class="relative bottom-0 flex flex-col gap-y-2 w-full bg-light-background dark:bg-dark-background pt-4 border-t border-light-border dark:border-dark-border font-Noto"
  ></footer>
</template>
