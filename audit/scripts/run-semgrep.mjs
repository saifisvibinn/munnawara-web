import { spawnSync } from 'node:child_process'
import { mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const reports = join(root, 'audit', 'reports')
mkdirSync(reports, { recursive: true })

const env = {
  ...process.env,
  PYTHONUTF8: '1',
}

const reportPath = join(reports, 'semgrep.json')
// Relative -o avoids Windows path-with-spaces issues through the shell.
const reportRel = 'audit/reports/semgrep.json'

// Prefer community packs that work without Semgrep login.
const configs = ['p/javascript', 'p/typescript', 'p/react', 'p/nextjs']
const args = [
  'scan',
  ...configs.flatMap((c) => ['--config', c]),
  '--json',
  '-o', reportRel,
  '--metrics=off',
  '.',
]

console.log('Running: semgrep', args.join(' '))
const result = spawnSync('semgrep', args, {
  stdio: 'inherit',
  cwd: root,
  env,
  shell: true,
})

if (result.error) {
  console.error('semgrep not found on PATH. Install with: uv tool install semgrep')
  process.exit(1)
}

if (!existsSync(reportPath)) {
  console.error('Expected report missing:', reportPath)
  process.exit(1)
}

console.log('Report written to', reportPath)
// Semgrep exits non-zero when findings exist; the audit script still succeeded.
process.exit(0)
