<template>
  <div class="flex">
    <div class="w-40 py-4 border-r border-solid border-sidebar-border">
      <div
        class="h-12 flex items-center justify-center cursor-pointer hover:bg-sidebar"
        :class="{ 'bg-sidebar': $route.name === nav.routerName }"
        v-for="nav in getSubNavs('annotation')"
        :key="nav.name"
        @click="$router.push({ name: nav.routerName })"
      >
        {{ nav.name }}
      </div>
    </div>
    <RouterView></RouterView>
  </div>
</template>

<script setup lang="ts">
import { useNavList } from '@/use/common/useNavList'
import { RouterView } from 'vue-router'

const { getSubNavs } = useNavList()
</script>
