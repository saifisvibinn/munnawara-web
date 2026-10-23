# Audit coverage checklist

Date: 2026-10-23  
Backend policy: outbound blocked in browser tests  
Full report: [AUDIT_REPORT.md](AUDIT_REPORT.md)

## Routes

| Route | Status |
|-------|--------|
| Home / about / companies* / fleet / corporate / clients / gallery / news / contact / quote / track / 404 | Crawled ar+en @ 5 viewports; fr/id @ 390+1440 |
| sitemap / robots | Present in app router (not HTTP-probed deeply) |

## Server surfaces

| Surface | Status |
|---------|--------|
| Chat proxy | Source review + local GET guided (live read) |
| Quote / track actions | Source review; live POST blocked |
| Security headers | Confirmed on production server |
| siteContent fetch | Source review |

## Journeys

| Journey | Status |
|---------|--------|
| Quote load | Pass |
| Track invalid | Pass |
| Chat open/close | Pass |
| Locale + RTL | Pass |
| Gallery / fleet / news | Pass |

## Scanners

| Tool | Status |
|------|--------|
| npm audit | Done (tooling deps) |
| gitleaks | Done — no leaks |
| semgrep | Done — skill scripts only |
| eslint | Ran — noisy |
| ZAP | Done — 0H/4M/4L/4I summary |
| axe | Done — ar+en sample |
| Lighthouse | Done — en/about/quote (+ html for more) |
| DevTools traces | Home, about load, about scroll 4× |
