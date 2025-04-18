<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_ROOT_API

// กำหนดประเภทให้กับตัวแปรต่าง ๆ
interface User {
  id: number;
  name: string;
}

interface Comment {
  id: number;
  text: string;
  user: User;
  date: string;
}

interface Question {
  id: number;
  title: string;
  description: string;
  date: string;
  user: User;
  like: unknown[];
}

const route = useRoute();
const router = useRouter();

// กำหนดประเภทให้กับตัวแปรที่ใช้ใน ref
const id = Number(route.params.id);
const from = route.query.from || 'user';

const question = ref<Question | null>(null);  // ใช้ประเภท Question หรือ null
const comments = ref<Comment[]>([]);  // ใช้ประเภท Comment[]
const commentText = ref<string>('');  // ใช้ประเภท string
const showModal = ref(false);
const deleteId = ref<number | null>(null);
const deleteTitle = ref<string>('');
// const isLoading = ref(true);
const editCommentId = ref<number | null>(null);
const editText = ref<string>('');
const deleteCommentId = ref<number | null>(null);
const showCommentDelete = ref(false);
const likeCount = computed(() => question.value?.like?.length || 0);

const user = ref<User | null>(null);  // ใช้ประเภท User หรือ null

onMounted(() => {
  const stored = localStorage.getItem('user');
  if (stored) {
    user.value = JSON.parse(stored);
  }
  fetchQuestion();
  fetchComments();
  console.log('✅ user from localStorage:', user.value);
});

const fetchQuestion = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`https://capstone24.sit.kmutt.ac.th/un3/api/questions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  question.value = response.data || {};
  console.log('Loaded question:', question.value);
};

const fetchComments = async () => {
  try {
    const res = await axios.get(`https://capstone24.sit.kmutt.ac.th/un3/api/questions/${id}/comment`);
    comments.value = Array.isArray(res.data.comments) ? res.data.comments.reverse() : [];
  } catch (err) {
    console.error('Error fetching comments:', err);
  }
};

const submitComment = async () => {
  const token = localStorage.getItem('token');
  const now = new Date();

  const res = await axios.post(`https://capstone24.sit.kmutt.ac.th/un3/api/questions/${id}/comment`, {
    text: commentText.value,
    date: now,
    user: user.value?.id,  // ป้องกันการใช้ null
    question: id,
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 201 || res.status === 200) {
    commentText.value = '';
    await fetchComments();
  }
};

const startEditComment = (comment: Comment) => {
  editCommentId.value = comment.id;
  editText.value = comment.text;
};

const cancelEditComment = () => {
  editCommentId.value = null;
  editText.value = '';
};

const saveCommentEdit = async () => {
  const token = localStorage.getItem('token');
  await axios.put(`https://capstone24.sit.kmutt.ac.th/un3/api/questions/${id}/comment/${editCommentId.value}`, {
    text: editText.value,
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });

  cancelEditComment();
  await fetchComments();
};

const confirmDeleteComment = (id: number) => {
  deleteCommentId.value = id;
  showCommentDelete.value = true;
};

const deleteComment = async () => {
  const token = localStorage.getItem('token');
  await axios.delete(`https://capstone24.sit.kmutt.ac.th/un3/api/questions/${id}/comment/${deleteCommentId.value}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  showCommentDelete.value = false;
  await fetchComments();
};

const cancelDeleteComment = () => {
  showCommentDelete.value = false;
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleString();
};

const confirmDelete = (qid: number, title: string) => {
  deleteId.value = qid;
  deleteTitle.value = title;
  showModal.value = true;
};

const redirectBack = () => {
  if (from === 'admin') {
    router.push('/admin/question');
  } else {
    router.push('/questions');
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

      await axios.delete(`https://capstone24.sit.kmutt.ac.th/un3/api/questions/${deleteId.value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showModal.value = false;
      redirectBack();
    } catch (error) {
      console.error('Error deleting question:', error);
      showModal.value = false;
    }
  }
};

const cancelDelete = () => {
  showModal.value = false;
  deleteId.value = null;
  deleteTitle.value = '';
};

onMounted(() => {
  fetchQuestion();
  fetchComments();
});
</script>





<template>
  <div class="font-Prompt flex flex-col w-full space-y-2 p-2 sm:px-12 md:px-16 lg:px-32 lg:py-4 xl:px-56 2xl:px-96">
    <div class="flex justify-between items-center mb-2">
      <h1 class="text-left text-2xl font-bold text-hightlight">Question Detail</h1>
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
      <div
  v-if="question?.user && user && Number(user.id) === Number(question.user.id)"
  class="flex gap-2 justify-end items-center mt-2"
>
  <router-link
    :to="{ path: from === 'admin' ? '/admin/edit-question/' + question.id : '/edit-question/' + question.id, query: { from } }"
    class="text-hightlight hover:underline"
  >
    <i class="fas fa-edit"></i>
  </router-link>
  <button
    @click="confirmDelete(question.id, question.title)"
    class="text-hightlight hover:underline"
  >
    <i class="fas fa-trash"></i>
  </button>
</div>

    </div>

    <!-- Comment section -->
    <h3 class="text-2xl font-semibold mb-2 text-hightlight">Comment</h3>

    <!-- Comment input and send button -->
    <div class="bg-white shadow rounded-lg p-4 mt-4 border border-gray-300">
      <div class="flex items-center gap-2 mb-4">
        <div
          class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold uppercase text-xl">
          {{ user?.name?.charAt(0) || '?' }}
        </div>
        <div>
          <strong class="text-xl">{{ user?.name || 'Unknown' }}</strong>
        </div>
      </div>
      <div class="flex items-center border rounded-xl bg-gray-100 p-2 pr-3 ml-12">
        <textarea v-model="commentText" placeholder="Comment ..."
          class="flex-1 bg-transparent outline-none px-3 resize-none" rows="1"></textarea>
        <button @click="submitComment" :disabled="!commentText.trim()">
          <svg :class="['w-5 h-5', commentText.trim() ? 'text-blue-600' : 'text-gray-400']" fill="currentColor"
            viewBox="0 0 24 24">
            <path
              d="M3.4 20.4l17.3-8.7c.5-.2.5-.9 0-1.1L3.4 2c-.5-.2-1 .2-1 .8v6.3c0 .3.2.5.5.6l11.2 2.3L2.9 14.4c-.3.1-.5.3-.5.6v6.2c0 .6.5 1 1 0.8z" />
          </svg>
        </button>
      </div>
    </div>

    <div v-for="cmt in comments" :key="cmt.id" class="mb-4 border rounded-lg p-4">
      <div class="flex justify-between items-start mb-1">
        <div class="flex items-center gap-2">
          <div
            class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold uppercase text-xl">
            {{ cmt.user?.name?.charAt(0) || '?' }}
          </div>
          <div>
            <strong class="text-xl">{{ cmt.user?.name || 'Unknown' }}</strong>
            <div class="text-sm text-gray-400">{{ formatDate(cmt.date) }}</div>
          </div>
        </div>
        <div v-if="user && user.id === cmt.user?.id" class="flex gap-2 text-sm text-gray-500">
          <button @click="startEditComment(cmt)"><i class="fas fa-pen"></i></button>
          <button @click="confirmDeleteComment(cmt.id)"><i class="fas fa-trash"></i></button>
        </div>
      </div>

      <p class="text-xs text-gray-500">
  Debug: user.id = {{ user?.id }} | question.user.id = {{ question?.user?.id }}
</p>


      <div v-if="editCommentId === cmt.id">
        <textarea v-model="editText" class="w-full border rounded-md p-2 resize-none mb-2"></textarea>
        <div class="flex gap-2 justify-end">
          <button @click="saveCommentEdit"
            :disabled="editText.trim() === comments.find(c => c.id === editCommentId)?.text.trim()" :class="[
              'text-white text-xs font-bold px-4 py-1.5 h-fit shadow-md rounded-lg lg:text-sm',
              editText.trim() === comments.find(c => c.id === editCommentId)?.text.trim()
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

    <!-- Confirm delete modal for post -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div class="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h3 class="text-lg font-bold mb-6 text-center">
          ⚠️ Are you sure you want to delete this question <span class="text-red-600">[ {{ deleteTitle }} ]</span>?
        </h3>
        <div class="flex justify-center gap-6">
          <button @click="handleDelete"
            class="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">Confirm</button>
          <button @click="cancelDelete"
            class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Confirm delete modal for comment -->
    <div v-if="showCommentDelete" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div class="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h3 class="text-lg font-bold mb-6 text-center">
          ⚠️ Delete this comment?
        </h3>
        <div class="flex justify-center gap-6">
          <button @click="deleteComment"
            class="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">Confirm</button>
          <button @click="cancelDeleteComment"
            class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">Cancel</button>
        </div>
      </div>
    </div>
  </div>


</template>
