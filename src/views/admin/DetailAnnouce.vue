<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import router from '@/router'

interface Company {
  id: number
  companyName: string
  description: string
  phone: string
}

// Define the Post interface
interface Post {
  id: number
  title: string
  description: string
  position: string[]
  startDate: Date | null
  endDate: Date
  company: Company
}

// Declare post object and loading state
const post = ref<Post | null>(null)
const isLoading = ref(true) // loading state
const route = useRoute()
const postId = route.params.id

const showModal = ref(false)
const postIdToDelete = ref<number | null>(null)

const fetchData = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/posts/${postId}`)
    // Extract relevant data directly from the single object response
    const postData = response.data
    post.value = {
      id: postData.id,
      title: postData.title,
      description: postData.description,
      position: postData.position,
      startDate: postData.startDate ? new Date(postData.startDate) : null,
      endDate: new Date(postData.endDate),
      company: {
        id: postData.company.id,
        companyName: postData.company.companyName,
        description: postData.company.description,
        phone: postData.company.phone,
      },
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchData)

const deleteAnnouncement = async (id: number) => {
  try {
    await axios.delete(`http://localhost:3000/posts/${id}`)
    router.push('/admin/annouce') // Redirect to announcements list after successful delete
  } catch (error) {
    console.error('Error deleting announcement:', error)
  }
}

const confirmDelete = (id: number) => {
  // Show the modal when the user clicks delete
  postIdToDelete.value = id
  showModal.value = true
}

const handleDelete = () => {
  if (postIdToDelete.value !== null) {
    deleteAnnouncement(postIdToDelete.value)
    showModal.value = false
  }
}

const cancelDelete = () => {
  showModal.value = false // Close the modal if the user cancels
}
const formatDate = (date: Date | null): string => {
  if (date === null) {
    return '' // Fallback value for null dates
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timeZone: 'Asia/Bangkok', // Thailand Time Zone
  }

  return new Intl.DateTimeFormat('en-GB', options).format(date).toUpperCase()
}
</script>

<template>
  <div
    class="font-Prompt flex flex-col w-full space-y-2 p-2 sm:px-12 md:px-16 lg:px-32 lg:py-4 xl:px-56 2xl:px-96"
  >
    <div v-if="isLoading" class="text-center">Loading...</div>
    <div v-else-if="post" class="flex flex-col border border-border rounded-lg p-6 gap-2">
      <div class="flex flex-row gap-x-4 items-center">
        <div class="w-[40px] h-[40px] bg-gray-600 rounded-full"></div>
        <h1 class="text-lg font-bold font-Prompt">{{ post.title }}</h1>
        <div class="ml-auto flex flex-row gap-4">
          <RouterLink :to="`/admin/edit-annouce/${post.id}`">
            <i class="fas fa-pen"></i>
          </RouterLink>
          <button @click="confirmDelete(post.id)">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
      <div class="flex flex-row items-center w-fit gap-4 text-base font-bold font-Prompt">
        Position Availiable: 
        <div class="border border-border w-fit p-2 rounded-lg">
        <div v-for="(position, index) in post.position" :key="index">
          <span>
            {{ position }}
          </span>
        </div>
      </div>
      </div>
      <div class="flex flex-row gap-2">
        <span class="text-sm font-bold font-Prompt">{{ formatDate(post.startDate) }}</span>
        <span v-if="post.startDate != null" class="text-sm font-Prompt"> - </span>
        <span v-if="post.startDate == null" class="text-sm font-Prompt"> DeadLine: </span>
        <span class="text-sm font-bold font-Prompt">{{ formatDate(post.endDate) }}</span>
      </div>
      <span class="text-sm font-Prompt">{{ post.description }}</span>
    </div>
    <div v-else class="text-center">Post not found</div>
  </div>

  <!-- Modal for delete confirmation -->
  <div
    v-if="showModal"
    class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white p-6 rounded-lg w-80">
      <h3 class="text-lg font-bold mb-4">
        Are you sure you want to delete this post
        <span class="text-lg font-bold mb-4 text-red-500"> [{{ post?.title }}] </span>
        ?
      </h3>
      <div class="flex justify-between gap-4">
        <button @click="handleDelete" class="w-full bg-red-600 text-white py-2 rounded-md">
          Confirm
        </button>
        <button @click="cancelDelete" class="w-full bg-gray-400 text-white py-2 rounded-md">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
