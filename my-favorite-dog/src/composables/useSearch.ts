import { ref, computed } from 'vue'

const searchQuery = ref('')
const isSearching = ref(false)

export const useSearch = () => {
  const setSearchQuery = (query: string) => {
    searchQuery.value = query.trim()
  }

  const clearSearch = () => {
    searchQuery.value = ''
  }

  const hasSearchQuery = computed(() => searchQuery.value.length > 0)

  return {
    searchQuery: computed(() => searchQuery.value),
    isSearching: computed(() => isSearching.value),
    hasSearchQuery,
    setSearchQuery,
    clearSearch,
    setIsSearching: (value: boolean) => {
      isSearching.value = value
    },
  }
}
