import axios from 'axios'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'
import { usePagination } from './usePagination'

type PubgRecordData = {
  participant: {
    stats: {
      combat: {
        kda: {
          kills: number
        }
        damage: {
          damage_dealt: number
        }
      }
    }
    user: {
      nickname: string
    }
  }
  match_id: string
  offset: string
  started_at: string
}

/**5e37bd643116bb0001a9d97d */
export function usePubgRecord() {
  const isRequesting = ref(false)
  const records = ref<PubgRecordData[]>([])

  const { currentPage, paginatedList, perPage, onPageChange } = usePagination(records, 1, 10)

  const stat = computed(() => {
    let damage = 0
    let kills = 0
    if (isRequesting.value)
      return {
        damage,
        kills,
        isValid: false
      }
    records.value.forEach((v) => {
      damage += v.participant.stats.combat.damage.damage_dealt
      kills += v.participant.stats.combat.kda.kills
    })
    return {
      damage,
      kills,
      name: records.value[0]?.participant.user.nickname || '',
      isValid: records.value.length > 0
    }
  })

  async function fetchPubgRecord(userId: string, offset = '', startDate = '', endDate = '') {
    const innerFetch = async (iOffset = '') => {
      try {
        isRequesting.value = true
        const params = {
          queue_size: 4,
          mode: 'tpp',
          type: 'official',
          after: iOffset
        }
        const resp = await axios.get(`/api/pubg-record/${userId}`, {
          params
        })
        const last = resp.data.matches.items[resp.data.matches.items.length - 1]
        if (records.value.some((v) => v.match_id === last.match_id)) {
          return
        }
        console.log(startDate, endDate)
        if (!startDate) {
          startDate = dayjs().subtract(1, 'day').toString()
        }
        if (!endDate) {
          endDate = dayjs().toString()
        }
        const startDay = dayjs(startDate).subtract(8, 'hour')
        const endDay = dayjs(endDate).subtract(8, 'hour')
        records.value = records.value.concat(resp.data.matches.items).filter((v) => dayjs(v.started_at).isAfter(startDay) && dayjs(v.started_at).isBefore(endDay))
        if (last.offset && dayjs(last.started_at).isAfter(startDay)) {
          await innerFetch(last.offset)
        }
      } catch (error) {
        console.error(error)
      } finally {
        isRequesting.value = false
      }
    }
    records.value = []
    await innerFetch(offset)
  }

  return {
    isRequesting,
    records,
    stat,
    fetchPubgRecord,
    currentPage,
    paginatedList,
    perPage,
    onPageChange
  }
}
