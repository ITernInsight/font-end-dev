<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Define the Post interface
interface Post {
  Post_ID: number
  Admin_ID: number
  Company_ID: number
  Position: string
  Description: string
  Deadline: string
}

// Declare posts array and loading state
const posts = ref<Post[]>([])
const isLoading = ref(true) // loading state

const fetchData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/posts')
    posts.value = response.data
  } catch (error) {
    console.error('Error fetching data', error)
  } finally {
    isLoading.value = false // data fetch completed
  }
}

onMounted(fetchData)
</script>

<template>
  <div
    class="font-Prompt px-2 space-y-2 mt-2 w-full sm:px-12 md:px-16 lg:px-32 lg:py-4 xl:px-56 2xl:px-96"
  >
    <!-- Check if posts array has data before rendering the first and second post -->
    <div v-if="posts.length > 0">
      <RouterLink
        :to="`posts/${posts[0].Post_ID}`"
        class="flex flex-row border border-border gap-x-4 pr-4 items-start h-full"
      >
        <img
          src=""
          alt=""
          class="bg-gray-200 w-[120px] aspect-[3/2] border-r border-border md:w-[200px] lg:w-[280px] xl:w-[320px] 2xl:w-[400px]"
        />
        <div class="flex flex-col gap-y-1 w-full py-2 xl:gap-y-2">
          <div class="text-hightlight font-bold text-sm w-full md:text-lg lg:text-xl">
            {{ posts[0].Company_ID }}
          </div>
          <span class="text-subtext text-xs md:text-base lg:text-lg">
            {{ posts[0].Description }}
          </span>
          <button
            class="hidden mt-2 text-xs font-medium text-white w-fit bg-gradient-to-b from-button to-button/40 px-4 py-1 rounded-lg border-border border shadow-sm md:block md:text-sm lg:text-base"
          >
            Read more
          </button>
        </div>
      </RouterLink>
    </div>

    <div v-if="posts.length > 1">
      <RouterLink
        :to="`posts/${posts[1].Post_ID}`"
        class="flex flex-row border border-border gap-x-4 pl-4 items-start"
      >
        <div class="flex flex-col gap-y-1 w-full py-2 xl:gap-y-2">
          <div class="text-hightlight font-bold text-sm md:text-lg lg:text-xl">
            {{ posts[1].Company_ID }}
          </div>
          <span class="text-subtext text-xs md:text-base lg:text-lg">
            {{ posts[1].Description }}
          </span>
          <button
            class="hidden mt-2 text-xs font-medium text-white w-fit bg-gradient-to-b from-button to-button/40 px-4 py-1 rounded-lg border-border border shadow-sm md:block md:text-sm lg:text-base"
          >
            Read more
          </button>
        </div>
        <img
          src=""
          alt=""
          class="bg-gray-200 w-[120px] aspect-[3/2] border-r border-border md:w-[200px] lg:w-[280px] xl:w-[320px] 2xl:w-[400px]"
        />
      </RouterLink>
    </div>

    <h1 class="text-hightlight font-bold flex items-center md:text-lg lg:text-xl">
      Announce
      <span class="relative inline-flex ml-2">
        <span
          class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary -top-1"
        ></span>
        <span class="relative inline-flex h-2 w-2 rounded-full bg-primary -top-1"></span>
      </span>
    </h1>

    <!-- Only render posts starting from index 2 if there are more than 2 posts -->
    <div v-if="posts.length > 2">
      <div
        v-for="(post, index) in posts.slice(2)"
        :key="index"
        class="flex flex-row justify-between items-center font-Prompt border-border border-b py-2"
      >
        <span class="text-sm md:text-base lg:text-lg"> {{ post.Company_ID }} </span>
        <RouterLink
          :to="`posts/${post.Post_ID}`"
          class="text-xs font-medium text-white bg-gradient-to-b from-button to-button/20 px-4 py-1 rounded-lg border-border border shadow-sm md:text-sm lg:text-base"
        >
          Read more
        </RouterLink>
      </div>
    </div>
  </div>
</template>
