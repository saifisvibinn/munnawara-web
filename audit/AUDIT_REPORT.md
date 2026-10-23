# Munawwara Web — Full-Stack Audit Report

| Field | Value |
|-------|-------|
| Date | 2026-10-23 |
| Scope | Security, functional/UI, accessibility, runtime performance (audit-only) |
| App under test | Production build (`npm run build` + `npm run start`) at `http://localhost:3000` |
| Git | Dirty worktree (audit toolkit + uncommitted tooling); last known commit family includes production-audit fixes |
| Backend policy | Browser tests **blocked** outbound dam-backend / Resend / OSRM via Playwright routes. One accidental live `GET /chat/guided` during header checks returned 200 (read-only). No quote POSTs or destructive probes. |
| Auditor | Cursor agent (security-audit + ui-test methodology; Playwright; Chrome DevTools MCP; Semgrep; Gitleaks; axe; Lighthouse; ZAP 2.17) |

---

## 1. Executive summary

This is a **marketing / lead-gen Next.js 15 site** (no end-user accounts). Sensitive surfaces are the **chat proxy**, **quote/track server actions**, and **client storage of edit tokens**. No Critical findings were confirmed in this repo’s source.

**Highest-priority confirmed issues**

1. **SEC-001 (Medium)** — CSP is only `frame-ancestors 'self'` ([next.config.ts](../next.config.ts)). No `script-src` / `default-src` safety net if XSS appears later.
2. **SEC-002 (Medium)** — Empty `CHAT_PROXY_KEY` (current `.env.local` has no key) collapses backend rate-limit identity to the Next egress IP ([proxyHeaders.ts](../src/lib/chat/proxyHeaders.ts)).
3. **PERF / Lighthouse (lab)** — Home Performance **56** under mobile simulation; LCP **~10.9 s** lab / **~1.0 s** unthrottled DevTools. Quote route ships **~391 kB** First Load JS.
4. **A11y** — Recurring **color-contrast** and **label-content-name-mismatch** (chat / sticky controls); landmark `region` gaps on several pages.
5. **About film under 4× CPU + Slow 4G** — Measured scroll: avg frame **34.1 ms**, **4** frames >50 ms, max **75 ms**, with **ForcedReflow** insight during scrub.

**Functional crawl** across locales and five viewports found **no horizontal overflow**, **no pageerrors** on gallery/fleet/news smoke, and locale/`dir=rtl` switching worked. Quote page loads (Leaflet can be slow under load).

**Do not treat this report as a guarantee the app is secure or stutter-free.** Backend (dam-backend) source was out of scope; several items remain `needs_validation`.

---

## 2. Coverage report

### Routes inspected

| Area | Coverage |
|------|----------|
| Locale pages | All primary routes × **ar/en** at 375, 390, 768, 1024, 1440; **fr/id** at 390 & 1440 (`e2e/audit-crawl.spec.ts`) — **14 passed** |
| Flows | Quote load, track invalid, chat open/close, locale switch, gallery/fleet/news, double-click nav — **6 passed** (`e2e/audit-flows.spec.ts`) |
| Server | Chat proxy, quote/track actions, headers — source review + local HTTP |
| Auth | N/A (no end-user auth) |
| DB | None in repo |

### Tools executed

| Tool | Result |
|------|--------|
| `npm run build` / `start` | Success; `/en`, `/about`, `/quote` → 200 |
| Gitleaks 8.30.1 | **No leaks** in git history scan |
| Semgrep 1.182.1 | 3 findings — all in `.agents/skills/impeccable` tooling, **not app** |
| `npm audit` | 9 high — **devDependency** chain (`lighthouse` / `@axe-core/cli` → puppeteer/chromedriver), not runtime app |
| ESLint | Large noise from vendor/minified assets; not treated as product defects |
| ZAP 2.17 quick scan | Completed vs `http://localhost:3000/en`; summary counts **High 0 / Medium 4 / Low 4 / Info 4** (detail names poorly machine-parsed from HTML; raw report in `audit/reports/zap-baseline.html`) |
| axe-core | See §5 |
| Lighthouse | See §5 (lab) |
| Chrome DevTools traces | Home load, About load, About scroll @ 4× CPU + Slow 4G |
| Heap snapshot | Baseline saved (`heap-before.heapsnapshot`); post-cycle comparison not completed (time) |

### Not fully tested / limitations

- **dam-backend** source, firewall, and real rate-limit behavior.
- Live quote submit / email / upload (blocked by policy).
- Full fr/id × all viewports matrix (sampled).
- React DevTools Profiler UI (not automatable here).
- Field CrUX / real-user INP — **n/a**.
- Playwright MCP still not connected in Cursor; Playwright Test + Chrome DevTools MCP used instead.
- `browse` CLI for ui-test skill not installed.
- Transient `/en` **500 JSON.parse** seen earlier in **dev** mode; **production build served cleanly**. Message JSONs parse on disk.

---

## 3. Security findings

Raw source narrative: [audit/reports/security-audit/source-findings.md](reports/security-audit/source-findings.md)

### SEC-001 — Incomplete Content-Security-Policy

| | |
|--|--|
| Severity | **Medium** |
| Confidence | **confirmed** |
| Location | [next.config.ts:26](../next.config.ts) |
| Evidence | Response headers on `/en`: `Content-Security-Policy: frame-ancestors 'self'` only; also `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` |
| Impact | No script/style/connect CSP to contain future XSS; elevates impact of any injection (localStorage edit tokens / chat IDs). |
| Repro | `curl -I http://localhost:3000/en` → inspect CSP |
| Remediation | Expand CSP (`default-src`, `script-src`, `connect-src`, `img-src`, …); prefer nonces for inline theme boot |
| Regression | Assert CSP contains `default-src` and `script-src` |

### SEC-002 — Empty `CHAT_PROXY_KEY` collapses rate-limit identity

| | |
|--|--|
| Severity | **Medium** |
| Confidence | **confirmed** |
| Location | [src/lib/chat/proxyHeaders.ts:6-11](../src/lib/chat/proxyHeaders.ts) |
| Evidence | `.env.local` keys present: `VERCEL_OIDC_TOKEN` only — **no** `CHAT_PROXY_KEY`. Function returns `{}` when key or IP missing. |
| Impact | Backend may rate-limit entire site as one IP → shared DoS of chat/quotes. |
| Remediation | Require `CHAT_PROXY_KEY` in production; alert if empty |
| Regression | Unit-test empty key behavior + deploy guard |

### SEC-003 — Spoofable client IP via leftmost `x-forwarded-for`

| | |
|--|--|
| Severity | **Medium** |
| Confidence | **needs_validation** |
| Location | [proxyHeaders.ts:9-10](../src/lib/chat/proxyHeaders.ts); proxy forwards XFF ([route.ts:60-66](../src/app/chat/[...path]/route.ts)) |
| Impact | Rate-limit bypass if platform appends rather than overwrites XFF and backend trusts leftmost / `x-client-ip`. |
| Remediation | Prefer platform trusted IP headers; or rightmost-trusted hop |
| Regression | Inject forged XFF; assert forwarded `x-client-ip` ≠ attacker value |

### SEC-004 — Hardcoded backend host in client bundle

| | |
|--|--|
| Severity | **Low** |
| Confidence | **confirmed** |
| Location | [upstream.ts:5](../src/lib/chat/upstream.ts), socket client |
| Impact | Droplet hostname discoverable; attackers can hit backend **bypassing** Next proxy allowlist/body limits |
| Remediation | Env-only URLs; firewall backend to Next egress; remove hardcoded default from client path |
| Regression | `next build` artifact must not contain `sslip.io` / droplet IP in client chunks |

### SEC-005 — Chat `option.href` without scheme allowlist

| | |
|--|--|
| Severity | **Low** |
| Confidence | **needs_validation** |
| Location | [ChatPanel.tsx:841-843](../src/components/chat/ChatPanel.tsx) |
| Note | `RichText` (lines 87–101) **only** linkifies `https?://` — **safe** against `javascript:` in message text |
| Impact | If backend options are attacker-controlled, `javascript:` / external phishing href possible |
| Remediation | Allow only relative paths `/…` |
| Regression | Mock option `javascript:alert(1)` → not rendered as actionable href |

### SEC-006 — Quote edit token in `localStorage`

| | |
|--|--|
| Severity | **Low** |
| Confidence | **confirmed** |
| Location | [quoteEditStore.ts:46](../src/components/forms/quoteEditStore.ts) |
| Impact | Any same-origin XSS exfiltrates token → tamper quote until staff lock |
| Remediation | HttpOnly cookie for edit token |
| Regression | After submit, no `editToken` in localStorage |

### SEC-007 — Track lead enumeration (no local rate limit)

| | |
|--|--|
| Severity | **Low** |
| Confidence | **needs_validation** |
| Location | [track.ts:22-40](../src/app/actions/track.ts) |
| Impact | Metadata disclosure if IDs guessable and backend RL weak |
| Remediation | Entropy in lead IDs + Next-side rate limit |

### SEC-008 — Chat auth = conversationId + phone

| | |
|--|--|
| Severity | **Medium** |
| Confidence | **needs_validation** (backend behavior unknown) |
| Location | chat client + socket join |
| Impact | History / spoof messages if IDs + phones guessable |
| Remediation | Session token after `POST /chat/session`; backend lockouts |

### SEC-009 — Proxy header denylist (not allowlist)

| | |
|--|--|
| Severity | **Low** |
| Confidence | **confirmed** |
| Location | [route.ts:62-66](../src/app/chat/[...path]/route.ts) |
| Impact | Depends on backend header trust |
| Remediation | Allowlist forward headers only |

### SEC-010 — Incomplete `.env.example`

| | |
|--|--|
| Severity | **Informational** |
| Confidence | **confirmed** |
| Location | `.env.example` vs `RESEND_*` / `CONTACT_INBOX_EMAIL` in quote.ts |
| Impact | Ops miss inbox emails |

### Explicitly checked / not confirmed as vulns

- Gitleaks: no secrets in git history for scanned paths.
- `dangerouslySetInnerHTML` in layout: hardcoded / JSON-LD escaped.
- Honeypot `companyWebsite` returns fake success without backend call.
- Zod validation on quote payloads; email subject CR/LF stripped; quoteId `encodeURIComponent`.

---

## 4. Functional and UI/UX findings

### UI-001 — No horizontal overflow on crawl matrix

| | |
|--|--|
| Severity | Informational (positive) |
| Evidence | `audit-crawl` soft-asserted overflow; **0 overflow screenshots** generated |
| Viewports | 375–1440; locales ar/en (+ fr/id sample) |

### UI-002 — Locale switcher + RTL

| | |
|--|--|
| Severity | Informational (positive) |
| Repro | `/en` → click `/ar` link → URL `/ar`, `html[dir=rtl]` |
| Status | Passed |

### UI-003 — Chat panel open/close

| | |
|--|--|
| Severity | Informational (positive) |
| Evidence | Control `Chat with Durra AI`; Escape closes; screenshot `audit/reports/screens/chat-open-en.png` |
| Status | Works; accessible name present |

### UI-004 — Quote page heavy / slow first paint under contention

| | |
|--|--|
| Severity | Low (UX) |
| Expected | Quote wizard interactive promptly |
| Actual | First audit-flows run timed out at 30s under parallel load; retest with 60s passed |
| Route | `/en/quote` (First Load JS **391 kB**, Leaflet map) |
| Remediation | Lazy-load map; code-split wizard; defer non-critical map tiles |
| Evidence | Build table; Playwright timing |

### UI-005 — Partner logo marquee duplicates in a11y tree

| | |
|--|--|
| Severity | Low |
| Route | `/en` Partners region |
| Actual | Snapshot shows duplicated client logo images (infinite scroll clone) exposed to AT |
| Remediation | `aria-hidden` on decorative clones; single list for SR |
| Evidence | Chrome DevTools a11y snapshot |

### UI-006 — Dev-mode intermittent `/en` 500 (JSON.parse)

| | |
|--|--|
| Severity | Medium (dev reliability) |
| Expected | `/en` always 200 |
| Actual | Earlier session: `SyntaxError: Unexpected non-whitespace character after JSON at position 1072` under `next dev`; production build OK |
| Remediation | Investigate HMR / message import; clear `.next` only with approval if recurs |
| Status | Not reproduced on production server used for this audit |

---

## 5. Performance findings

**Conditions legend**

- **DevTools local**: Chrome via MCP, localhost, CPU 1× unless noted, no network throttle unless noted. Lab-observed, not field.
- **Lighthouse**: Default mobile simulation (CPU + network throttle). Lab only.

### PERF-001 — Home LCP dominated by render delay (DevTools)

| | |
|--|--|
| Priority | High |
| Route | `/en` |
| Baseline | LCP **1030 ms**; TTFB 7 ms; **Render delay 1000 ms**; CLS **0.00**; ForcedReflow + DOMSize insights |
| Trace | `audit/reports/trace-home-en.json.gz` (also under user audit folder copy) |
| Likely cause | Client hydration / above-the-fold JS before LCP paint |
| Fix | Reduce critical JS; defer chat/widgets; ensure LCP element is server-rendered text/image without late mutation |
| Retest | Same DevTools navigation trace; target LCP render-delay &lt; 300 ms |

### PERF-002 — Lighthouse mobile Performance poor on home

| | |
|--|--|
| Priority | High |
| Route | `/en` |
| Lab metrics | Perf **56**, LCP **10906 ms**, TBT **500 ms**, FCP **2067 ms**, CLS **0**, a11y **97**, best-practices **100**, seo **85** |
| Artifact | `audit/reports/lighthouse-en.json` |
| Note | Differs from unthrottled DevTools (~1 s LCP) — **do not conflate** |

### PERF-003 — About film scroll jank under throttle

| | |
|--|--|
| Priority | High |
| Route | `/en/about` |
| Conditions | CPU **4×**, network **Slow 4G** |
| Measurement | Programmatic scrub scroll: frames=40, **avgFrameMs=34.1**, **longFramesOver50ms=4**, **maxDelta=75**, scrollHeight≈9594 |
| Trace insight | ForcedReflow during scroll |
| Artifact | `audit/reports/trace-about-scroll-4x.json.gz` |
| Likely cause | GSAP ScrollTrigger scrub + layout reads; Lenis |
| Fix | Prefer transform/opacity; batch reads/writes; honor `prefers-reduced-motion` (already wired in places — verify film path) |
| Retest | Repeat scroll script under same throttle; aim avgFrameMs ≤20 and 0 frames &gt;50 ms |

### PERF-004 — Quote First Load JS size

| | |
|--|--|
| Priority | Medium |
| Evidence | `next build`: `/[locale]/quote` **121 kB** route / **391 kB** First Load |
| Fix | Dynamic import Leaflet/map; split wizard steps |
| Retest | Build size table after change |

### PERF-005 — About / Quote Lighthouse (lab)

| Route | Perf | LCP | TBT | A11y |
|-------|------|-----|-----|------|
| `/en/about` | 68 | 5994 ms | 207 ms | 100 |
| `/en/quote` | 65 | 6228 ms | 288 ms | 100 |

Unthrottled DevTools About LCP was **435 ms** (CLS 0) — again, lab vs local.

### PERF-006 — Bundle / shared JS

Shared First Load JS **~115 kB**; middleware **49.2 kB**. Home **300 kB** First Load.

**INP:** Not measured as a stable field or lab INP number in this run — **not reported**.

---

## 6. Accessibility findings

| ID | Severity | Pages | Issue |
|----|----------|-------|-------|
| A11Y-001 | Serious | `/en`, `/ar`, about, fleet | `color-contrast` (2–6 nodes) |
| A11Y-002 | Serious | about, fleet, gallery, quote | `label-content-name-mismatch` (1) — likely chat/fab accessible name vs visible text |
| A11Y-003 | Moderate | about, fleet, gallery, quote | `region` — content outside landmarks |

Artifacts: `audit/reports/axe-*.json`

**Manual notes**

- Primary nav exposes clear link names; chat button named **“Chat with Durra AI”**.
- FAQ accordion uses expandable buttons (good pattern).
- Partner marquee clones inflate the accessibility tree (UI-005).
- `prefers-reduced-motion` exists in code paths; full film reduced-motion pass not exhaustively timed in this run.

---

## 7. Dependency and infrastructure findings

| ID | Severity | Finding |
|----|----------|---------|
| DEP-001 | Info (tooling) | `npm audit`: 9 high in **audit-only** deps (lighthouse/axe-cli → basic-ftp). Not shipped to users via Next app runtime. Prefer not `npm audit fix --force` blindly. |
| DEP-002 | Info | Semgrep hits only impeccable skill scripts (`postMessage` target `*`). |
| INFRA-001 | Medium | CSP incomplete — see SEC-001. |
| INFRA-002 | Medium | `CHAT_PROXY_KEY` unset in local `.env.local` — see SEC-002. |
| INFRA-003 | Low | No CI workflows / Docker in repo — no automated security gate on PR. |
| INFRA-004 | Info | ZAP quick scan summary vs `/en`: **0 High, 4 Medium, 4 Low, 4 Informational** — review `zap-baseline.html` manually for alert titles (HTML parse was noisy). |
| SECRET-001 | Info | No gitleaks findings. Local MCP / env secrets exist **outside** git (do not commit `.cursor/mcp.json` / `.env.local`). Values **redacted**. |

**Tool versions:** Node 24.12, Next 15.5.28, Semgrep 1.182.1, Gitleaks 8.30.1, ZAP 2.17.0, Playwright 1.64.1, Lighthouse 13.5.0, axe-core 4.14.0.

---

## 8. Remediation plan (priority)

1. **Set and enforce `CHAT_PROXY_KEY` in all deployed environments** (SEC-002).
2. **Expand CSP** beyond `frame-ancestors` (SEC-001).
3. **Validate / fix IP forwarding** for rate limits (SEC-003) with platform headers.
4. **Firewall backend** + remove client-visible hardcoded droplet default (SEC-004).
5. **Perf:** cut home LCP render-delay; lazy-load quote map; profile About scrub ForcedReflow (PERF-001–004).
6. **A11y:** contrast tokens; fix accessible-name mismatch; landmark wrappers; hide marquee clones (A11Y-*, UI-005).
7. **Harden chat options href + edit-token storage** (SEC-005/006).
8. **Document Resend env vars** (SEC-010); add CI audit job.
9. Lower: track rate limit, chat session tokens (SEC-007/008), proxy allowlist headers (SEC-009).

---

## 9. Approval gate

**No application code was modified.** Fixes require your approval. Suggested first increment after approval:

1. Production env: `CHAT_PROXY_KEY` + CSP header expansion.
2. Quote dynamic import for Leaflet.
3. A11y contrast + accessible name for chat control.

After each increment: re-run `audit:all-static`, targeted Playwright specs, Lighthouse `/en` + `/en/about`, and About scroll script under 4× CPU.

---

## 10. Evidence index

| Path | Content |
|------|---------|
| `audit/COVERAGE_CHECKLIST.md` | Checklist seed |
| `audit/reports/security-audit/source-findings.md` | SEC write-up |
| `audit/reports/semgrep.json` | Semgrep |
| `audit/reports/gitleaks.json` | Secrets scan |
| `audit/reports/zap-baseline.html` | ZAP |
| `audit/reports/lighthouse-*.json/html` | Lighthouse |
| `audit/reports/axe-*.json` | axe |
| `audit/reports/trace-*.json.gz` | Perf traces |
| `audit/reports/screens/` | Crawl / chat screenshots |
| `e2e/audit-crawl.spec.ts` | Route×viewport crawl |
| `e2e/audit-flows.spec.ts` | Journey tests |
| `e2e/helpers/mockBackend.ts` | Outbound blocks |
