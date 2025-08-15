type BBox = [l: number, t: number, w: number, h: number]
type LabelSkeleton = {
  startId: number
  endId: number
}
type LabelKeyPoint = {
  name: string
}
type AnnotationPointParams = {
  x: number
  y: number
  radius: number
  fillColor: string
  strokeColor: string
  name?: string
}
type AnnotationSegmentationParams = {
  segmentation: [number, number][]
  strokeColor: string
  fillColor: string
  isOver: boolean
  id: string
  visible: boolean
  categroyId: string
  name: string
  isImageLabel: boolean
  actionName?: string
}
type SkeletonParams = {
  bbox: BBox
  color: string
  skeletons: LabelSkeleton[]
  keypoints: LabelKeyPoint[]
}
type SetAnnotationsParams = {
  id: string
  polygon: [number, number][]
  keypoints: [number, number][]
  idx: number
  originData: any
}[]

export type { AnnotationPointParams, AnnotationSegmentationParams, BBox, LabelKeyPoint, LabelSkeleton, SetAnnotationsParams, SkeletonParams }
