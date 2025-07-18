<script setup lang="ts">
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { onMounted } from 'vue';
import { usePubgRecord } from '../use/usePubgRecord';

const props = defineProps<{
  userId: string
}>()

const { records, stat, fetchPubgRecord } = usePubgRecord()

onMounted(() => fetchPubgRecord(props.userId))

defineExpose({
  stat
})
</script>
<template>
  <Table class="max-w-[600px]" v-if="records.length">
    <TableCaption>{{ records[0].participant.user.nickname }} 最近 24 小时个人战绩统计</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>名称</TableHead>
        <TableHead>击杀数</TableHead>
        <TableHead>伤害量</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="item in records" :key="item._id">
        <TableCell class="font-medium">
          {{ item.participant.user.nickname }}
        </TableCell>
        <TableCell>{{ item.participant.stats.combat.kda.kills }}</TableCell>
        <TableCell>{{ item.participant.stats.combat.damage.damage_dealt }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
