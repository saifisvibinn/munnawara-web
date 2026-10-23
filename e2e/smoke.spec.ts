import { expect, test } from '@playwright/test'

test.describe('smoke', () => {
  test('home redirects to a locale route', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/(ar|en|fr|id)(\/|$)/)
  })

  test('English home renders', async ({ page }) => {
    await page.goto('/en')
    await expect(page.locator('body')).toBeVisible()
  })

  test('About and Quote routes load without page errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(String(err)))

    await page.goto('/en/about', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(/\/en\/about/)
    await expect(page.locator('html')).toBeAttached()

    await page.goto('/en/quote', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(/\/en\/quote/)
    await expect(page.locator('html')).toBeAttached()

    expect(errors, errors.join('\n')).toEqual([])
  })
})

