import { mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { chromium } from '@playwright/test'

const require = createRequire(import.meta.url)
const axeSource = require('axe-core').source

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const reports = join(root, 'audit', 'reports')
mkdirSync(reports, { recursive: true })

const base = process.env.AUDIT_BASE_URL || 'http://localhost:3000'
const paths = (process.env.AUDIT_PATHS || '/en,/en/about,/en/quote').split(',').map((p) => p.trim()).filter(Boolean)

const browser = await chromium.launch()
let failed = false

try {
  for (const path of paths) {
    const url = new URL(path, base).toString()
    const slug = path.replace(/[^\w]+/g, '-').replace(/^-|-$/g, '') || 'root'
    const out = join(reports, `axe-${slug}.json`)
    console.log('axe (Playwright) →', url)

    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 })
    await page.addScriptTag({ content: axeSource })
    const results = await page.evaluate(async () => {
      // @ts-expect-error axe injected
      return await window.axe.run(document, {
        resultTypes: ['violations', 'incomplete'],
      })
    })
    await page.close()

    writeFileSync(out, JSON.stringify(results, null, 2))
    const count = results.violations?.length ?? 0
    console.log(`Wrote ${out} (${count} violations)`)
    if (count > 0) failed = true
  }
} finally {
  await browser.close()
}

process.exit(failed ? 1 : 0)
