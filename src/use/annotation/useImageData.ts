import { createSharedComposable } from '@vueuse/core'
import { ref } from 'vue'
import type { AnnotationDrawer } from './drawer'

export type ImageAnnotation = {
  id: string
  color: string
  polygon: [number, number][]
  category: string
  name: string
  visible: boolean
  isOver: boolean
}

export const useImageData = createSharedComposable(() => {
  const annotations = ref<ImageAnnotation[]>([])
  const curAnno = ref<ImageAnnotation | null>(null)

  function addAnnotation(drawer: AnnotationDrawer) {
    if (!drawer.curAnno) return
    const anno: ImageAnnotation = {
      id: drawer.curAnno.id,
      color: drawer.curAnno.strokeColor,
      polygon: drawer.curAnno.points.map((v) => [v.x, v.y]),
      category: drawer.curAnno.categroyId,
      name: drawer.curAnno.name,
      visible: true,
      isOver: drawer.curAnno.isOver
    }
    const idx = annotations.value.findIndex((v) => v.id === anno.id)
    if (idx >= 0) {
      annotations.value.splice(idx, 1, anno)
    } else {
      annotations.value.push(anno)
    }
  }

  function changePolygon(drawer: AnnotationDrawer) {
    if (!drawer.curAnno) return
    const idx = annotations.value.findIndex((v) => v.id === drawer.curAnno!.id)
    annotations.value[idx].polygon = drawer.curAnno.segmentation
  }

  function deleteAnnotation(idx: number) {
    annotations.value.splice(idx, 1)
  }

  function clearAnnotations() {
    annotations.value = []
  }

  function addPoint(drawer: AnnotationDrawer) {
    if (!drawer.curAnno) return
    const anno = annotations.value.find((v) => v.id === drawer.curAnno!.id)
    if (drawer.curAnno.isOver || !anno) {
      addAnnotation(drawer)
    } else {
      changePolygon(drawer)
    }
  }

  return {
    annotations,
    curAnno,
    addAnnotation,
    changePolygon,
    deleteAnnotation,
    clearAnnotations,
    addPoint
  }
})
