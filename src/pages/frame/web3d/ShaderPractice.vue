<template>
  <div class="w-full h-full canvas-container overflow-hidden"></div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { main } from '@/3d/shaderPractice'
onMounted(() => {
  main()
})
</script>
