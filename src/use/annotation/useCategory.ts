import { createSharedComposable } from '@vueuse/core'
import { ref } from 'vue'

type AnnotationCategory = {
  name: string
  id: string
  shortcut: string
}
export const useCategory = createSharedComposable(() => {
  const categories = ref<AnnotationCategory[]>([
    {
      name: 'cat',
      id: 'cat',
      shortcut: 'A'
    },
    {
      name: 'dog',
      id: 'dog',
      shortcut: 'B'
    }
  ])

  return categories
})
