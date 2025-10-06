import { test, expect } from '@playwright/test'

test.describe('Favorites Functionality Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should have favorites button', async ({ page }) => {
    const favoritesButton = page
      .getByRole('button')
      .filter({ hasText: 'Favoritos' })
      .or(page.getByRole('button').filter({ hasText: 'Mostrar Todos' }))

    // Verify the button exists
    await expect(favoritesButton).toBeVisible()
  })

  test('should maintain page functionality with favorites interactions', async ({ page }) => {
    // Verify basic functionality
    const searchInput = page.locator('input[placeholder*="Pesquisar"]')
    await expect(searchInput).toBeVisible()

    // Try to interact with search
    await searchInput.fill('test')
    await expect(searchInput).toHaveValue('test')

    // The app should maintain functionality
    await expect(page.getByRole('heading', { name: 'My Favorite Dog' })).toBeVisible()
  })
})
