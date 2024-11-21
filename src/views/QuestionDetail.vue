<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

// Define the Post interface
interface Question {
  Review_ID: number
  Title: string
  Position: string
  Description: string
  Date: Date
  Like_Count: number
  IsQuestion: boolean
  userName: string
}


const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
  return new Date(date).toLocaleDateString('en-US', options)
}

// Declare post object and loading state
const question = ref<Question | null>(null)
const isLoading = ref(true) // loading state
const route = useRoute()
const questionId = route.params.id

const fetchData = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/question/${questionId}`)
    question.value = response.data
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
    class="flex flex-col w-full space-y-2 p-2 sm:px-12 md:px-16 lg:px-32 lg:py-4 xl:px-56 2xl:px-96"
  >
    <div v-if="isLoading" class="text-center">Loading...</div>
    <div v-else-if="question" class="flex flex-col border border-border rounded-lg p-6 gap-2">
      <div class="flex flex-row gap-x-4 items-center">
        <div class="w-[40px] h-[40px] bg-gray-600 rounded-full"></div>
        <h1 class="text-lg font-bold font-Prompt">{{ question.Title }}</h1>
      </div>
      <span class="text-base font-bold font-Prompt">{{ question.Position }}</span>
      <span class="text-sm font-Prompt">{{ formatDate(question.Date) }}</span>
      <span class="text-xs font-Prompt">{{ question.Description }}</span>
    </div>
    <div v-else class="text-center">Post not found</div>
  </div>
</template>
