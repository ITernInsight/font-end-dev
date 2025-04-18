<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import axios from 'axios'
import Filter from '../components/FilterComp.vue'
// axios.defaults.baseURL = import.meta.env.VITE_ROOT_API

interface Company {
  id: number
  companyName: string
}

// Define the Post interface
interface Post {
  id: number
  title: string
  subtitle: string
  description: string
  position: string
  startDate: Date | null
  endDate: Date
  company: Company
}

// Declare posts array and loading state
const posts = ref<Post[]>([])
const isLoading = ref(true) // loading state
const searchKeyword = ref('') // search keyword
const selectedPosition = ref('') // position filter
const startDateSelected = ref('') // start date filter
const endDateSelected = ref('') // end date filter

const fetchData = async () => {
  try {
    const response = await axios.get<Post[]>('https://capstone24.sit.kmutt.ac.th/un3/api/posts')
    // Flatten the data by extracting the companyName
    posts.value = response.data.map((post) => ({
      id: post.id,
      title: post.title,
      subtitle: post.subtitle,
      description: post.description,
      position: post.position,
      startDate: post.startDate ? new Date(post.startDate) : null,
      endDate: new Date(post.endDate),
      company: {
        id: post.company.id,
        companyName: post.company.companyName,
      },
    }))
  } catch (error) {
    console.error('Error fetching data', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchData)

// Filtered reviews based on search keyword, selected position, and date range
const filteredReviews = computed(() => {
  return posts.value.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      post.subtitle.toLowerCase().includes(searchKeyword.value.toLowerCase());

    const matchesPosition = !selectedPosition.value || post.position.includes(selectedPosition.value);

    const postStartDate = post.startDate ? new Date(post.startDate) : null;
    const postEndDate = new Date(post.endDate);

    const matchesDateRange =
      (!startDateSelected.value ||
        !postStartDate ||
        postStartDate <= new Date(startDateSelected.value)) &&
      (!endDateSelected.value || postEndDate >= new Date(endDateSelected.value));

    return matchesSearch && matchesPosition && matchesDateRange;
  });
});



const positions = computed(() => {
  const allPositions = posts.value.flatMap((post) => post.position);
  const uniquePositions = new Set(allPositions); // This ensures only unique positions
  return Array.from(uniquePositions);
});

</script>

<template>
  <Filter
    class="my-2"
    @updateSearch="searchKeyword = $event"
    @updatePosition="selectedPosition = $event"
    @updateStartDate="startDateSelected = $event"
    @updateEndDate="endDateSelected = $event"
    :positions="positions"
  />
  <div
    class="font-Prompt px-2 mt-2 space-y-2 w-full sm:px-12 md:px-16 lg:px-32 lg:py-4 xl:px-56 2xl:px-96"
  >
    <div v-if="isLoading" class="text-center">Loading...</div>
    <!-- Show "Post not found" if there are no filtered posts -->
    <div
      v-if="filteredReviews.length === 0 && !isLoading"
      class="text-center text-lg text-gray-500"
    >
      Post not found
    </div>

    <!-- Check if posts array has data before rendering the first and second post -->
    <div v-if="filteredReviews.length > 0">
      <RouterLink
        :to="`posts/${filteredReviews[0].id}`"
        class="flex flex-row border border-border gap-x-4 pr-4 items-start h-full"
      >
        <img
          src=""
          alt=""
          class="bg-gray-200 w-[120px] aspect-[3/2] border-r border-border md:w-[200px] lg:w-[280px] xl:w-[320px] 2xl:w-[400px]"
        />
        <div class="flex flex-col gap-y-1 w-full py-2 xl:gap-y-2">
          <div class="text-hightlight font-bold text-sm w-full md:text-lg lg:text-xl">
            {{ filteredReviews[0].title }}
          </div>
          <span class="text-subtext text-xs md:text-base lg:text-lg">
            {{ filteredReviews[0].subtitle }}
          </span>
          <button
            class="hidden mt-2 text-xs font-medium text-white w-fit bg-gradient-to-b from-button to-button/40 px-4 py-1 rounded-lg border-border border shadow-sm md:block md:text-sm lg:text-base"
          >
            Read more
          </button>
        </div>
      </RouterLink>
    </div>

    <div v-if="filteredReviews.length > 1">
      <RouterLink
        :to="`posts/${filteredReviews[1].id}`"
        class="flex flex-row border border-border gap-x-4 pl-4 items-start"
      >
        <div class="flex flex-col gap-y-1 w-full py-2 xl:gap-y-2">
          <div class="text-hightlight font-bold text-sm md:text-lg lg:text-xl">
            {{ filteredReviews[1].title }}
          </div>
          <span class="text-subtext text-xs md:text-base lg:text-lg">
            {{ filteredReviews[1].subtitle }}
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

    <!-- Only render posts starting from index 2 if there are more than 2 posts -->
    <div v-if="filteredReviews.length > 2">
      <h1 class="text-hightlight font-bold flex items-center md:text-lg lg:text-xl">
        Other Announce
        <span class="relative inline-flex ml-2">
          <span
            class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary -top-1"
          ></span>
          <span class="relative inline-flex h-2 w-2 rounded-full bg-primary -top-1"></span>
        </span>
      </h1>
      <div
        v-for="(post, index) in filteredReviews.slice(2)"
        :key="index"
        class="flex flex-row justify-between items-center font-Prompt border-border border-b py-2"
      >
        <span class="text-sm md:text-base lg:text-lg"> {{ post.title }} </span>
        <RouterLink
          :to="`posts/${post.id}`"
          class="text-xs font-medium text-white bg-gradient-to-b from-button to-button/20 px-4 py-1 rounded-lg border-border border shadow-sm md:text-sm lg:text-base"
        >
          Read more
        </RouterLink>
      </div>
    </div>
  </div>
</template>
