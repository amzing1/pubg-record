<template>
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
</template>

<script setup lang="ts">
import { usePubgFilter } from '@/use/pubg/usePubgFilter'
import { Label } from 'reka-ui'
import DatePicker from '../ui/date-picker/DatePicker.vue'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'

const emit = defineEmits<{
  (e: 'onFilterChange', startDate: string, endDate: string): void
}>()

const { dateType, dateRange } = usePubgFilter((startDate: string, endDate: string) => emit('onFilterChange', startDate, endDate))
</script>
