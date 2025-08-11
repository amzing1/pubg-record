<script setup lang="ts">
import PubgRecord from '@/components/pubg/PubgRecord.vue'
import { RadioGroup } from '@/components/ui/radio-group'
import RadioGroupItem from '@/components/ui/radio-group/RadioGroupItem.vue'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { usePubgFilter } from '@/use/usePubgFilter'
import { Label } from 'reka-ui'
import { computed, ref } from 'vue'
// import RangeCalendar from '@/components/ui/range-calendar/RangeCalendar.vue';
import DatePicker from '@/components/ui/date-picker/DatePicker.vue'

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

const { dateType, dateRange } = usePubgFilter(onFilterChange)

const stat = computed(() => {
  if (ref1.value && ref2.value && ref3.value && ref4.value && ref5.value) {
    return [ref1.value.stat, ref2.value.stat, ref3.value.stat, ref4.value.stat, ref5.value.stat].filter((v) => v.isValid).sort((a, b) => b.kills - a.kills)
  }
  return []
})
</script>

<template>
  <div class="flex">
    <aside class="p-12 border-r border-solid border-border">
      <h2 class="font-semibold mb-3">日期</h2>
      <RadioGroup v-model="dateType">
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="day" value="day" class="cursor-pointer"></RadioGroupItem>
          <Label for="day" class="cursor-pointer">最近一天</Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="week" value="week" class="cursor-pointer"></RadioGroupItem>
          <Label for="week" class="cursor-pointer">最近一周</Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="month" value="month" class="cursor-pointer"></RadioGroupItem>
          <Label for="month" class="cursor-pointer">最近一月</Label>
        </div>
      </RadioGroup>
      <!-- <RangeCalendar v-model="dateRange" v-if="dateType === 'custom'"></RangeCalendar> -->
      <DatePicker class="mt-3" v-model="dateRange"></DatePicker>
    </aside>
    <main class="flex-1 overflow-auto">
      <div class="p-6">
        <Table class="max-w-[600px] mx-auto mt-6" v-if="stat.length">
          <TableCaption>战绩统计</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>排名</TableHead>
              <TableHead>名称</TableHead>
              <TableHead>击杀数</TableHead>
              <TableHead>伤害量</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(item, idx) in stat" :key="idx">
              <TableCell class="font-medium">{{ idx + 1 }}</TableCell>
              <TableCell>
                {{ item.name }}
              </TableCell>
              <TableCell>{{ item.kills }}</TableCell>
              <TableCell>{{ item.damage }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div class="grid gap-4 grid-cols-[repeat(auto-fit,minmax(600px,1fr))] p-6 max-w-[1300px] mx-auto">
        <PubgRecord user-id="5e37bd643116bb0001a9d97d" ref="ref1"></PubgRecord>
        <PubgRecord user-id="5bd7f6ffb8e738000119e41d" ref="ref2"></PubgRecord>
        <PubgRecord user-id="683c20c5782d4078d40c7873" ref="ref3"></PubgRecord>
        <PubgRecord user-id="683c20c5782d4078d40c7872" ref="ref4"></PubgRecord>
        <PubgRecord user-id="68753432d48f8229933d14f7" ref="ref5"></PubgRecord>
      </div>
    </main>
  </div>
</template>
