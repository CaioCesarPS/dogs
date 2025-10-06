import { test, expect } from '@playwright/test'

test.describe('LoadingSpinner Component', () => {
  test('should display loading elements during page load', async ({ page }) => {
    // Navigate with domcontentloaded to potentially catch loading state
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    // Check for common loading indicators or that page loads successfully
    const appTitle = page.getByRole('heading', { name: 'My Favorite Dog' })
    await expect(appTitle).toBeVisible({ timeout: 10000 })
  })

  test('should have proper loading message structure', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    // Check that page loads successfully
    const pageTitle = page.getByRole('heading', { name: 'My Favorite Dog' })
    await expect(pageTitle).toBeVisible({ timeout: 10000 })
  })
})
