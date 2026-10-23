# Audit toolkit

Local scripts for dependency, secret, SAST, axe, Lighthouse, and ZAP checks.

Reports write to `audit/reports/` (gitignored). Scanner binaries live under `tools/` (also gitignored) — see `tools/README.md`.

```bash
npm run audit:all-static   # deps + gitleaks + semgrep
npm run audit:axe          # needs app on AUDIT_BASE_URL (default :3000)
npm run audit:lighthouse
npm run audit:zap
npm run test:e2e           # Playwright crawl + flows
```

Agent security/UI skills are not vendored here — install globally if needed (`npx skills add …`).
