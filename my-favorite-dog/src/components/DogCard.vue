<template>
  <Card
    class="w-full max-w-sm overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
    @click="handleClick"
  >
    <div class="relative">
      <img :src="breedGroup.coverImage" :alt="breedGroup.breed" class="w-full h-48 object-cover" />
      <Button
        @click.stop="toggleFavorite"
        variant="secondary"
        size="icon"
        class="absolute top-2 right-2 bg-white/80 hover:bg-white/90"
      >
        <Heart :class="['h-4 w-4', isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600']" />
      </Button>
    </div>

    <CardHeader class="pb-2">
      <CardTitle class="text-lg font-semibold">
        {{ breedGroup.breed }}
      </CardTitle>
    </CardHeader>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Heart } from 'lucide-vue-next'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface BreedGroup {
  breed: string
  images: string[]
  coverImage: string
}

interface Props {
  breedGroup: BreedGroup
  initialFavorite?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialFavorite: false,
})

const emit = defineEmits<{
  favorite: [breed: string, isFavorite: boolean]
  click: [breedGroup: BreedGroup]
}>()

// Use computed to make it reactive to prop changes
const isFavorite = computed(() => props.initialFavorite)

const toggleFavorite = () => {
  emit('favorite', props.breedGroup.breed, !isFavorite.value)
}

const handleClick = () => {
  emit('click', props.breedGroup)
}
</script>

<style scoped>
/* Estilos específicos podem ser adicionados aqui se necessário */
</style>
