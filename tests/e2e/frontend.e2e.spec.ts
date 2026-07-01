import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('can load homepage', async ({ page }) => {
    // Don't wait for the `load` event: in dev the hero image is optimized
    // on-demand (slow cold AVIF encode) and can exceed the navigation timeout.
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveTitle(/Zwicker/)
    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible()
  })
})
