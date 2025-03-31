<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import axios from 'axios';
import Filter from '../components/FilterComp.vue';

// ฟังก์ชันการฟอร์แมทวันที่
const formatDate = (date: string | Date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

interface Review {
  id: number;
  title: string;
  position?: string;
  description: string;
  date: Date;
  company?: string;
  userName?: string;
  likedByUser?: boolean;
}

const reviews = ref<Review[]>([]);
const isLoading = ref(true);
const searchKeyword = ref('');
const selectedPosition = ref('');
const startDate = ref('');
const endDate = ref('');
const router = useRouter();

// ตรวจสอบการหมดอายุของ Token
const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT Payload
  const currentTime = Math.floor(Date.now() / 1000); // เวลาปัจจุบันในรูปแบบ Unix Timestamp

  return payload.exp > currentTime; // ตรวจสอบว่า Token ยังไม่หมดอายุ
};

// ถ้า token หมดอายุให้ลบ token และเปลี่ยนเส้นทางไปยังหน้า Login
if (!isTokenValid()) {
  alert('Session expired. Please log in again.');
  localStorage.removeItem('token');
  router.push('/login');
}

const fetchData = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Unauthorized: No token found');
    }

    const response = await axios.get('http://localhost:3000/reviews', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    reviews.value = response.data;
  } catch (error) {
    console.error('Error fetching data', error);
  } finally {
    isLoading.value = false;
  }
};

// ฟังก์ชันการ toggle like
const toggleLike = async (review: Review) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Unauthorized: No token found');
    }

    await axios.post(
      `http://localhost:3000/reviews/${review.id}/like`,
      { liked: !review.likedByUser },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    review.likedByUser = !review.likedByUser;
    console.log('Like status updated successfully');
  } catch (error) {
    console.error('Error toggling like status', error);
  }
};

// กรองตำแหน่งที่ไม่ซ้ำ
const positions = computed(() => {
  const uniquePositions = new Set(reviews.value.map((review) => review.position).filter(Boolean));
  return Array.from(uniquePositions) as string[];
});

// การกรองรีวิวที่แสดง
const filteredReviews = computed(() => {
  return reviews.value.filter((review) => {
    const matchesSearch =
      review.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      review.description.toLowerCase().includes(searchKeyword.value.toLowerCase());

    const matchesPosition = !selectedPosition.value || review.position === selectedPosition.value;

    const reviewDate = new Date(review.date);
    const matchesDateRange =
      (!startDate.value || reviewDate >= new Date(startDate.value)) &&
      (!endDate.value || reviewDate <= new Date(endDate.value));

    return matchesSearch && matchesPosition && matchesDateRange;
  });
});

// การจัดเรียงรีวิวตามวันที่
const sortedReviews = computed(() => {
  return filteredReviews.value.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

onMounted(fetchData);
</script>


<template>
  <div class="flex justify-end px-16 mt-4">
    <RouterLink
      :to="{ path: '/admin/add-review', query: { from: 'user' } }"
      class="bg-gradient-to-b from-button to-button/50 text-white px-4 py-2 rounded-lg shadow-md"
    >
      Add review
    </RouterLink>
  </div>

  <!-- Filter Component -->
  <Filter
    class="mt-4"
    @updateSearch="searchKeyword = $event"
    @updatePosition="selectedPosition = $event"
    @updateStartDate="startDate = $event"
    @updateEndDate="endDate = $event"
    :positions="positions"
  />

  <!-- Review Cards -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-16 mt-8 mb-8">
    <div
      v-for="review in sortedReviews"
      :key="review.id"
      class="border border-border p-4 rounded-lg bg-white shadow"
    >
      <h2 class="text-lg font-bold text-hightlight truncate">{{ review.title }}</h2>
      <p v-if="review.company" class="text-sm font-medium text-gray-600 truncate">{{ review.company }}</p>
      <p v-else-if="review.position" class="text-sm font-medium text-gray-600 truncate">{{ review.position }}</p>
      <p class="text-sm mt-2 text-gray-700 line-clamp-2">{{ review.description.substring(0, 60) }}...</p>
      <small class="text-xs text-gray-400">{{ formatDate(review.date) }}</small>
      <div class="flex justify-between items-center mt-3">
        <RouterLink
          :to="`reviews/${review.id}`"
          class="text-xs font-medium text-white bg-gradient-to-b from-button to-button/40 px-4 py-1 rounded-lg border-border border shadow-sm md:text-sm lg:text-base"
        >
          Read more
        </RouterLink>

        <!-- Like Button -->
        <div class="flex items-center">
          <button @click="toggleLike(review)" class="text-xl transition duration-200 focus:outline-none">
            <i
              :class="[
                'fas',
                'fa-heart',
                review.likedByUser ? 'text-red-500' : 'text-gray-400'
              ]"
            ></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Empty State -->
  <div v-if="sortedReviews.length === 0 && !isLoading" class="flex flex-col items-center justify-center py-12">
    <p class="text-gray-500 font-medium">No reviews found</p>
  </div>

  <!-- Loading Spinner -->
  <div v-if="isLoading" class="flex justify-center py-12">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-hightlight"></div>
  </div>
</template>
