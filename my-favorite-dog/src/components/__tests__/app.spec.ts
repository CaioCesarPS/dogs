import { test, expect } from '@playwright/test'

test.describe('My Favorite Dog App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('visits the app root url', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'My Favorite Dog' })).toBeVisible()
  })

  test('displays the main components', async ({ page }) => {
    // Check if AppHeader is present
    await expect(page.locator('header')).toBeVisible()

    // Check if the search input is present
    await expect(page.locator('input[placeholder*="Pesquisar"]')).toBeVisible()

    // Check if the favorites button is present
    await expect(page.locator('button:has-text("Favoritos")')).toBeVisible()
  })
})
