<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import type { da } from 'vuetify/locale';

const route = useRoute();
const router = useRouter();

const id = ref<number>(NaN);
const from = ref<string>('user');
const title = ref('');
const description = ref('');
const date = ref('');
const isLoading = ref(true);
const isSubmitting = ref(false);
const errorMessages = ref<string[]>([]);
const showError = ref(false);

onMounted(async () => {
  id.value = Number(route.params.id);
  from.value = (route.query.from as string) || 'user';
  await fetchReview();
});

const fetchReview = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Missing token');
      alert('Session expired');
      return;
    }

    const res = await axios.get(`http://localhost:3000/reviews/${id.value}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const review = res.data;
    title.value = review.title || '';
    description.value = review.description || '';
    date.value = review.date?.split('T')[0] || new Date().toISOString().split('T')[0];
  } catch (error) {
    console.error('Error fetching review:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Session expired');
    return;
  }

  let userId = '';
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    userId = payload?.sub;
  } catch (e) {
    console.error('Invalid token format');
  }

  if (!userId) {
    console.error('Missing token or userId');
    return;
  }

  try {
    isSubmitting.value = true;
    await axios.put(`http://localhost:3000/reviews/${id.value}`, {
      title: title.value,
      description: description.value,
      date: date.value,
      userId: userId
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    redirectBack();
  } catch (error) {
    console.error('Update failed:', error);
    errorMessages.value = ['Failed to update review'];
    showError.value = true;
  } finally {
    isSubmitting.value = false;
  }
};

const redirectBack = () => {
  if (from.value === 'admin') {
    router.push('/admin/review');
  } else {
    router.push('/reviews');
  }
};

const closeErrorPopup = () => {
  showError.value = false;
};
</script>







<template>
  <div class="max-w-4xl mx-auto p-4 font-Prompt">
    <h1 class="text-center text-2xl font-bold mb-6 text-hightlight">Edit Review</h1>
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label class="block font-semibold mb-1">Title <span class="text-red-500">*</span></label>
        <input type="text" v-model="title" class="w-full border rounded-lg px-3 py-2" required />
      </div>

      <div class="mb-4">
        <label>Description <span class="text-red-500">*</span></label>
        <textarea
          v-model="description"
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
        <button
          type="button"
          @click="redirectBack"
          class="text-white text-xs font-bold bg-gradient-to-b from-button px-4 py-1.5 h-fit to-button/55 shadow-md rounded-lg lg:text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="text-white text-xs font-bold bg-gradient-to-b from-button px-4 py-1.5 h-fit to-button/55 shadow-md rounded-lg lg:text-sm"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>
