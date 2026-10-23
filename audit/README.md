# Audit toolkit

Reusable security, UI/UX, and performance audit helpers for Munawwara Web (Next.js 15).

## Quick commands

| Script | Purpose |
|--------|---------|
| `npm run audit:deps` | npm dependency vulnerabilities |
| `npm run audit:secrets` | Gitleaks (redacted JSON under `audit/reports/`) |
| `npm run audit:semgrep` | Semgrep SAST |
| `npm run audit:axe` | axe-core accessibility (needs app running) |
| `npm run audit:lighthouse` | Lighthouse HTML reports (needs app running) |
| `npm run audit:zap` | OWASP ZAP quick/baseline (local URL only) |
| `npm run audit:all-static` | deps + secrets + semgrep |
| `npm run test:e2e` | Playwright smoke (desktop + mobile) |

Set `AUDIT_BASE_URL` (default `http://localhost:3000`) and optional `AUDIT_PATHS` (comma-separated).

## Agent skills

- `.agents/skills/security-audit` — Cloudflare security audit workflow
- `.agents/skills/ui-test` — Browserbase adversarial UI testing

## MCP

Project `.cursor/mcp.json` includes Playwright MCP (`npx @playwright/mcp@latest`). Chrome DevTools MCP is available as a Cursor plugin for performance traces and Lighthouse a11y scores.

## Reports

Generated files belong in `audit/reports/` (gitignored). Use `REPORT-TEMPLATE.md` for human summaries. Never commit secret values.
