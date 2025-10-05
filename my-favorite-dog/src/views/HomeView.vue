<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import DogCard from '@/components/DogCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useSearch } from '@/composables/useSearch'
import { useFavorites } from '@/composables/useFavorites'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { baseUrl } from '@/utils/baseUrl'

interface BreedGroup {
  breed: string
  images: string[]
  coverImage: string
}

const breedGroups = ref<BreedGroup[]>([])
const searchResults = ref<BreedGroup[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const selectedBreed = ref<BreedGroup | null>(null)
const isModalOpen = ref(false)
const isLoadingModalImages = ref(false)

const { searchQuery, isSearching, setIsSearching } = useSearch()
const { showFavoritesOnly, favorites, loadFavoritesFromAPI, toggleFavorite, isFavorite } =
  useFavorites()

// Função para capitalizar a primeira letra
const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Função para buscar dados da API
const fetchDogsFromAPI = async () => {
  try {
    loading.value = true
    error.value = null

    // Buscar todas as raças disponíveis
    const breedsResponse = await fetch(`${baseUrl}/api/breeds`)
    // console.log('breedsResponse:', await breedsResponse.json())
    if (!breedsResponse.ok) {
      throw new Error('Falha ao buscar raças')
    }
    const breeds: string[] = await breedsResponse.json()

    // Usar todas as raças disponíveis
    const selectedBreeds = breeds

    // Buscar imagens de todas as raças em paralelo para melhor performance
    const breedPromises = selectedBreeds.map(async (breed) => {
      try {
        const imagesResponse = await fetch(`${baseUrl}/api/breeds/${breed}/images/1`)
        if (imagesResponse.ok) {
          const images: string[] = await imagesResponse.json()

          if (images.length > 0) {
            return {
              breed: capitalize(breed),
              images: images,
              coverImage: images[0]!, // Primeira imagem como capa
            }
          }
        }
        return null
      } catch (breedError) {
        console.warn(`Erro ao buscar imagens para a raça ${breed}:`, breedError)
        return null
      }
    })

    // Aguardar todas as promises e filtrar resultados válidos
    const breedResults = await Promise.all(breedPromises)
    const breedGroupsData = breedResults.filter((result): result is BreedGroup => result !== null)

    // Ordenar por nome da raça
    breedGroups.value = breedGroupsData.sort((a, b) => {
      return a.breed.localeCompare(b.breed)
    })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro desconhecido'
    console.error('Erro ao buscar dados dos cachorros:', err)
  } finally {
    loading.value = false
  }
}

// Função para buscar cachorros por raça específica (quantity=1 para a busca)
const searchDogsByBreed = async (breed: string) => {
  try {
    setIsSearching(true)

    const imagesResponse = await fetch(
      `${baseUrl}/api/breeds/${breed.toLowerCase()}/images/1`,
    )
    if (!imagesResponse.ok) {
      throw new Error(`Raça "${breed}" não encontrada`)
    }

    const images: string[] = await imagesResponse.json()

    if (images.length > 0) {
      const searchBreedGroup: BreedGroup = {
        breed: capitalize(breed),
        images: images,
        coverImage: images[0]!,
      }

      searchResults.value = [searchBreedGroup]
    } else {
      searchResults.value = []
    }
  } catch (err) {
    console.error('Erro ao buscar cachorro:', err)
    searchResults.value = []
  } finally {
    setIsSearching(false)
  }
}

// Computed para decidir quais grupos de raças mostrar
const displayedBreedGroups = computed(() => {
  if (searchQuery.value.length > 0) {
    return searchResults.value
  }

  if (showFavoritesOnly.value) {
    return breedGroups.value.filter((breedGroup) => favorites.value.has(breedGroup.breed))
  }

  return breedGroups.value
})

// Função para buscar mais imagens de uma raça para o modal (quantity=3)
const fetchBreedImagesForModal = async (breed: string) => {
  try {
    const imagesResponse = await fetch(
      `${baseUrl}/api/breeds/${breed.toLowerCase()}/images/3`,
    )
    if (imagesResponse.ok) {
      const images: string[] = await imagesResponse.json()
      return images
    }
    return []
  } catch (error) {
    console.error(`Erro ao buscar imagens para o modal da raça ${breed}:`, error)
    return []
  }
}

// Função para abrir o modal com todas as imagens da raça
const openBreedModal = async (breedGroup: BreedGroup) => {
  // Abrir o modal imediatamente com a imagem atual
  selectedBreed.value = breedGroup
  isModalOpen.value = true
  isLoadingModalImages.value = true

  // Buscar mais imagens para o modal (quantity=3)
  const modalImages = await fetchBreedImagesForModal(breedGroup.breed)

  // Atualizar o selectedBreed com as novas imagens
  if (modalImages.length > 0) {
    selectedBreed.value = {
      ...breedGroup,
      images: modalImages,
    }
  }

  isLoadingModalImages.value = false
}

// Watcher para reagir às mudanças na pesquisa
watch(searchQuery, (newQuery) => {
  if (newQuery.length > 0) {
    searchDogsByBreed(newQuery)
  } else {
    searchResults.value = []
  }
})

const handleFavorite = async (breed: string, isFavorite: boolean) => {
  try {
    await toggleFavorite(breed, isFavorite)
  } catch (error) {
    console.error('Error handling favorite:', error)
    // Optionally show an error message to the user
  }
}

// Buscar dados quando o componente for montado
onMounted(async () => {
  await Promise.all([fetchDogsFromAPI(), loadFavoritesFromAPI()])
})
</script>

<template>
  <main class="container mx-auto px-4 py-8">
    <!-- Cabeçalho simples -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">
        {{
          searchQuery.length > 0
            ? 'Resultados da Pesquisa'
            : showFavoritesOnly
              ? 'Apenas os Favoritos'
              : 'Todas as Raças'
        }}
      </h1>
      <p v-if="searchQuery.length > 0" class="text-sm text-gray-600 mt-1">
        Pesquisando por: <span class="font-semibold">"{{ searchQuery }}"</span>
      </p>
    </div>

    <!-- Estado de Loading -->
    <LoadingSpinner
      v-if="loading || isSearching"
      :message="isSearching ? 'Buscando cachorros...' : 'Carregando cachorros...'"
    />

    <!-- Estado de Erro -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      <h2 class="font-semibold mb-2">Erro ao carregar dados</h2>
      <p>{{ error }}</p>
    </div>

    <!-- Lista de Raças -->
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <DogCard
          v-for="breedGroup in displayedBreedGroups"
          :key="breedGroup.breed"
          :breed-group="breedGroup"
          :initial-favorite="isFavorite(breedGroup.breed)"
          @favorite="handleFavorite"
          @click="openBreedModal"
        />
      </div>

      <!-- Mensagem quando não há raças -->
      <div
        v-if="displayedBreedGroups.length === 0 && !loading && !isSearching"
        class="text-center py-12"
      >
        <p class="text-gray-600 text-lg">
          {{
            searchQuery.length > 0
              ? `Nenhuma raça encontrada para "${searchQuery}"`
              : showFavoritesOnly
                ? 'Nenhum cachorro favoritado ainda. Favorite alguns cachorros para vê-los aqui!'
                : 'Nenhuma raça encontrada'
          }}
        </p>
      </div>
    </div>

    <!-- Modal com galeria de imagens da raça -->
    <Dialog v-model:open="isModalOpen">
      <DialogContent class="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle v-if="selectedBreed" class="text-2xl font-bold">
            {{ selectedBreed.breed }}
          </DialogTitle>
          <DialogDescription> Todas as imagens disponíveis desta raça </DialogDescription>
        </DialogHeader>

        <div v-if="selectedBreed" class="flex flex-col gap-6 mt-4">
          <!-- Loading spinner para imagens do modal -->
          <div v-if="isLoadingModalImages" class="flex justify-center py-8">
            <LoadingSpinner message="Carregando mais imagens..." />
          </div>

          <!-- Imagens da raça -->
          <div
            v-for="(image, index) in selectedBreed.images"
            :key="index"
            class="relative group cursor-pointer"
          >
            <img
              :src="image"
              :alt="`${selectedBreed.breed} ${index + 1}`"
              class="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg hover:scale-105 transition-transform duration-200"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </main>
</template>
