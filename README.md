# Munawwara Web (DMTC)

Bilingual (Arabic-first / English) marketing site for **Durrah Al-Munawwara Group**.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 + brand tokens from `src/lib/theme.ts` (orange / blue / purple DMTC language)
- `next-intl` (`/ar` default RTL, `/en` LTR)
- Motion (`motion/react`) for simple enters
- GSAP + ScrollTrigger + Lenis for scroll-driven cinematic scenes

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (redirects to `/ar`).

## Content

- UI strings: `src/messages/{ar,en}.json`
- Page content: `src/content/{ar,en}/` via accessors in `src/content/index.ts`
- Fleet data seeded from the exhibition brochure PDF
- Never invent CR numbers, Tourism services, or named clients — see `AGENTS.md`

## Key surfaces

### About (`/ar/about`, `/en/about`)

Cinematic scroll story for Durrah Al-Munawwara (not a card-stack About page).

- Component: `src/components/about/AboutFilm.tsx`
- Styles: `src/styles/about-film.css`
- Copy: `AboutContent.film` in `src/content/{ar,en}/about.ts`
- Motion: GSAP timelines scrubbed with ScrollTrigger (pinned scenes). No Three.js.
- Brand mark: shared `LogoMark` petal (same as site chrome). The old `/dmtc-logo.svg` lockup was removed.
- First viewport is full-bleed under the floating nav (chrome spacer is suppressed via `html:has([data-about-film])`).
- Respects `prefers-reduced-motion` / `useReducedMotion` (static readable stack, no pins).

Narrative beats: Journey → World → Challenge → Connection (group companies) → Fleet → Audiences → Details → Human pause → Brand → Future → CTA.

### Quote (`/ar/quote`, `/en/quote`)

Fit-to-screen split map + wizard. Option cards use icons; Continue is manual (no auto-advance). Back returns to the home ticket section (`#quote`) via `QuotePageChrome` + `QuoteSectionClient`.

**Handover:** see `HANDOVER.md` for clone setup, MCP on a new PC, and recent work.

## Brand assets

| Use | Asset |
|---|---|
| Corner / film petal mark | `LogoMark` (`src/components/landing/LogoMark.tsx`) |
| Company lockups | `public/brand/company-*.png` |
| Fleet photography | `public/fleet/**` |
| Atmosphere | `public/hero/landing-sky.jpg`, fleet covers |

Do not reintroduce the deleted full lockup SVG with DMTC wordmark + Arabic stack for chrome or About film.

## Milestones

M0–M3 complete (scaffold, shell, content model, all routes). Forms/SEO/maps/GA4 are M5+.
