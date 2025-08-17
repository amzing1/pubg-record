import SubNav from '@/pages/frame/SubNav.vue'
import ImageAnnotation from '@/pages/frame/annotation/ImageAnnotation.vue'
import PubgRecord from '@/pages/frame/Pubg.vue'
import TextAnnotation from '@/pages/frame/annotation/TextAnnotation.vue'
import VideoAnnotation from '@/pages/frame/annotation/VideoAnnotation.vue'
import WqhWeb from '@/pages/frame/WqhWeb.vue'
import homePage from '@/pages/Home.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import ShaderPractice from '@/pages/frame/web3d/ShaderPractice.vue'
import ShaderWave from '@/pages/frame/web3d/ShaderWave.vue'
import ShaderGalaxy from '@/pages/frame/web3d/ShaderGalaxy.vue'
import ShaderLight from '@/pages/frame/web3d/shaderLight.vue'

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
        component: SubNav,
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
      },
      {
        path: 'web3d/',
        name: 'web3d',
        component: SubNav,
        children: [
          {
            path: 'shader-practice',
            name: 'shader-practice',
            component: ShaderPractice
          },
          {
            path: 'shader-wave',
            name: 'shader-wave',
            component: ShaderWave
          },
          {
            path: 'shader-galaxy',
            name: 'shader-galaxy',
            component: ShaderGalaxy
          },
          {
            path: 'shader-light',
            name: 'shader-light',
            component: ShaderLight
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
