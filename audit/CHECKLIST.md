# Munawwara Web — Audit Checklist

Use this checklist for a full security, UI/UX, and performance pass. Run against **local** `npm run dev` / `npm run start` only unless production scanning is explicitly approved.

## Preconditions

- [ ] `npm install` completed
- [ ] App running locally (`npm run dev` → usually `http://localhost:3000`)
- [ ] `PYTHONUTF8=1` set for Semgrep on Windows (scripts set this)
- [ ] Cursor restarted after MCP changes (Playwright MCP)
- [ ] Optional: Docker Desktop running if using ZAP via Docker instead of portable Core

## 1. Static security

- [ ] `npm run audit:deps` — npm dependency advisories
- [ ] `npm run audit:secrets` — Gitleaks secret scan (review findings privately; do not paste secrets)
- [ ] `npm run audit:semgrep` — Semgrep SAST (local `semgrep scan`)
- [ ] Agent: invoke **security-audit** skill for source-led review (guidance or full mode)

## 2. Dynamic / browser security (local only)

- [ ] `npm run audit:zap` — OWASP ZAP baseline against local URL (portable or Docker)
- [ ] Confirm no active scan against production

## 3. Functional / UI / a11y

- [ ] `npm run test:e2e` — Playwright smoke / regression
- [ ] `npm run audit:axe` — axe-core CLI against key routes
- [ ] Agent: **ui-test** skill (diff-driven or exploratory) via browse CLI / Playwright MCP
- [ ] Chrome DevTools MCP: console errors, network failures, responsive viewports

## 4. Performance

- [ ] `npm run audit:lighthouse` — Lighthouse (perf + a11y + best practices + SEO)
- [ ] Chrome DevTools MCP: `performance_start_trace` / insights on `/en`, `/en/about`, `/en/quote`
- [ ] Manual: React DevTools Profiler on heavy client trees (About film, quote wizard)

## 5. Reporting

- [ ] Copy `audit/REPORT-TEMPLATE.md` → `audit/reports/YYYY-MM-DD-<scope>.md` (gitignored)
- [ ] Summarize severity, evidence paths, and remediations — **never commit secrets or raw ZAP/Gitleaks dumps with credentials**

## Recommended full sequence

```bash
npm run lint
npm run audit:deps
npm run audit:secrets
npm run audit:semgrep
npm run dev
# separate terminal:
npm run audit:axe
npm run audit:lighthouse
npm run test:e2e
npm run audit:zap
```
