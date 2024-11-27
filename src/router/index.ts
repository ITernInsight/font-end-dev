import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PostView from '../views/PostView.vue'
import ReviewView from '../views/ReviewView.vue'
import QuestionView from '../views/QuestionView.vue'
import PostDetail from '../views/PostDetail.vue'
import ReviewDetail from '../views/ReviewDetail.vue'
import QuestionDetail from '../views/QuestionDetail.vue'
import AdminAddAnnounce from '../views/AdminAddAnnounce.vue'
import AddReview from '../views/AddReview.vue'
import AddQuestion from '../views/AddQuestion.vue'
import EditAnnouncement from '../views/editAnnouncement.vue'
import DetailAnnounce from '../views/DetailAnnounce.vue'

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
          path: '/posts/:id',
          name:'postdetails',
          component: PostDetail
        },
        {
          path: 'reviews',
          name:'reviews',
          component: ReviewView,
        },
        {
          path: '/reviews/:id',
          name:'reviewdetail',
          component: ReviewDetail
        },
        {
          path: 'questions',
          name:'questions',
          component: QuestionView,
        },
        {
          path: '/questions/:id',
          name:'questiondetails',
          component: QuestionDetail
        },
                {
          path: '/questions/:id',
          name:'questiondetails',
          component: QuestionDetail
        },
      ]
    },
    {
      path: '/adminaddannounce', 
      component: AdminAddAnnounce,
    },
    {
      path: '/addreview', 
      component: AddReview,
    },
    {
      path: '/addquestion', 
      component: AddQuestion,
    },
    {
      path: '/editannounce/:id', 
      component: EditAnnouncement,
    },
    {
      path: '/detailannounce/:id', 
      component: DetailAnnounce,
    },
  ],
})

export default router
