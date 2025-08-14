import Annotation from '@/pages/frame/Annotation.vue'
import ImageAnnotation from '@/pages/frame/ImageAnnotation.vue'
import PubgRecord from '@/pages/frame/Pubg.vue'
import TextAnnotation from '@/pages/frame/TextAnnotation.vue'
import VideoAnnotation from '@/pages/frame/VideoAnnotation.vue'
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
      },
      {
        path: 'annotation/',
        name: 'annotation',
        component: Annotation,
        children: [
          {
            path: 'image',
            name: 'annotation-image',
            component: ImageAnnotation
          },
          {
            path: 'text',
            name: 'annotation-text',
            component: TextAnnotation
          },
          {
            path: 'video',
            name: 'annotation-video',
            component: VideoAnnotation
          }
        ]
      }
    ]
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
