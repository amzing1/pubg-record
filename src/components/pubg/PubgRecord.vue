<script setup lang="ts">
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { usePubgRecord } from '@/use/usePubgRecord'

const props = defineProps<{
  userId: string
}>()

const { records, stat, fetchPubgRecord, currentPage, perPage, onPageChange, paginatedList } = usePubgRecord()

defineExpose({
  stat,
  fetchPubgRecord: (startDate: string, endDate: string) => {
    fetchPubgRecord(props.userId, '', startDate, endDate)
  }
})
</script>
<template>
  <div class="max-w-[600px]">
    <Table v-if="records.length">
      <!-- <TableCaption>{{ records[0].participant.user.nickname }} 最近 24 小时个人战绩统计</TableCaption> -->
      <TableHeader>
        <TableRow>
          <TableHead>名称</TableHead>
          <TableHead>击杀数</TableHead>
          <TableHead>伤害量</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="item in paginatedList" :key="item.match_id">
          <TableCell class="font-medium">
            {{ item.participant.user.nickname }}
          </TableCell>
          <TableCell>{{ item.participant.stats.combat.kda.kills }}</TableCell>
          <TableCell>{{ item.participant.stats.combat.damage.damage_dealt }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <div class="mt-4 max-w-[480px]">
      <Pagination
        v-slot="{ page }"
        :items-per-page="perPage"
        :total="records.length"
        :default-page="currentPage"
        @update:page="onPageChange"
        v-if="records.length && records.length > perPage"
      >
        <PaginationContent v-slot="{ items }">
          <PaginationPrevious />

          <template v-for="(item, index) in items" :key="index">
            <PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === page" @click="currentPage = item.value">
              {{ item.value }}
            </PaginationItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template>

          <PaginationNext />
        </PaginationContent>
      </Pagination>
    </div>
  </div>
</template>
