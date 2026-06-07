import { createRouter, createWebHistory } from 'vue-router'
import Login from './components/Login.vue'
import Dashboard from './pages/Dashboard.vue'
import Features from './pages/Features.vue'
import AnswerBook from './pages/AnswerBook.vue'
import LuckyDraw from './pages/LuckyDraw.vue'
import ClipboardAdd from './pages/ClipboardAdd.vue'
import ClipboardView from './pages/ClipboardView.vue'

const routes = [
  {
    path: '/login',
    component: Login,
    name: 'Login'
  },
  {
    path: '/dashboard',
    component: Dashboard,
    name: 'Dashboard'
  },
  {
    path: '/features',
    component: Features,
    name: 'Features'
  },
  {
    path: '/answer-book',
    component: AnswerBook,
    name: 'AnswerBook'
  },
  {
    path: '/lucky-draw',
    component: LuckyDraw,
    name: 'LuckyDraw'
  },
  {
    path: '/clipboard',
    redirect: '/clipboard/view'
  },
  {
    path: '/clipboard/add',
    component: ClipboardAdd,
    name: 'ClipboardAdd'
  },
  {
    path: '/clipboard/view',
    component: ClipboardView,
    name: 'ClipboardView'
  },
  {
    path: '/',
    redirect: '/features'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：检查 token，未登录重定向到登录页
export default router
