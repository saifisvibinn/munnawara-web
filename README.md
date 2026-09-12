# Munawwara Web (DMTC)

Bilingual (Arabic-first / English) marketing site for Durrah Al-Munawwara Group.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 + brand tokens from exhibition brochure
- `next-intl` (`/ar` default RTL, `/en` LTR)
- Motion + GSAP + Lenis (primitives; full hero polish later)

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

## Milestones

M0–M3 complete (scaffold, shell, content model, all routes). Forms/SEO/maps/GA4 are M5+.
