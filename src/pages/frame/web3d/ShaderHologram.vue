<template>
  <div class="w-full h-full canvas-container overflow-hidden"></div>
</template>
<script lang="ts" setup>
import { main } from '@/3d/shaderHologram'
import { onMounted } from 'vue'
onMounted(() => {
  main()
})
</script>
