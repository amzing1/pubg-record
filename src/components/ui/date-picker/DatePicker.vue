<script setup lang="ts">
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
import { Calendar as CalendarIcon } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { DateRange } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'
import RangeCalendar from '../range-calendar/RangeCalendar.vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const df = new DateFormatter('en-US', {
  dateStyle: 'short'
})

const dateRange = defineModel<DateRange>()

const dateFormatStr = computed(() => {
  if (dateRange.value?.start && dateRange.value.end) {
    return `${df.format(dateRange.value.start!.toDate(getLocalTimeZone()))} - ${df.format(dateRange.value.end!.toDate(getLocalTimeZone()))}`
  } else {
    return '选择日期范围'
  }
})
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline" :class="(cn('w-[280px] justify-start text-left font-normal', !dateRange && 'text-muted-foreground'), props.class)">
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ dateFormatStr }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <RangeCalendar v-model="dateRange"></RangeCalendar>
    </PopoverContent>
  </Popover>
</template>
