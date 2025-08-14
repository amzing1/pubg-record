import { getLocalTimeZone } from '@internationalized/date'
import dayjs from 'dayjs'
import type { DateRange } from 'reka-ui'
import { ref, watchEffect, type Ref } from 'vue'

export function usePubgFilter(fetchPubgRecords: (startDate: string, endDate: string) => void) {
  const dateType = ref<'day' | 'week' | 'month' | 'custom'>('day')

  const dateRange = ref<DateRange>({
    start: undefined,
    end: undefined
  }) as Ref<DateRange>

  watchEffect(() => {
    if (dateRange.value.start && dateRange.value.end) {
      dateType.value = 'custom'
    }
  })

  watchEffect(() => {
    let start = ''
    let end = ''
    switch (dateType.value) {
      case 'custom':
        if (dateRange.value.start && dateRange.value.end) {
          start = dateRange.value.start.toDate(getLocalTimeZone()).toString()
          end = dateRange.value.end.toDate(getLocalTimeZone()).toString()
        }
        break
      case 'day':
        start = dayjs().subtract(1, 'day').toString()
        break
      case 'week':
        start = dayjs().subtract(1, 'week').toString()
        break
      case 'month':
        start = dayjs().subtract(1, 'month').toString()
        break
    }
    fetchPubgRecords(start, end)
  })

  return {
    dateType,
    dateRange
  }
}
