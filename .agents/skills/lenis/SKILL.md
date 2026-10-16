---
name: lenis
description: >-
  Smooth scrolling with Lenis (darkroomengineering/lenis). Use when adding,
  fixing, or tuning Lenis, syncing GSAP ScrollTrigger, nested scroll panels
  (data-lenis-prevent), scrollTo/stop/start, or React/Next smooth-scroll
  providers. Prefer current docs via Context7 (/darkroomengineering/lenis).
---

# Lenis

Official library: [darkroomengineering/lenis](https://github.com/darkroomengineering/lenis).
Context7 ID: `/darkroomengineering/lenis`.

## When to use

- Wire or repair smooth scroll on a site
- Keep ScrollTrigger pins/scrub in sync with Lenis
- Nested overflow panels fighting the page scroll
- Programmatic `scrollTo`, intro locks, page-transition gates

## Defaults (vanilla + GSAP)

Lenis must share one clock with GSAP when ScrollTrigger is used:

```ts
import Lenis from "lenis"
import "lenis/dist/lenis.css"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis({ autoRaf: false })
lenis.on("scroll", ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```

- `autoRaf: false` when GSAP (or another ticker) drives `raf`
- Always `destroy()` on teardown; remove the ticker callback
- After major layout / pin changes: `ScrollTrigger.refresh()`

## Nested scroll

Mark overflow regions so Lenis does not capture wheel/touch:

```html
<div data-lenis-prevent>…</div>
```

Variants: `data-lenis-prevent-wheel`, `data-lenis-prevent-touch`,
`data-lenis-prevent-vertical`, `data-lenis-prevent-horizontal`.

## Common API

| Method / option | Use |
| --- | --- |
| `scrollTo(target, { offset, immediate, duration, onComplete })` | Anchor / CTA scroll |
| `stop()` / `start()` | Intro, modals, locked pages |
| `lerp` | Higher = snappier; lower = more glide |
| `smoothWheel` / `wheelMultiplier` / `touchMultiplier` | Input feel |
| `anchors` | Built-in anchor handling with offset |

## React / Next

- Prefer a single app-level provider (one Lenis instance on `window` or context)
- Skip creating Lenis when `prefers-reduced-motion: reduce`
- Import `lenis/dist/lenis.css` once
- Optional adapter: `lenis/react` (`ReactLenis`) — same GSAP rules with `autoRaf: false`

## Munawwara-web patterns (if in that repo)

Follow existing code instead of inventing a second instance:

- Provider: `src/components/motion/SmoothScrollProvider.tsx`
- Instance: `window.__lenis`
- Quote / wizard overflow: `data-lenis-prevent`
- Body class gates call `stop()` / `start()` (`is-loading`, `is-quote-page`, transitions)
- About route uses gentler `lerp` / `wheelMultiplier`

## Hard rules

1. **One Lenis per scroll root.** Do not stack providers.
2. **Never fight native overflow** — use `data-lenis-prevent` on nested scrollers.
3. **Respect reduced motion** — no Lenis when the user prefers reduced motion.
4. **Fetch current API** with Context7 before guessing new options or React package APIs.
5. **After pin/scrub edits**, refresh ScrollTrigger; do not only tweak CSS.

## Docs

- README / manifesto: https://github.com/darkroomengineering/lenis
- Site: https://lenis.dev
