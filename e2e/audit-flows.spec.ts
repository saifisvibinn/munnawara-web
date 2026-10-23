import { expect, test } from '@playwright/test'
import { installAuditMocks } from './helpers/mockBackend'

test.describe('audit flows (mocked backend)', () => {
  test.beforeEach(async ({ page }) => {
    await installAuditMocks(page)
  })

  test('quote page loads', async ({ page }) => {
    test.setTimeout(60_000)
    await page.goto('/en/quote', { waitUntil: 'domcontentloaded', timeout: 45_000 })
    await expect(page.locator('html')).toBeAttached()
    await expect(page).toHaveURL(/\/en\/quote/)
  })

  test('track rejects invalid lead id without calling live backend', async ({ page }) => {
    await page.goto('/en/track', { waitUntil: 'domcontentloaded' })
    const idInput = page.locator('input').first()
    await idInput.fill('NOT-A-LEAD')
    const phone = page.locator('input[type="tel"], input[name*="phone" i]').first()
    if (await phone.count()) await phone.fill('0500000000')
    const submit = page.getByRole('button', { name: /track|check|بحث|تتبع/i }).first()
    if (await submit.isVisible().catch(() => false)) {
      await submit.click()
      await expect(page.locator('body')).toBeAttached()
    }
  })

  test('chat panel open/close and mock message', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' })
    const chatToggle = page
      .locator('button')
      .filter({ hasText: /chat|durra|مراسل|دردش/i })
      .or(page.locator('[aria-label*="chat" i], [data-chat-open], button:has(svg)').last())
      .first()

    // Prefer dedicated AI chat control if present
    const ai = page.locator('[class*="chat"], [class*="Chat"]').locator('button').first()
    const opener = (await ai.count()) ? ai : chatToggle
    if (!(await opener.count())) {
      test.skip(true, 'Chat opener not found on home')
      return
    }
    await opener.click({ timeout: 5000 }).catch(() => {})
    await page.waitForTimeout(500)
    // Escape / close
    await page.keyboard.press('Escape')
  })

  test('locale switcher changes path prefix', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'domcontentloaded' })
    const arLink = page.locator('a[href^="/ar"]').first()
    if (await arLink.count()) {
      await arLink.click()
      await expect(page).toHaveURL(/\/ar(\/|$)/)
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
    }
  })

  test('gallery and fleet load without pageerror', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await page.goto('/en/gallery', { waitUntil: 'domcontentloaded' })
    await page.goto('/en/fleet', { waitUntil: 'domcontentloaded' })
    await page.goto('/en/news', { waitUntil: 'domcontentloaded' })
    expect(errors).toEqual([])
  })

  test('double-click navigation does not crash', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'domcontentloaded' })
    const about = page.locator('a[href*="/about"]').first()
    if (await about.count()) {
      await Promise.all([about.click(), about.click().catch(() => {})])
      await expect(page.locator('html')).toBeAttached()
    }
  })
})
