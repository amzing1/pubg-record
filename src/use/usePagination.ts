import { computed, ref, type Ref } from 'vue'

export function usePagination<T>(list: Ref<T[]>, page = 1, perPage = 10) {
  const currentPage = ref(page)

  const paginatedList = computed(() => {
    const start = (currentPage.value - 1) * perPage
    const end = start + perPage
    return list.value.slice(start, end)
  })

  function onPageChange(page: number) {
    currentPage.value = page
  }

  return {
    currentPage,
    paginatedList,
    onPageChange,
    perPage
  }
}
