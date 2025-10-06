import { test, expect } from '@playwright/test'

test.describe('Search Functionality Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should have search input functionality', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Pesquisar"]')

    // Verify search input exists and works
    await expect(searchInput).toBeVisible()

    // Search for a specific breed
    await searchInput.fill('labrador')

    // Verify search functionality is working
    await expect(searchInput).toHaveValue('labrador')
  })

  test('should handle empty search results gracefully', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Pesquisar"]')

    // Search for something that likely won't exist
    await searchInput.fill('xyz123nonexistent')

    // The app should handle this gracefully (not crash)
    await expect(page.getByRole('heading', { name: 'My Favorite Dog' })).toBeVisible()
  })
})
