import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
    },
    {
      path: '/budget',
      name: 'budget',
      component: () => import('@/views/BudgetView.vue'),
    },
    {
      path: '/time',
      name: 'time',
      component: () => import('@/views/TimeTrackerView.vue'),
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@/views/ReportsView.vue'),
    },
  ],
})

export default router
