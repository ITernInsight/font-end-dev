import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PostView from '../views/PostView.vue'
import ReviewView from '../views/ReviewView.vue'
import QuestionView from '../views/QuestionView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      redirect: 'posts',
      children:[
        {
          path: 'posts',
          name:'posts',
          component: PostView,
        },
        {
          path: 'reviews',
          name:'reviews',
          component: ReviewView,
        },
        {
          path: 'questions',
          name:'questions',
          component: QuestionView,
        },
      ]
    },
  ],
})

export default router
