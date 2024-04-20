import { createRouter, createWebHistory } from 'vue-router'
import Main from '../pages/Main.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('../pages/Settings.vue')
    },
    {
      path: '/order',
      name: 'OrderBook',
      component: () => import('../pages/OrderBook.vue')
    },
  ]
})

export default router