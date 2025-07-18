<script lang="ts" setup></script>
<template>
  <div class="w-screen h-screen flex text-[#333] bg-[#f1f4f9]">
    <!-- 导航栏 -->
    <div class="h-full flex flex-col items-center w-20 py-6 text-[12px]">
      <div class="flex flex-col items-center w-full py-2 text-[#285cd4] cursor-pointer hover:bg-white">
        <p class="mt-1">pubg</p>
      </div>
    </div>
    <div class="flex-1 overflow-auto my-2 mr-2 bg-white rounded-[8px]">
      <router-view></router-view>
    </div>
  </div>
</template>
