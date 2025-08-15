import { createSharedComposable } from '@vueuse/core'
import { ref } from 'vue'
import type { LabelKeyPoint, LabelSkeleton } from './drawer'

type AnnotationCategory = {
  name: string
  id: string
  shortcut: string
  keypoints: LabelKeyPoint[]
  skeletons: LabelSkeleton[]
  lock: boolean
  color: string
}
export const useCategory = createSharedComposable(() => {
  const categories = ref<AnnotationCategory[]>([
    {
      name: 'cat',
      id: 'cat',
      shortcut: 'A',
      keypoints: [],
      skeletons: [],
      lock: true,
      color: 'rgba(255, 122, 122, 1)'
    },
    {
      name: 'dog',
      id: 'dog',
      shortcut: 'B',
      keypoints: [],
      skeletons: [],
      lock: false,
      color: 'rgba(122, 122, 255, 1)'
    }
  ])

  return {
    categories
  }
})
