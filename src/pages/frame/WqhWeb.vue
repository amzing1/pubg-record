<template>
  <div class="w-screen h-screen flex text-[#333] bg-[#f1f4f9]">
    <!-- 导航栏 -->
    <div class="h-full flex flex-col items-center w-20 py-6 text-[12px]">
      <div
        class="flex flex-col items-center w-full py-2 cursor-pointer hover:bg-white"
        :class="{ 'text-primary': $route.name === nav.routerName }"
        v-for="nav in navList"
        :key="nav.name"
      >
        <p class="mt-1" @click="router.push({ name: nav.routerName })">
          {{ nav.name }}
        </p>
      </div>
    </div>
    <div class="flex-1 overflow-auto my-2 mr-2 bg-white rounded-[8px]">
      <router-view class="h-full"></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { router } from '@/router'
import { useNavList } from '@/use/common/useNavList'

const { navList } = useNavList()
</script>
