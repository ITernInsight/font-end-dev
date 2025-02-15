<template>
  
  <div class="font-Prompt flex flex-col w-full space-y-2 p-2 sm:px-12 md:px-16 lg:px-32 lg:py-4 xl:px-56 2xl:px-96">
    <h1 class="text-left text-xl font-bold mb-2 text-hightlight">Review Detail</h1>
    <div v-if="review" class="flex flex-col border border-border rounded-lg p-6 gap-2 bg-white shadow-lg">
      <div class="mb-4">
        <h2 class="text-2xl font-extrabold">{{ review.title || 'No title available' }}</h2>
      </div>
      <p v-if="review.description" class="text-md leading-relaxed text-gray-700 mb-4">
        {{ review.description }}
      </p>
      <p v-if="review.date" class="text-sm text-gray-500">
        Date: {{ formatDate(review.date) }}
      </p>
      <p v-if="review.created_at" class="text-sm text-gray-500">
        Created at: {{ formatDateTime(review.created_at) }}
      </p>
      <p v-if="review.updated_at" class="text-sm text-gray-500">
        Updated at: {{ formatDateTime(review.updated_at) }}
      </p>
      <div class="flex justify-end gap-4 mb-4">
        <RouterLink :to="`/admin/edit-review/${review.id}`" class="text-hightlight hover:underline">
          <i class="fas fa-edit"></i>
        </RouterLink>
        <button @click="confirmDelete(review.id, review.title)" class="text-hightlight hover:underline">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
    <div v-else class="text-center text-gray-500 text-lg">Loading...</div>
  </div>

  <!-- Modal for delete confirmation -->
  <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
    <div class="bg-white p-6 rounded-lg w-96 shadow-lg">
      <h3 class="text-lg font-bold mb-6 text-center">
        ⚠️ Are you sure you want to delete this review 
        <span class="text-red-600">[ {{ deleteTitle }} ]</span>?
      </h3>
      <div class="flex justify-center gap-6">
        <button @click="handleDelete" class="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">Confirm</button>
        <button @click="cancelDelete" class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">Cancel</button>
      </div>
    </div>
  </div>

  <!-- Modal for error message -->
  <div v-if="showErrorModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
    <div class="bg-white p-6 rounded-lg w-96 shadow-lg">
      <h3 class="text-lg font-bold mb-6 text-center text-red-600">
        ❌ Failed to delete review: {{ errorMessage }}
      </h3>
      <div class="flex justify-center">
        <button @click="closeErrorModal" class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const review = ref<any>(null)
const showModal = ref(false)
const showErrorModal = ref(false)
const deleteId = ref<number | null>(null)
const deleteTitle = ref('')
const errorMessage = ref('')

const fetchReview = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/reviews/${route.params.id}`)
    review.value = response.data || {}
  } catch (error) {
    console.error('Error fetching review:', error)
  }
}

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

function formatDateTime(dateTimeString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateTimeString).toLocaleDateString(undefined, options) + ' ' + new Date(dateTimeString).toLocaleTimeString(undefined, options)
}

const confirmDelete = (id: number, title: string) => {
  deleteId.value = id
  deleteTitle.value = title
  showModal.value = true
}

const handleDelete = async () => {
  if (deleteId.value !== null) {
    try {
      await axios.delete(`http://localhost:3000/reviews/${deleteId.value}`)
      showModal.value = false
      router.push('/admin/review')
    } catch (error) {
      console.error('Error deleting review:', error)
      errorMessage.value = error.response ? error.response.data.message : error.message
      showErrorModal.value = true
    }
  }
}

const cancelDelete = () => {
  showModal.value = false
  deleteId.value = null
  deleteTitle.value = ''
}

const closeErrorModal = () => {
  showErrorModal.value = false
  errorMessage.value = ''
}

onMounted(fetchReview)
</script>
