import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import MeditationApp from '../views/MeditationApp.vue'
import PharmacyInfo from '../views/PharmacyInfo.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/meditation',
    name: 'Meditation',
    component: MeditationApp
  },
  {
    path: '/pharmacy',
    name: 'Pharmacy',
    component: PharmacyInfo
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, left: 0 }
  }
})

export default router
