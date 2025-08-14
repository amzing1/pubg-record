<template>
  <div class="grid grid-cols-[1fr_220px] grid-rows-[44px_1fr] w-full h-full select-none">
    <div class="col-start-1 col-end-3 bg-action-bar border-b border-solid border-border">top bar</div>
    <div class="col-start-1 col-end-2 row-start-2 row-end-3 overflow-auto">
      <ImageContent></ImageContent>
    </div>
    <div class="col-start-2 col-end-3 row-start-2 row-end-4 overflow-hidden bg-siderbar-bg space-y-2 border-l border-solid border-border">aside</div>
    <div class="fixed right-[244px] bottom-8 px-5 py-3 rounded-[24px] space-x-3 bg-red-300"></div>
  </div>
</template>
<script setup lang="ts">
import ImageContent from '@/components/annotation/ImageContent.vue'
</script>
