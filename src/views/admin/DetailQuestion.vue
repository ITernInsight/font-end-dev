<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const question = ref(null);
const comments = ref([]);
const commentText = ref('');
const showModal = ref(false)
const deleteId = ref(null);
const deleteTitle = ref('');
const editCommentId = ref(null);
const editText = ref('');
const deleteCommentId = ref(null);
const showCommentDelete = ref(false);
const id = Number(route.params.id);
const from = route.query.from || 'user';

const likeCount = computed(() => question.value?.like?.length || 0);


const user = ref<{ id?: number; name?: string; role?: string }>({});
const storedUser = localStorage.getItem('user');
if (storedUser) {
  user.value = JSON.parse(storedUser);
  user.value.name = 'Admin';
  localStorage.setItem('user', JSON.stringify(user.value));
}

// Fetch question data
const fetchQuestion = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`http://localhost:3000/questions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  question.value = response.data;
};

// Fetch comments data
const fetchComments = async () => {
  try {
    const res = await axios.get(`http://localhost:3000/questions/${id}/comment`);
    comments.value = Array.isArray(res.data.comments) ? res.data.comments.reverse() : [];
  } catch (err) {
    console.error('Error fetching comments:', err);
  }
};

// Submit new comment
const submitComment = async () => {
  // ตรวจสอบว่า user.id มีค่าหรือไม่
  if (!user.value || !user.value.id) {
    console.error('User is not logged in or does not have an ID');
    return;
  }


  const token = localStorage.getItem('token');
  const now = new Date();

  const res = await axios.post(`http://localhost:3000/questions/${id.value}/comment`, {
    text: commentText.value,
    date: now,
    user: user.value.id,  // ใช้ user.id แทน
    question: id.value,
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 201 || res.status === 200) {
    commentText.value = '';
    await fetchComments();
  }
};

// Edit comment functionality
const startEditComment = (comment) => {
  editCommentId.value = comment.id;
  editText.value = comment.text;
};

// Cancel editing comment
const cancelEditComment = () => {
  editCommentId.value = null;
  editText.value = '';
};

// Save edited comment
const saveCommentEdit = async () => {
  const token = localStorage.getItem('token');
  await axios.put(`http://localhost:3000/questions/${id}/comment/${editCommentId.value}`, {
    text: editText.value,
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });

  cancelEditComment();
  await fetchComments();
};

// Confirm delete comment
const confirmDeleteComment = (id) => {
  deleteCommentId.value = id;
  showCommentDelete.value = true;
};

// Delete comment
const deleteComment = async () => {
  const token = localStorage.getItem('token');
  await axios.delete(`http://localhost:3000/questions/${id}/comment/${deleteCommentId.value}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  showCommentDelete.value = false;
  await fetchComments();
};

// Cancel delete comment
const cancelDeleteComment = () => {
  showCommentDelete.value = false;
};

// Confirm delete comment
const confirmDelete = (id, title) => {
  deleteId.value = id;
  deleteTitle.value = title;
  showModal.value = true;
};

// Delete Question
const handleDeleteQuestion = async () => {
  const token = localStorage.getItem('token');
  await axios.delete(`http://localhost:3000/questions/${deleteId.value}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  showModal.value = false;
  if (user.value.role === 'admin') {
  router.push('/admin/question'); // หรือ '/admin/question'
} else {
  router.push('/questions'); // หรือ '/questions'
}

};

// Cancel delete Question
const cancelDeleteQuestion = () => {
  showModal.value = false;
};

// Format date
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleString();
};

onMounted(() => {
  fetchQuestion();
  fetchComments();
});
</script>

<template>
   <div class="font-Prompt flex flex-col w-full space-y-2 p-2 sm:px-12 md:px-16 lg:px-32 lg:py-4 xl:px-56 2xl:px-96">
    <div class="flex justify-between items-center mb-2">
      <h1 class="text-left text-2xl font-bold text-hightlight">Question</h1>
      <div class="text-sm text-gray-500 whitespace-nowrap">
        {{ likeCount }} Like {{ comments.length }} Comments
      </div>
    </div>
    <div v-if="question" class="flex flex-col border border-border rounded-lg p-6 gap-2 bg-white shadow-lg">
      <div class="mb-4">
        <h2 class="text-2xl font-extrabold">{{ question.title || 'No title available' }}</h2>
      </div>
      <p v-if="question.description" class="text-md text-gray-700 mb-4">{{ question.description }}</p>
      <p class="text-sm text-gray-500">Date: {{ formatDate(question.date) }}</p>
      <div class="flex gap-4 justify-end items-center">
        <router-link
          :to="{ path: from === 'admin' ? '/admin/edit-question/' + question.id : '/edit-question/' + question.id, query: { from } }"
          class="text-hightlight hover:underline">
          <i class="fas fa-edit"></i>
        </router-link>
        <button @click="confirmDelete(question.id, question.title)" class="text-hightlight hover:underline">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>

    <h3 class="text-2xl font-semibold mb-2 text-hightlight">Comment</h3>

    <!-- <div class="flex flex-col border border-border rounded-lg p-6 bg-white shadow-lg">
      <div class="flex items-center gap-2 mb-4">
        <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold uppercase text-xl">
          {{ user?.name?.charAt(0) || '?' }}
        </div>
        <div>
          <strong class="text-xl">{{ user?.name || 'Unknown' }}</strong>
        </div>
      </div>
      <div class="flex items-center border rounded-xl bg-gray-100 p-2 pr-3 ml-12">
        <textarea v-model="commentText" placeholder="Comment ..." class="flex-1 bg-transparent outline-none px-3 resize-none" rows="1"></textarea>
        <button @click="submitComment" :disabled="!commentText.trim()">
          <svg :class="['w-5 h-5', commentText.trim() ? 'text-blue-600' : 'text-gray-400']" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3.4 20.4l17.3-8.7c.5-.2.5-.9 0-1.1L3.4 2c-.5-.2-1 .2-1 .8v6.3c0 .3.2.5.5.6l11.2 2.3L2.9 14.4c-.3.1-.5.3-.5.6v6.2c0 .6.5 1 1 0.8z" />
          </svg>
        </button>
      </div> -->

    <div v-for="cmt in comments" :key="cmt.id" class="mb-4 border rounded-lg p-4">
      <div class="flex justify-between items-start mb-1">
        <div class="flex items-center gap-2">
          <div
            class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold uppercase">
            {{ cmt.user?.name?.charAt(0) || '?' }}
          </div>
          <div>
            <strong class="text-xl">{{ cmt.user?.name || 'Unknown' }}</strong>
            <div class="text-sm text-gray-400">{{ formatDate(cmt.date) }}</div>
          </div>
        </div>

        <!-- Admin สามารถลบหรือแก้ไขคอมเม้นต์ได้ -->
        <div v-if="user && (user.role === 'admin' || user.id === cmt.user?.id)" class="flex gap-2 text-sm text-gray-500">
          <button @click="startEditComment(cmt)"><i class="fas fa-pen"></i></button>
          <button @click="confirmDeleteComment(cmt.id)"><i class="fas fa-trash"></i></button>
        </div>
      </div>


      <div v-if="editCommentId === cmt.id">
        <textarea v-model="editText" class="w-full border rounded-md p-2 resize-none mb-2"></textarea>
        <div class="flex gap-2 justify-end">
          <button @click="saveCommentEdit" :disabled="editText.trim() === cmt.text.trim()" :class="[
            'text-white text-xs font-bold px-4 py-1.5 h-fit shadow-md rounded-lg lg:text-sm',
            editText.trim() === cmt.text.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-b from-button to-button/55'
          ]">
            Save
          </button>
          <button @click="cancelEditComment"
            class="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">Cancel</button>
        </div>
      </div>
      <p v-else class="text-base mt-1 ml-12">{{ cmt.text || '(no content)' }}</p>
    </div>
  </div>

  <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
    <div class="bg-white p-6 rounded-lg w-96 shadow-lg">
      <h3 class="text-lg font-bold mb-6 text-center">
        ⚠️ Are you sure you want to delete this question <span class="text-red-600">[ {{ deleteTitle }} ]</span>?
      </h3>
      <div class="flex justify-center gap-6">
        <button @click="handleDeleteQuestion" class="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">Confirm</button>
        <button @click="cancelDeleteQuestion" class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">Cancel</button>
      </div>
    </div>
  </div>

  <div v-if="showCommentDelete" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
    <div class="bg-white p-6 rounded-lg w-96 shadow-lg">
      <h3 class="text-lg font-bold mb-6 text-center">
        ⚠️ Delete this comment?
      </h3>
      <div class="flex justify-center gap-6">
        <button @click="deleteComment" class="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">Confirm</button>
        <button @click="cancelDeleteComment"
          class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">Cancel</button>
      </div>
    </div>
  </div>
</template>