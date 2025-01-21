import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import AuthLayout from '../layouts/AuthLayout.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'

// Views
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import ProductsView from '../views/ProductsView.vue'
import OrdersView from '../views/OrdersView.vue'
import StatisticsView from '../views/StatisticsView.vue'
import InvoicesView from '../views/InvoicesView.vue'
import ActivitiesView from '../views/ActivitiesView.vue'
import WidgetsView from '../views/WidgetsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          path: 'login',
          name: 'login',
          component: LoginView
        },
        {
          path: 'register',
          name: 'register',
          component: RegisterView
        },
        {
          path: 'reset-password',
          name: 'reset-password',
          component: () => import('../views/ResetPasswordView.vue')
        }
      ]
    },
    {
      path: '/dashboard',
      component: DashboardLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView
        },
        {
          path: 'products',
          name: 'products',
          component: ProductsView
        },
        {
          path: 'activities',
          name: 'activities',
          component: ActivitiesView
        },
        {
          path: 'widgets',
          name: 'widgets',
          component: WidgetsView
        },
        {
          path: 'orders',
          name: 'orders',
          component: OrdersView
        },
        {
          path: 'statistics',
          name: 'statistics',
          component: StatisticsView
        },
        {
          path: 'invoices',
          name: 'invoices',
          component: InvoicesView
        }
      ]
    }
  ]
})

export default router
