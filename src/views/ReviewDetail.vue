<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const review = ref<any>(null);
const showModal = ref(false);
const deleteId = ref<number | null>(null);
const deleteTitle = ref('');
const id = Number(route.params.id);
const from = route.query.from || 'user';

const fetchReview = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const response = await axios.get(`http://localhost:3000/reviews/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    review.value = response.data;
  } catch (error) {
    console.error('Error fetching review:', error);
  }
};

const confirmDelete = (id: number, title: string) => {
  deleteId.value = id;
  deleteTitle.value = title;
  showModal.value = true;
};

const redirectBack = () => {
  if (from === 'admin') {
    router.push('/admin/review');
  } else {
    router.push('/reviews');
  }
};

const handleDelete = async () => {
  if (deleteId.value !== null) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      await axios.delete(`http://localhost:3000/reviews/${deleteId.value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showModal.value = false;
      redirectBack();
    } catch (error) {
      console.error('Error deleting review:', error);
      showModal.value = false;
    }
  }
};

const cancelDelete = () => {
  showModal.value = false;
  deleteId.value = null;
  deleteTitle.value = '';
};

onMounted(fetchReview);
</script>

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
        Date: {{ new Date(review.date).toLocaleDateString('en-GB') }}
      </p>
      <p v-if="review.created_at" class="text-sm text-gray-500">
        Created at: {{ new Date(review.created_at).toLocaleString() }}
      </p>
      <p v-if="review.updated_at" class="text-sm text-gray-500">
        Updated at: {{ new Date(review.updated_at).toLocaleString() }}
      </p>
      <div class="flex gap-4 justify-end items-center">
        <router-link :to="{ path: from === 'admin' ? '/admin/edit-review/' + review.id : '/edit-review/' + review.id, query: { from } }" class="text-hightlight hover:underline">
          <i class="fas fa-edit"></i>
        </router-link>
        <button @click="confirmDelete(review.id, review.title)" class="text-hightlight hover:underline">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
    <div v-else class="text-center text-gray-500 text-lg">Loading...</div>
  </div>

  <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
    <div class="bg-white p-6 rounded-lg w-96 shadow-lg">
      <h3 class="text-lg font-bold mb-6 text-center">
        ⚠️ Are you sure you want to delete this review <span class="text-red-600">[ {{ deleteTitle }} ]</span>?
      </h3>
      <div class="flex justify-center gap-6">
        <button @click="handleDelete" class="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">Confirm</button>
        <button @click="cancelDelete" class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">Cancel</button>
      </div>
    </div>
  </div>
</template>
