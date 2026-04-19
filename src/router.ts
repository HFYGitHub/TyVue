import { createRouter, createWebHistory } from 'vue-router'
import Login from './components/Login.vue'
import Dashboard from './pages/Dashboard.vue'
import Features from './pages/Features.vue'
import AnswerBook from './pages/AnswerBook.vue'

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
    path: '/',
    redirect: '/features'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：检查 token，未登录重定向到登录页
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.path === '/login') {
    next()
  } else if (!token && to.path !== '/login') {
    next('/login')
  } else {
    next()
  }
})

export default router
