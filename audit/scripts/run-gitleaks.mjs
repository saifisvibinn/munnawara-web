import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const reports = join(root, 'audit', 'reports')
mkdirSync(reports, { recursive: true })

const exe = process.platform === 'win32'
  ? join(root, 'tools', 'gitleaks', 'gitleaks.exe')
  : join(root, 'tools', 'gitleaks', 'gitleaks')

if (!existsSync(exe)) {
  console.error('Gitleaks binary not found at', exe)
  console.error('Re-download from https://github.com/gitleaks/gitleaks/releases')
  process.exit(1)
}

const reportPath = join(reports, 'gitleaks.json')
const args = [
  'detect',
  '--source', root,
  '--report-path', reportPath,
  '--report-format', 'json',
  '--no-banner',
  '--redact',
]

const result = spawnSync(exe, args, { stdio: 'inherit', cwd: root })
console.log('Report written to', reportPath, '(redacted; do not commit if sensitive)')
process.exit(result.status ?? 1)
