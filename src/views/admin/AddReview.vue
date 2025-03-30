<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const adminId = 1; // Replace with actual admin ID
const title = ref('');
const description = ref('');
const date = ref('');
const router = useRouter();

const errorMessages = ref<string[]>([]);
const showError = ref(false);

// Set the minimum date to today
const today = new Date();
const minDate = today.toISOString().split('T')[0];
date.value = minDate;

const profanityPattern = /(อี)?(เหี้ย|ดอก|ห่า|สัส|เวร|ควาย|สัด|ควย)/gi;

const removeRepeatedCharacters = (text: string) => {
  return text.replace(/([ก-๙])\1+/g, '$1');
};

const containsProfanity = (text: string) => {
  const cleanedText = removeRepeatedCharacters(text);
  return profanityPattern.test(cleanedText);
};

const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement | HTMLTextAreaElement;
  const cleanedText = removeRepeatedCharacters(input.value);
  if (containsProfanity(cleanedText)) {
    input.value = cleanedText.replace(profanityPattern, '');
    input.setCustomValidity('กรุณาใช้คำที่สุภาพ');
    input.reportValidity();
  } else {
    input.setCustomValidity('');
    input.reportValidity();
  }
};

const validateForm = () => {
  errorMessages.value = [];
  if (containsProfanity(title.value)) {
    errorMessages.value.push('Title contains inappropriate language.');
  }
  if (containsProfanity(description.value)) {
    errorMessages.value.push('Description contains inappropriate language.');
  }
  if (errorMessages.value.length > 0) {
    showError.value = true;
    return false;
  }
  return true;
};

// Function to handle form submission
const addReview = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Unauthorized: No token found');
    }

    const response = await axios.post(
      'http://localhost:3000/reviews',
      {
        userId:1,
        title: title.value,
        description: description.value,
        date: date.value,
        adminId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    router.push('/admin/review');
    console.log('Review added successfully:', response.data);
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      const messages = error.response.data.message;
      console.log('Validation errors:', messages);

      // แปลงข้อความข้อผิดพลาดให้เป็น Array (รองรับข้อความหลายบรรทัด)
      errorMessages.value = Array.isArray(messages) ? messages : [messages];
      showError.value = true;
    } else {
      console.error('Error adding review:', error);
      errorMessages.value = ['An unexpected error occurred. Please try again later.'];
      showError.value = true;
    }
  }
};

const submitForm = () => {
  if (validateForm()) addReview()
}


const closeErrorPopup = () => {
  showError.value = false;
};

const redirectAfterSubmit = () => {
  const from = route.query.from;
  if (from === 'admin') {
    router.push('/admin/review');
  } else {
    router.push('/reviews');
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-4 font-Prompt">
    <h1 class="text-center text-2xl font-bold mb-6 text-hightlight">Add Review</h1>
    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <label class="block font-semibold mb-1">Title <span class="text-red-500">*</span></label>
        <input
          type="text"
          v-model="title"
          @input="handleInput"
          class="w-full border rounded-lg px-3 py-2"
          required
        />
      </div>

      <div class="mb-4">
        <label>Description <span class="text-red-500">*</span></label>
        <textarea
          v-model="description"
          @input="handleInput"
          class="w-full border rounded-lg px-3 py-2"
          rows="5"
          required
        ></textarea>
      </div>

      <div class="mb-4">
        <label>Date <span class="text-red-500">*</span></label>
        <input
          type="date"
          v-model="date"
          :min="minDate"
          class="w-full border rounded-lg px-3 py-2"
          required
        />
      </div>

      <div class="flex justify-center space-x-4 mt-4">
        <RouterLink
          to="/admin/review"
          @click="redirectAfterSubmit"
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

  <!-- Error Popup -->
  <div
    v-if="showError && errorMessages.length > 0"
    class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white p-6 rounded-lg w-80">
      <h3 class="text-lg font-bold mb-4">Validation Errors</h3>
      <ul class="list-disc list-inside text-red-500">
        <li v-for="(message, index) in errorMessages" :key="index">
          {{ message }}
        </li>
      </ul>
      <div class="flex justify-between gap-4 mt-4">
        <button
          @click="closeErrorPopup"
          class="w-full bg-red-600 text-white py-2 rounded-md"
        >
          Ok
        </button>
      </div>
    </div>
  </div>
</template>
