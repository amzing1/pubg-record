import { createSharedComposable } from '@vueuse/core'
import { ref } from 'vue'

export type ImageAnnotation = {
  id: string
  color: string
  polygon: [number, number][]
  category: string
  name: string
  visible: string
  isOver: boolean
  isSelected: boolean
}

export const useImageData = createSharedComposable(() => {
  const annotations = ref<ImageAnnotation[]>([])
  const tempAnno = ref<ImageAnnotation | null>(null)

  function addAnnotation(anno: ImageAnnotation) {
    const idx = annotations.value.findIndex((v) => v.id === anno.id)
    if (idx >= 0) {
      annotations.value.splice(idx, 1)
    } else {
      annotations.value.push(anno)
    }
  }

  function changePolygon(anno: ImageAnnotation) {
    const idx = annotations.value.findIndex((v) => v.id === anno.id)
    annotations.value.splice(idx, 1, anno)
  }

  function deleteAnnotation(idx: number) {
    annotations.value.splice(idx, 1)
  }

  function clearAnnotations() {
    annotations.value = []
  }

  function addPoint(x: number, y: number) {}

  return {
    annotations,
    tempAnno,
    addAnnotation,
    changePolygon,
    deleteAnnotation,
    clearAnnotations,
    addPoint
  }
})
