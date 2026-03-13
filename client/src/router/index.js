import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', component: () => import('../views/HomeView.vue') },
  { path: '/login', component: () => import('../views/LoginView.vue'), meta: { guestOnly: true } },
  { path: '/register', component: () => import('../views/RegisterView.vue'), meta: { guestOnly: true } },
  { path: '/spel', component: () => import('../views/GameView.vue'), meta: { requiresAuth: true } },
  { path: '/statistieken', component: () => import('../views/StatsView.vue'), meta: { requiresAuth: true } },
  { path: '/admin', component: () => import('../views/AdminView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/wachtwoord', component: () => import('../views/WachtwoordView.vue'), meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) return next('/login')
  if (to.meta.requiresAdmin && !auth.isAdmin) return next('/')
  if (to.meta.guestOnly && auth.isLoggedIn) return next('/')
  next()
})

export default router
