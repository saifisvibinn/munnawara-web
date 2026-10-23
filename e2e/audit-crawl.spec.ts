import { expect, test } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { installAuditMocks } from './helpers/mockBackend'

const locales = ['ar', 'en', 'fr', 'id'] as const
const paths = [
  '',
  '/about',
  '/companies',
  '/companies/tourism',
  '/companies/transport',
  '/companies/umrah-services',
  '/companies/hospitality-catering',
  '/fleet',
  '/corporate',
  '/clients',
  '/gallery',
  '/news',
  '/news/does-not-exist-audit',
  '/contact',
  '/quote',
  '/track',
  '/this-route-should-404',
] as const

const viewports = [
  { name: 'm375', width: 375, height: 812 },
  { name: 'm390', width: 390, height: 844 },
  { name: 't768', width: 768, height: 1024 },
  { name: 'd1024', width: 1024, height: 768 },
  { name: 'd1440', width: 1440, height: 900 },
] as const

const screenDir = join('audit', 'reports', 'screens')
mkdirSync(screenDir, { recursive: true })

test.describe.configure({ mode: 'serial' })

for (const vp of viewports) {
  test.describe(`crawl ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } })

    for (const locale of locales) {
      // Full matrix is huge; sample en+ar at every viewport, fr/id at 390+1440 only.
      const runLocale =
        locale === 'en' ||
        locale === 'ar' ||
        (locale === 'fr' && (vp.name === 'm390' || vp.name === 'd1440')) ||
        (locale === 'id' && (vp.name === 'm390' || vp.name === 'd1440'))
      if (!runLocale) continue

      test(`${locale} routes @ ${vp.name}`, async ({ page }) => {
        await installAuditMocks(page)
        const issues: string[] = []

        page.on('pageerror', (err) => issues.push(`pageerror:${err.message}`))
        page.on('console', (msg) => {
          if (msg.type() === 'error') issues.push(`console:${msg.text()}`)
        })

        for (const path of paths) {
          const url = `/${locale}${path}`
          const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 })
          const status = response?.status() ?? 0
          if (path.includes('does-not-exist') || path.includes('should-404')) {
            if (status !== 404 && status !== 200) {
              issues.push(`${url} unexpected status ${status}`)
            }
          } else if (status >= 500) {
            issues.push(`${url} status ${status}`)
          }

          const overflow = await page.evaluate(() => {
            const doc = document.documentElement
            return {
              scrollWidth: doc.scrollWidth,
              clientWidth: doc.clientWidth,
              brokenImages: [...document.images]
                .filter((img) => img.complete && img.naturalWidth === 0 && img.src)
                .map((img) => img.src)
                .slice(0, 5),
            }
          })
          if (overflow.scrollWidth > overflow.clientWidth + 2) {
            issues.push(`${url} horizontal overflow ${overflow.scrollWidth}>${overflow.clientWidth}`)
            const slug = `${locale}${path || '-home'}`.replace(/[^\w]+/g, '-')
            await page.screenshot({
              path: join(screenDir, `overflow-${vp.name}-${slug}.png`),
              fullPage: true,
            })
          }
          if (overflow.brokenImages.length) {
            issues.push(`${url} broken images: ${overflow.brokenImages.join(', ')}`)
          }
        }

        // Spot screenshot of home + quote for each locale/viewport sample
        await page.goto(`/${locale}`, { waitUntil: 'domcontentloaded' })
        await page.screenshot({
          path: join(screenDir, `home-${vp.name}-${locale}.png`),
          fullPage: false,
        })

        const ignored = [/favicon/i, /Download the React DevTools/i, /Failed to load resource/i]
        const actionable = issues.filter((i) => !ignored.some((re) => re.test(i)))
        expect.soft(actionable, actionable.join('\n')).toEqual([])
      })
    }
  })
}
