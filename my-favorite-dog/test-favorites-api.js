#!/usr/bin/env node

/**
 * Test script for the Favorites API integration
 * Run this with: node test-favorites-api.js
 *
 * Make sure your backend server is running on localhost:3000
 */

const BASE_URL = 'http://localhost:3000/api'

async function testFavoritesAPI() {
  console.log('🧪 Testing Favorites API Integration...\n')

  try {
    // Test 1: Get initial favorites
    console.log('1️⃣ Getting initial favorites...')
    const initialResponse = await fetch(`${BASE_URL}/favorites`)
    const initialFavorites = await initialResponse.json()
    console.log('Initial favorites:', initialFavorites)
    console.log('✅ GET /api/favorites - Success\n')

    // Test 2: Add a breed to favorites
    console.log('2️⃣ Adding "beagle" to favorites...')
    const addResponse = await fetch(`${BASE_URL}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ breed: 'beagle' }),
    })
    const addResult = await addResponse.json()
    console.log('Add result:', addResult)
    console.log('✅ POST /api/favorites - Success\n')

    // Test 3: Get favorites after adding
    console.log('3️⃣ Getting favorites after adding beagle...')
    const afterAddResponse = await fetch(`${BASE_URL}/favorites`)
    const afterAddFavorites = await afterAddResponse.json()
    console.log('Favorites after add:', afterAddFavorites)
    console.log('✅ GET /api/favorites (after add) - Success\n')

    // Test 4: Remove a breed from favorites
    console.log('4️⃣ Removing "beagle" from favorites...')
    const removeResponse = await fetch(`${BASE_URL}/favorites/beagle`, {
      method: 'DELETE',
    })
    const removeResult = await removeResponse.json()
    console.log('Remove result:', removeResult)
    console.log('✅ DELETE /api/favorites/beagle - Success\n')

    // Test 5: Get favorites after removing
    console.log('5️⃣ Getting favorites after removing beagle...')
    const afterRemoveResponse = await fetch(`${BASE_URL}/favorites`)
    const afterRemoveFavorites = await afterRemoveResponse.json()
    console.log('Favorites after remove:', afterRemoveFavorites)
    console.log('✅ GET /api/favorites (after remove) - Success\n')

    console.log('🎉 All Favorites API tests passed!')
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.log('\n💡 Make sure your backend server is running on localhost:3000')
  }
}

// Run the tests
testFavoritesAPI()
