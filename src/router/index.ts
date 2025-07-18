import PubgRecord from '@/pages/frame/Pubg.vue'
import WqhWeb from '@/pages/frame/WqhWeb.vue'
import homePage from '@/pages/Home.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: homePage },
  {
    path: '/wqh-web/',
    name: 'wqh-web',
    component: WqhWeb,
    children: [
      {
        path: 'pubg-record',
        name: 'pubg-record',
        component: PubgRecord
      }
    ]
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
