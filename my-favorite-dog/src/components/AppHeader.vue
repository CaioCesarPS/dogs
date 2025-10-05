<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSearch } from '@/composables/useSearch'
import { useFavorites } from '@/composables/useFavorites'

const { setSearchQuery, searchQuery } = useSearch()
const { showFavoritesOnly, toggleFavoritesFilter } = useFavorites()
const localSearchQuery = ref('')

// Controle do timeout para limpeza adequada
let searchTimeout: number | null = null

// Watch para debounce mais eficiente da busca
watch(
  localSearchQuery,
  (newQuery) => {
    // Limpar timeout anterior
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // Configurar novo timeout com delay menor (300ms)
    searchTimeout = setTimeout(() => {
      setSearchQuery(newQuery)
    }, 300)
  },
  { immediate: false },
)

// Limpeza do timeout ao desmontar o componente
onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})

const handleFavoritesClick = () => {
  // Limpar busca se necessário
  if (searchQuery.value.length > 0) {
    localSearchQuery.value = ''
    setSearchQuery('')
  }
  toggleFavoritesFilter()
}
</script>

<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between gap-4">
        <!-- Logo/Nome da aplicação -->
        <div class="flex-shrink-0">
          <h1 class="text-2xl font-bold text-gray-900">My Favorite Dog</h1>
        </div>

        <!-- Barra de pesquisa -->
        <div class="flex-1 max-w-md mx-4">
          <div class="relative">
            <Input
              type="text"
              placeholder="Pesquisar cachorros..."
              v-model="localSearchQuery"
              class="w-full pl-10 pr-4"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Botão de favoritos -->
        <div class="flex-shrink-0">
          <Button
            @click="handleFavoritesClick"
            :variant="showFavoritesOnly ? 'default' : 'outline'"
            class="flex items-center gap-2"
          >
            <svg
              class="h-5 w-5"
              :class="showFavoritesOnly ? 'text-white' : 'text-red-500'"
              fill="currentColor"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {{ showFavoritesOnly ? 'Mostrar Todos' : 'Favoritos' }}
          </Button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Estilos adicionais se necessário */
</style>
