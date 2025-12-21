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
  routes
})

export default router
