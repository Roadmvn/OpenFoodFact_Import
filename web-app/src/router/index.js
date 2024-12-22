import { createRouter, createWebHistory } from 'vue-router'
import AuthService from '../services/auth.service'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { guest: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/invoices',
    name: 'invoices',
    component: () => import('../views/InvoicesView.vue'),
    meta: { requiresAuth: true }
  },
  // Redirection par défaut vers login
  {
    path: '/',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const currentUser = AuthService.getCurrentUser()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isGuestRoute = to.matched.some(record => record.meta.guest)

  if (requiresAuth && !currentUser) {
    next('/login')
  } else if (isGuestRoute && currentUser) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
