import { ref } from 'vue'

const showFavoritesOnly = ref(false)
const favorites = ref<Set<string>>(new Set())

export function useFavorites() {
  const toggleFavoritesFilter = () => {
    showFavoritesOnly.value = !showFavoritesOnly.value
  }

  const setShowFavoritesOnly = (value: boolean) => {
    showFavoritesOnly.value = value
  }

  const loadFavoritesFromAPI = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/favorites')
      if (response.ok) {
        const favoritesData: string[] = await response.json()
        // Capitalize breed names to match the display format
        const capitalizedFavorites = favoritesData.map(
          (breed) => breed.charAt(0).toUpperCase() + breed.slice(1),
        )
        favorites.value = new Set(capitalizedFavorites)
      }
    } catch (error) {
      console.error('Error loading favorites from API:', error)
    }
  }

  const addToFavoritesAPI = async (breed: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ breed: breed.toLowerCase() }),
      })

      if (!response.ok) {
        throw new Error('Failed to add to favorites')
      }

      favorites.value.add(breed)
    } catch (error) {
      console.error('Error adding to favorites:', error)
      throw error
    }
  }

  const removeFromFavoritesAPI = async (breed: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/favorites/${breed.toLowerCase()}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to remove from favorites')
      }

      favorites.value.delete(breed)
    } catch (error) {
      console.error('Error removing from favorites:', error)
      throw error
    }
  }

  const toggleFavorite = async (breed: string, isFavorite: boolean) => {
    try {
      if (isFavorite) {
        await addToFavoritesAPI(breed)
      } else {
        await removeFromFavoritesAPI(breed)
      }
    } catch (error) {
      // Return the error to let the caller handle it
      throw error
    }
  }

  const isFavorite = (breed: string) => {
    return favorites.value.has(breed)
  }

  return {
    showFavoritesOnly,
    favorites,
    toggleFavoritesFilter,
    setShowFavoritesOnly,
    loadFavoritesFromAPI,
    toggleFavorite,
    isFavorite,
  }
}
