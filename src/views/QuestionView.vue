<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import FilterComp from '@/components/FilterComp.vue';

const questions = ref<any[]>([]);
const route = useRoute();
const router = useRouter();
const showModal = ref(false);
const deleteId = ref<number | null>(null);
const deleteTitle = ref('');
const id = route.params.id;

// ตัวแปรสำหรับ Search Bar & Date Filter
const searchKeyword = ref('');
const selectedPosition = ref('');
const startDate = ref('');
const endDate = ref('');
const date = ref('');

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

const toggleLike = async (review: Review) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Unauthorized: No token found');
    }

    // ส่งคำขอไปยัง API
    await axios.post(
      `http://localhost:3000/reviews/${review.id}/like`,
      { liked: !review.likedByUser },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // อัปเดตสถานะ liked ใน Frontend
    review.likedByUser = !review.likedByUser;
    console.log('Like status updated successfully');
  } catch (error) {
    console.error('Error toggling like status', error);
  }
};

// โหลดข้อมูลคำถามจาก API
const fetchQuestions = async () => {
  try {
    const token = localStorage.getItem('token'); // ดึง Token จาก Local Storage
    if (!token) {

      throw new Error('Unauthorized: No token found');
    }

    const response = await axios.get('http://localhost:3000/questions', {
      headers: {
        Authorization: `Bearer ${token}`, // ส่ง Token ใน Header
      },
    });

    questions.value = response.data;
    console.log('Questions fetched successfully:', response.data);
  } catch (error: any) {
    console.error('Error fetching questions:', error);
    if (error.response && error.response.status === 401) {
      alert('Unauthorized: Please log in again.');
      router.push('/login'); // เปลี่ยนเส้นทางไปยังหน้า Login
    }
  }
};

// ฟังก์ชันกรองข้อมูลคำถาม
const filteredQuestions = computed(() => {
  return questions.value.filter((question) => {
    const matchesSearch =
      question.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      question.description.toLowerCase().includes(searchKeyword.value.toLowerCase());

    const matchesPosition = !selectedPosition.value || question.position === selectedPosition.value;

    const questionDate = new Date(question.date);
    const matchesDateRange =
      (!startDate.value || questionDate >= new Date(startDate.value)) &&
      (!endDate.value || questionDate <= new Date(endDate.value));

    return matchesSearch && matchesPosition && matchesDateRange;
  });
});

// เรียงลำดับให้คำถามล่าสุดอยู่ด้านบน
const sortedQuestions = computed(() => {
  return filteredQuestions.value.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

// แสดง Modal ยืนยันการลบ
const confirmDelete = (id: number, title: string) => {
  deleteId.value = id;
  deleteTitle.value = title;
  showModal.value = true;
};

// ฟังก์ชันลบคำถาม
const handleDelete = async () => {
  if (deleteId.value !== null) {
    try {
      const token = localStorage.getItem('token'); // ดึง Token จาก Local Storage
      if (!token) {
        throw new Error('Unauthorized: No token found');
      }

      await axios.delete(`http://localhost:3000/questions/${deleteId.value}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ส่ง Token ใน Header
        },
      });

      questions.value = questions.value.filter((question) => question.id !== deleteId.value);
      showModal.value = false;
      deleteId.value = null;
      deleteTitle.value = '';
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  }
};

// ยกเลิกการลบ
const cancelDelete = () => {
  showModal.value = false;
  deleteId.value = null;
  deleteTitle.value = '';
};

// ฟังก์ชันจัดรูปแบบวันที่เท่านั้น
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// โหลดข้อมูลเมื่อ Component ถูกสร้าง
onMounted(fetchQuestions);

// State to manage dropdown visibility
const isDropdownOpen = ref(false);


</script>


<template>
  <!-- ปุ่ม Add Question -->
  <RouterLink :to="{ path: '/admin/add-question', query: { from: 'user' } }"
    class="mt-2 mb-2 text-white it text-xs font-bold bg-gradient-to-b from-button px-4 py-1.5 h-fit to-button/50 shadow-md rounded-lg lg:text-sm">
    Add question
  </RouterLink>


  <!-- 🔍 Search Bar & Date Filters -->
  <FilterComp class="mt-2" @updateSearch="searchKeyword = $event" @updateDate="date = $event" />


  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-16 mt-8">
    <div v-for="question in sortedQuestions" :key="question.id" class="border p-4 rounded-lg bg-white shadow">
      <h2 class="text-lg font-bold truncate">{{ question.title }}</h2>
      <p class="text-sm mt-2 text-gray-700 line-clamp-2">{{ question.description.substring(0, 60) }}...</p>
      <small class="text-xs text-gray-400">{{ formatDate(question.date) }}</small>
      <div class="flex justify-between items-center mt-3">
        <router-link :to="{ path: `/questions/${question.id}` }"
          class="bg-gradient-to-b from-button to-button/55 text-white py-1 px-3 rounded">
          Read more
        </router-link>
        <!-- Like Button -->
 <!-- Like Button -->
 <button @click="toggleLike(question)" class="text-xl transition duration-200 focus:outline-none">
  <i
    :class="[ 
      'fas', 
      'fa-heart', 
      question.likedByUser ? 'text-red-500' : 'text-gray-400' 
    ]"
  ></i>
</button>
      </div>
    </div>
  </div>


  <!-- Modal for delete confirmation -->
  <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
    <div class="bg-white p-6 rounded-lg w-96 shadow-lg">
      <h3 class="text-lg font-bold mb-6 text-center">
        ⚠️ Are you sure you want to delete this post
        <span class="text-red-600">[ {{ deleteTitle }} ]</span>?
      </h3>
      <div class="flex justify-center gap-6">
        <button @click="handleDelete" class="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">Confirm</button>
        <button @click="cancelDelete" class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">Cancel</button>
      </div>
    </div>
  </div>
</template>
