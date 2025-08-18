<template>
  <div class="flex">
    <PubgAside @on-filter-change="onFilterChange"></PubgAside>
    <main class="flex-1 overflow-auto">
      <div class="p-6" v-if="stat.length">
        <Table class="max-w-[600px] mx-auto mt-6">
          <TableCaption>战绩统计</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>排名</TableHead>
              <TableHead>名称</TableHead>
              <TableHead>场数</TableHead>
              <TableHead>击杀数</TableHead>
              <TableHead>伤害量</TableHead>
              <TableHead>场均伤害</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(item, idx) in stat" :key="idx">
              <TableCell class="font-medium">{{ idx + 1 }}</TableCell>
              <TableCell>
                {{ item.name }}
              </TableCell>
              <TableCell>{{ item.count }}</TableCell>
              <TableCell>{{ item.kills }}</TableCell>
              <TableCell>{{ item.damage }}</TableCell>
              <TableCell>{{ (item.damage / item.count).toFixed(2) }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div
        class="grid gap-4 grid-cols-[repeat(auto-fit,minmax(600px,1fr))] p-6 max-w-[1300px] mx-auto"
        v-show="stat.length"
      >
        <PubgRecord user-id="5e37bd643116bb0001a9d97d" ref="ref1"></PubgRecord>
        <PubgRecord user-id="5bd7f6ffb8e738000119e41d" ref="ref2"></PubgRecord>
        <PubgRecord user-id="683c20c5782d4078d40c7873" ref="ref3"></PubgRecord>
        <PubgRecord user-id="683c20c5782d4078d40c7872" ref="ref4"></PubgRecord>
        <PubgRecord user-id="68753432d48f8229933d14f7" ref="ref5"></PubgRecord>
      </div>
      <EmptyPlaceholder v-if="!stat.length">
        <p>{{ isRequesting ? '战绩查询中' : '当前时间段未查询到战绩' }}</p>
      </EmptyPlaceholder>
    </main>
  </div>
</template>
<script setup lang="ts">
import EmptyPlaceholder from '@/components/common/EmptyPlaceholder.vue'
import PubgAside from '@/components/pubg/PubgAside.vue'
import PubgRecord from '@/components/pubg/PubgRecord.vue'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { computed, ref } from 'vue'

const ref1 = ref<InstanceType<typeof PubgRecord>>()
const ref2 = ref<InstanceType<typeof PubgRecord>>()
const ref3 = ref<InstanceType<typeof PubgRecord>>()
const ref4 = ref<InstanceType<typeof PubgRecord>>()
const ref5 = ref<InstanceType<typeof PubgRecord>>()

const onFilterChange = (startDate: string, endDate: string) => {
  ;[ref1.value, ref2.value, ref3.value, ref4.value, ref5.value].forEach((v) => {
    v?.fetchPubgRecord(startDate, endDate)
  })
}

const stat = computed(() => {
  if (ref1.value && ref2.value && ref3.value && ref4.value && ref5.value) {
    return [
      ref1.value.stat,
      ref2.value.stat,
      ref3.value.stat,
      ref4.value.stat,
      ref5.value.stat
    ]
      .filter((v) => v.isValid)
      .sort((a, b) => b.kills - a.kills)
  }
  return []
})

const isRequesting = computed(() => {
  if (ref1.value && ref2.value && ref3.value && ref4.value && ref5.value) {
    return (
      ref1.value.isRequesting ||
      ref2.value.isRequesting ||
      ref3.value.isRequesting ||
      ref4.value.isRequesting ||
      ref5.value.isRequesting
    )
  }
  return true
})
</script>
