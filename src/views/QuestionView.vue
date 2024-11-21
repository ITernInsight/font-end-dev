<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import Filter from '../components/FilterComp.vue'

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
  return new Date(date).toLocaleDateString('en-US', options)
}

interface Review {
  Review_ID: number
  Title: string
  Position: string
  Description: string
  Date: Date
  Like_Count: number
  IsQuestion: boolean
  userName: string
}

const reviews = ref<Review[]>([])
const isLoading = ref(true) // loading state
const searchKeyword = ref('') // search keyword
const selectedPosition = ref('') // position filter
const startDate = ref('') // start date filter
const endDate = ref('') // end date filter

const fetchData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/question')
    reviews.value = response.data
  } catch (error) {
    console.error('Error fetching data', error)
  } finally {
    isLoading.value = false // data fetch completed
  }
}

const positions = computed(() => {
  const uniquePositions = new Set(reviews.value.map((review) => review.Position))
  return Array.from(uniquePositions)
})

// Filtered reviews based on search keyword, selected position, and date range
const filteredReviews = computed(() => {
  return reviews.value.filter((review) => {
    const matchesSearch =
      review.Title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      review.Description.toLowerCase().includes(searchKeyword.value.toLowerCase())
    const matchesPosition = !selectedPosition.value || review.Position === selectedPosition.value // only match if position is selected

    const reviewDate = new Date(review.Date)
    const matchesDateRange =
      (!startDate.value || reviewDate >= new Date(startDate.value)) &&
      (!endDate.value || reviewDate <= new Date(endDate.value))

    return matchesSearch && matchesPosition && matchesDateRange
  })
})

onMounted(fetchData)
</script>

<template>
  <Filter
    class="mt-2"
    @updateSearch="searchKeyword = $event"
    @updatePosition="selectedPosition = $event"
    @updateStartDate="startDate = $event"
    @updateEndDate="endDate = $event"
    :positions="positions"
  />
  <div
    class="font-Prompt px-2 space-y-2 mt-2 w-full sm:px-12 md:px-16 lg:px-32 lg:py-4 xl:px-56 2xl:px-96"
  >
    <div class="flex flex-wrap justify-around gap-x-1 gap-y-2">
      <div
        v-for="(post, index) in filteredReviews"
        :key="index"
        class="flex flex-col items-start font-Prompt border-border border rounded-md gap-y-2 p-2 w-2/3 md:w-[45%] lg:w-[32%]"
      >
        <span class="text-sm text-hightlight font-bold">
          {{ post.Title }}
        </span>
        <span class="text-xs text-hightlight font-bold">
          {{ formatDate(post.Date) }}
        </span>
        <span class="text-xs text-text">
          {{ post.Description }}
        </span>
        <RouterLink
          :to="`questions/${post.Review_ID}`"
          class="text-xs font-medium text-white bg-gradient-to-b from-button to-button/40 px-4 py-1 rounded-lg border-border border shadow-sm md:text-sm lg:text-base"
        >
          Read more
        </RouterLink>
      </div>
    </div>
  </div>
</template>
