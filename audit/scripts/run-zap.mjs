import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const reports = join(root, 'audit', 'reports')
mkdirSync(reports, { recursive: true })

const target = process.env.AUDIT_BASE_URL || 'http://localhost:3000'
const reportHtml = join(reports, 'zap-baseline.html')
const reportJson = join(reports, 'zap-baseline.json')

const findZapHome = () => {
  const base = join(root, 'tools', 'zap')
  if (!existsSync(base)) return null
  const kids = readdirSync(base, { withFileTypes: true }).filter((d) => d.isDirectory())
  for (const kid of kids) {
    const home = join(base, kid.name)
    if (existsSync(join(home, 'zap-2.17.0.jar')) || existsSync(join(home, 'zap.jar'))) return home
  }
  return null
}

const zapHome = findZapHome()

if (zapHome) {
  const jar = existsSync(join(zapHome, 'zap-2.17.0.jar'))
    ? join(zapHome, 'zap-2.17.0.jar')
    : join(zapHome, 'zap.jar')
  console.log('OWASP ZAP (portable via java -jar) →', target)
  console.log('Using', jar)
  // Invoke java directly so paths with spaces (e.g. "Durrah Care") work on Windows.
  const args = [
    '-Xmx512m',
    '-jar', jar,
    '-cmd',
    '-quickurl', target,
    '-quickout', reportHtml,
    '-quickprogress',
  ]
  const result = spawnSync('java', args, {
    stdio: 'inherit',
    cwd: zapHome,
    env: { ...process.env },
  })
  console.log('HTML report:', reportHtml)
  process.exit(result.status ?? 1)
}

console.log('Portable ZAP not found under tools/zap.')
console.log('Trying Docker image ghcr.io/zaproxy/zaproxy:stable (requires Docker Desktop running)...')

const dockerArgs = [
  'run',
  '--rm',
  '-v', `${reports}:/zap/wrk:rw`,
  'ghcr.io/zaproxy/zaproxy:stable',
  'zap-baseline.py',
  '-t', target,
  '-r', 'zap-baseline.html',
  '-J', 'zap-baseline.json',
]

const docker = spawnSync('docker', dockerArgs, { stdio: 'inherit', shell: true })
if (docker.error || docker.status === 127) {
  console.error('ZAP unavailable: install portable Core under tools/zap or start Docker Desktop.')
  console.error('Download: https://github.com/zaproxy/zaproxy/releases/download/v2.17.0/ZAP_2.17.0_Core.zip')
  process.exit(1)
}
console.log('Reports:', reportHtml, reportJson)
process.exit(docker.status ?? 1)
