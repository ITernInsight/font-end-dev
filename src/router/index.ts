import { createRouter, createWebHistory } from 'vue-router'
import PostView from '../views/PostView.vue'
import ReviewView from '../views/ReviewView.vue'
import QuestionView from '../views/QuestionView.vue'
import PostDetail from '../views/PostDetail.vue'
import ReviewDetail from '../views/ReviewDetail.vue'
import QuestionDetail from '../views/QuestionDetail.vue'
import AdminView from '@/views/admin/AdminView.vue'
import AddAnnouce from '@/views/admin/AddAnnouce.vue'
import EditAnnouce from '@/views/admin/EditAnnouce.vue'
import AnnouceView from '@/views/admin/AnnouceView.vue'
import DetailAnnouce from '@/views/admin/DetailAnnouce.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/posts',
      name: 'posts',
      component: PostView,
    },
    {
      path: '/posts/:id',
      name: 'post details',
      component: PostDetail,
    },
    {
      path: '/reviews',
      name: 'reviews',
      component: ReviewView,
    },
    {
      path: '/reviews/:id',
      name: 'review detail',
      component: ReviewDetail,
    },
    {
      path: '/questions',
      name: 'questions',
      component: QuestionView,
    },
    {
      path: '/questions/:id',
      name: 'question details',
      component: QuestionDetail,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      redirect: '/admin/annouce',
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        {
          path: 'annouce',
          name: 'annouce',
          component: AnnouceView,
        },
        {
          path: 'annouce/:id',
          name: 'annouce details',
          component: DetailAnnouce,
        },
      ],
    },
    {
      path: '/admin/add-annouce',
      name: 'add annouce',
      component: AddAnnouce,
    },
    {
      path: '/admin/edit-annouce/:id',
      name: 'edit annouce',
      component: EditAnnouce,
    },
  ],
})

export default router
