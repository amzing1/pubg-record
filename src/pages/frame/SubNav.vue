<template>
  <div class="flex">
    <div class="w-40 min-w-40 py-4 border-r border-solid border-sidebar-border">
      <div
        class="h-12 flex items-center justify-center cursor-pointer hover:bg-sidebar"
        :class="{ 'bg-sidebar': $route.name === nav.routerName }"
        v-for="nav in getSubNavs(rootNavName)"
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
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()
const { getSubNavs } = useNavList()

const rootNavName = computed(() => {
  const navs = ['annotation', 'web3d']
  const finded = navs.find((v) => route.path.includes(v))
  return finded as Parameters<typeof getSubNavs>[0]
})
</script>

<style lang="scss">
.dg.main {
  position: absolute;
  right: 0;
  top: 12px;
}
</style>
