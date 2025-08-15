import { createSharedComposable } from '@vueuse/core'
import { onMounted, ref, watch } from 'vue'
import { AnnotationDrawer, AnnotationSegmentation, lowerTransparent, Skeleton } from './drawer'
import type { SetAnnotationsParams } from './drawer/type'
import { useCategory } from './useCategory'
import { useImageContent } from './useImageContent'
/**
 * 用于统一管理绘制 annotation 的画布
 * 主要功能是保持 AnnotationDrawer 中的数据和 VideoLabelData 数据保持一致
 * 以及 labelCanvas 和 mediaCanvas 中的 transform 信息保持一致
 */
export const useDrawer = createSharedComposable(() => {
  const { labelCanvasRef, canvasPos, mediaTransform } = useImageContent()
  const { categories } = useCategory()

  const drawer = ref<AnnotationDrawer | null>(null)

  onMounted(() => {
    if (!labelCanvasRef.value) return
    if (!drawer.value) {
      drawer.value = new AnnotationDrawer(labelCanvasRef.value, [])
    }
  })

  /**
   * 同步 视频/图片 canvas 和 标注 canvas 的 transform 信息
   */
  watch(mediaTransform, () => {
    const { w: w1, h: h1, dx: dx1, dy: dy1 } = canvasPos
    drawer.value?.setTransformMeta(
      mediaTransform.rotation,
      [dx1 + w1 / 2, dy1 + h1 / 2],
      [mediaTransform.offset[0], mediaTransform.offset[1]],
      [mediaTransform.scale[0], mediaTransform.scale[1]]
    )
  })

  /**
   * 同步数据 curAnno -> drawer curAnno
   */
  function setCurAnno(annoId: string) {
    if (!drawer.value) return
    drawer.value.curAnno = drawer.value.annotations.find((v) => v.id === annoId) || null
  }

  /**
   * 同步 videoLabelData / imageLabelData -> drawer annotations
   */
  function setAnnotations(params: SetAnnotationsParams) {
    if (!drawer.value) {
      drawer.value = new AnnotationDrawer(labelCanvasRef.value!, [])
    }
    drawer.value.annotations = []
    params.forEach((v) => {
      const { id, polygon, idx } = v
      const { category_id, color, name, visible, isOver, keypoints } = v.originData!
      const cate = categories.value.find((c) => c.id === category_id)!
      const anno = new AnnotationSegmentation(labelCanvasRef.value!, {
        segmentation: polygon,
        strokeColor: color,
        // 画矩形填充颜色，多边形不填充
        fillColor: lowerTransparent(color),
        isOver,
        id: id as string,
        categroyId: category_id,
        name,
        visible: visible ?? true,
        isImageLabel: true
      })
      if (keypoints?.length) {
        const skeleton = new Skeleton(labelCanvasRef.value!, {
          bbox: anno.bbox,
          color: anno.strokeColor,
          skeletons: cate.skeletons,
          keypoints: cate.keypoints
        })
        skeleton.keypoints.forEach((p, i) => {
          p.x = v.keypoints[i][0]
          p.y = v.keypoints[i][1]
          p.visible = keypoints[i].visible
        })
        anno.skeleton = skeleton
      }
      anno.idx = idx
      if (v.originData.curActionId >= 0) {
        anno.actionName = categories.value.find((a) => a.id === v.originData.curActionId)!.name
      } else {
        anno.actionName = ''
      }
      drawer.value!.annotations.push(anno)
    })
    const ids = params.map((v) => v.id)
    drawer.value.annotations = drawer.value.annotations.filter((v) => ids.includes(v.id))
    const notOverAnno = drawer.value.annotations.find((v) => !v.isOver)
    if (notOverAnno) {
      drawer.value.curAnno = notOverAnno
    }
    if (!drawer.value.annotations.length) {
      drawer.value.curAnno = null
    }
  }

  return {
    drawer,
    setCurAnno,
    setAnnotations
  }
})
