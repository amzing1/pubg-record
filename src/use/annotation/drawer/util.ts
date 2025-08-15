import type { BBox } from './type'

type Point = [number, number]

function getBBoxByPolygon(points: [number, number][]): BBox {
  let [xMin, xMax, yMin, yMax] = [Infinity, -Infinity, Infinity, -Infinity]
  points.forEach((v) => {
    if (v[0] < xMin) {
      xMin = v[0]
    }
    if (v[0] > xMax) {
      xMax = v[0]
    }
    if (v[1] < yMin) {
      yMin = v[1]
    }
    if (v[1] > yMax) {
      yMax = v[1]
    }
  })
  return [xMin, yMin, xMax - xMin, yMax - yMin]
}

function crossProduct(p1: Point, p2: Point, p3: Point): number {
  const x1 = p2[0] - p1[0]
  const y1 = p2[1] - p1[1]
  const x2 = p3[0] - p1[0]
  const y2 = p3[1] - p1[1]
  return x1 * y2 - x2 * y1
}

function onSegment(p: Point, seg: [Point, Point]): boolean {
  const [a, b] = seg
  const [x, y] = p
  return x >= Math.min(a[0], b[0]) && x <= Math.max(a[0], b[0]) && y >= Math.min(a[1], b[1]) && y <= Math.max(a[1], b[1])
}

function isSegmentIntersect(seg1: [Point, Point], seg2: [Point, Point]): boolean {
  const [a, b] = seg1
  const [c, d] = seg2

  const d1 = crossProduct(a, b, c)
  const d2 = crossProduct(a, b, d)
  const d3 = crossProduct(c, d, a)
  const d4 = crossProduct(c, d, b)

  if (d1 * d2 < 0 && d3 * d4 < 0) {
    return true
  }

  // d1 为 0 表示 C 点在 AB 所在的直线上
  // 接着会用 onSegment 再判断这个 C 是不是在 AB 的 x 和 y 的范围内
  if (d1 === 0 && onSegment(c, seg1)) return true
  if (d2 === 0 && onSegment(d, seg1)) return true
  if (d3 === 0 && onSegment(a, seg2)) return true
  if (d4 === 0 && onSegment(b, seg2)) return true

  return false
}

function isPointInsidePolygon(p: Point, segs: Point[]) {
  let intersectionCount = 0
  for (let i = 0; i < segs.length; i++) {
    const [x1, y1] = segs[i]
    const [x2, y2] = segs[(i + 1) % segs.length]
    if (
      isSegmentIntersect(
        [p, [9999, p[1]]],
        [
          [x1, y1],
          [x2, y2]
        ]
      )
    ) {
      intersectionCount++
    }
  }
  return intersectionCount % 2 === 1
}

function lowerTransparent(color: string) {
  let res = ''
  for (let i = 0; i < color.length; i++) {
    if (i === color.length - 2) {
      res += '0.3'
    } else {
      res += color[i]
    }
  }
  return res
}

function clamp(min: number, max: number, val: number) {
  return Math.min(max, Math.max(min, val))
}

export { clamp, getBBoxByPolygon, isPointInsidePolygon, lowerTransparent }
