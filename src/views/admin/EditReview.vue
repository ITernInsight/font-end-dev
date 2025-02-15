<template>
  <div class="max-w-4xl mx-auto p-4 font-Prompt">
    <h1 class="text-center text-2xl font-bold mb-6 text-hightlight">Edit Review</h1>
    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <label class="block font-semibold mb-1">Title <span class="text-red-500">*</span></label>
        <input type="text" v-model="title" @input="handleInput" class="w-full border rounded-lg px-3 py-2" required />
      </div>

      <div class="mb-4">
        <label>Description <span class="text-red-500">*</span></label>
        <textarea
          v-model="description"
          @input="handleInput"
          class="w-full border rounded-lg px-3 py-2"
          rows="10"
          required
        ></textarea>
      </div>

      <div class="mb-4">
        <label>Date <span class="text-red-500">*</span></label>
        <input type="date" v-model="date" class="w-full border rounded-lg px-3 py-2" required />
      </div>

      <div class="flex justify-center space-x-4 mt-4">
        <RouterLink
          to="/admin/review"
          type="button"
          class="text-white text-xs font-bold bg-gradient-to-b from-button px-4 py-1.5 h-fit to-button/55 shadow-md rounded-lg lg:text-sm"
        >
          Cancel
        </RouterLink>
        <button
          type="submit"
          class="text-white text-xs font-bold bg-gradient-to-b from-button px-4 py-1.5 h-fit to-button/55 shadow-md rounded-lg lg:text-sm"
        >
          Submit
        </button>
      </div>
    </form>
  </div>

  <div
    v-if="showError && errorMessages.length > 0"
    class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white p-6 rounded-lg w-80">
      <h3 class="text-lg font-bold mb-4">
        <ul>
        <li v-for="(message, index) in errorMessages" :key="index">
          {{ message }}
        </li>
      </ul>
      </h3>
      <div class="flex justify-between gap-4">
        <button @click="closeErrorPopup" class="w-full bg-red-600 text-white py-2 rounded-md">
          Ok
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

// Admin ID (you can adjust this as needed)
const adminId = localStorage.getItem('adminId') || '1' // Replace with actual admin ID

// Ref to bind form data
const title = ref('')
const description = ref('')
const date = ref('')
const router = useRouter()
const route = useRoute()

const errorMessages = ref<string[]>([])
const showError = ref(false)

const profanityPattern = /(อี)?(เหี้ย|ดอก|ห่า|สัส|เวร|ควาย|สัด|ควย)/gi

const removeRepeatedCharacters = (text: string) => {
  return text.replace(/([ก-๙])\1+/g, '$1')
}

const containsProfanity = (text: string) => {
  const cleanedText = removeRepeatedCharacters(text)
  return profanityPattern.test(cleanedText)
}

const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement | HTMLTextAreaElement
  const cleanedText = removeRepeatedCharacters(input.value)
  if (containsProfanity(cleanedText)) {
    input.value = cleanedText.replace(profanityPattern, "")
    input.setCustomValidity("กรุณาใช้คำที่สุภาพ")
    input.reportValidity()
  } else {
    input.setCustomValidity("")
    input.reportValidity()
  }
}

const validateForm = (): boolean => {
  errorMessages.value = []
  if (containsProfanity(title.value)) {
    errorMessages.value.push('Title contains inappropriate language.')
  }
  if (containsProfanity(description.value)) {
    errorMessages.value.push('Description contains inappropriate language.')
  }
  if (!title.value.trim()) {
    errorMessages.value.push('Title should not be empty.')
  }
  if (!description.value.trim()) {
    errorMessages.value.push('Description should not be empty.')
  }
  if (errorMessages.value.length > 0) {
    showError.value = true
    return false
  }
  return true
}

// Function to handle form submission
const editReview = async () => {
  if (!validateForm()) {
    return
  }
  try {
    const response = await axios.put(`http://localhost:3000/reviews/${route.params.id}`, {
      userId: adminId, // Ensure userId is sent as a string
      title: title.value,
      description: description.value,
      date: date.value, // Use the selected date
    })

    router.push('/admin/review')
    console.log('Review updated successfully:', response.data)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      const messages = error.response.data.message
      console.log('Validation errors:', messages)
      errorMessages.value = messages
    } else {
      console.error('Error updating review:', error)
    }
  }
}

const submitForm = () => {
  if (validateForm()) {
    editReview()
  }
}

const fetchReview = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/reviews/${route.params.id}`)
    const review = response.data
    title.value = review.title
    description.value = review.description
    date.value = review.date.split('T')[0] // Ensure the date is in the correct format for the input field
  } catch (error) {
    console.error('Error fetching review:', error)
  }
}

onMounted(fetchReview)

const closeErrorPopup = () => {
  showError.value = false
}
</script>
