import { spawnSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const reports = join(root, 'audit', 'reports')
mkdirSync(reports, { recursive: true })

const base = process.env.AUDIT_BASE_URL || 'http://localhost:3000'
const paths = (process.env.AUDIT_PATHS || '/en,/en/about,/en/quote').split(',').map((p) => p.trim()).filter(Boolean)

let failed = false
for (const path of paths) {
  const url = new URL(path, base).toString()
  const slug = path.replace(/[^\w]+/g, '-').replace(/^-|-$/g, '') || 'root'
  const out = join(reports, `lighthouse-${slug}.html`)
  console.log('Lighthouse →', url)
  const result = spawnSync(
    'npx',
    [
      'lighthouse',
      url,
      '--only-categories=performance,accessibility,best-practices,seo',
      '--output=html',
      `--output-path=${out}`,
      '--chrome-flags=--headless --no-sandbox',
      '--quiet',
    ],
    { stdio: 'inherit', cwd: root, shell: true },
  )
  if ((result.status ?? 1) !== 0) failed = true
  else console.log('Wrote', out)
}

process.exit(failed ? 1 : 0)
