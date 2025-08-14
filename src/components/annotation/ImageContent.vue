<template>
  <div class="relative w-full h-full image-label-bg">
    <img ref="mediaRef" :src="testImg" alt="label-image" class="absolute top-0 left-0 hidden" data-testid="img" @load="onMediaLoaded" />
    <canvas ref="mediaCanvasRef" class="w-full h-full absolute top-0 left-0"></canvas>
    <canvas id="label-canvas" ref="labelCanvasRef" data-testid="label-canvas" class="w-full h-full absolute top-0 left-0"></canvas>
  </div>
</template>

<script setup lang="ts">
import testImg from '@/assets/annotation/test.png'
import { useDragCanvas, useImageContent, useMouseCursor } from '@/use/annotation'
const { mediaRef, mediaCanvasRef, labelCanvasRef, onMediaLoaded } = useImageContent()
useDragCanvas()
useMouseCursor()
</script>

<style lang="scss">
.image-label-bg {
  background: url('@/assets/annotation/bg.png');
}
</style>
