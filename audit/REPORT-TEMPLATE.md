# Audit Report — Munawwara Web

| Field | Value |
|-------|-------|
| Date | YYYY-MM-DD |
| Scope | security / ui / performance / full |
| App URL | http://localhost:3000 |
| Git SHA | |
| Auditor | |

## Executive summary

_One short paragraph: overall risk posture and whether blockers exist._

## Environment

- Node:
- OS:
- Tools used (versions):

## Findings

### Critical / High

| ID | Area | Summary | Evidence | Remediation |
|----|------|---------|----------|-------------|
| | | | | |

### Medium / Low

| ID | Area | Summary | Evidence | Remediation |
|----|------|---------|----------|-------------|
| | | | | |

### Informational / hardening

-

## Tool run log

| Tool | Command | Result | Artifact path (local only) |
|------|---------|--------|----------------------------|
| npm audit | `npm run audit:deps` | | |
| Gitleaks | `npm run audit:secrets` | | _do not commit if secrets present_ |
| Semgrep | `npm run audit:semgrep` | | |
| ZAP | `npm run audit:zap` | | |
| axe | `npm run audit:axe` | | |
| Lighthouse | `npm run audit:lighthouse` | | |
| Playwright | `npm run test:e2e` | | |

## Security-audit skill (if used)

- Mode: guidance / full
- Output directory:
- Confirmed / needs_validation counts:

## Follow-ups

- [ ]
