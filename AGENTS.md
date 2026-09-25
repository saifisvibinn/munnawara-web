# Munawwara Web — Agent Rules

## Stack
- Next.js 15 App Router + TypeScript
- Tailwind CSS v4 with CSS variables from `src/lib/theme.ts`
- `next-intl` with default locale `ar` (RTL) and secondary `en` (LTR)
- Local typed content in `src/content/{ar,en}/` via accessor functions in `src/content/index.ts`
- Motion (Framer), GSAP + ScrollTrigger, Lenis for animation

## Hard rules
- Never hardcode user-facing strings in components — use `messages/*.json` for UI chrome and `content/` for page copy
- Never hardcode hex colors in components — use theme CSS variables / Tailwind tokens (`bg-orange`, `text-wordmark`, etc.)
- Use logical CSS (`ms-`, `me-`, `ps-`, `pe-`, `start`, `end`) — never physical `left`/`right` for layout that must flip
- Never invent company facts (CR numbers, licenses, Tourism services, named clients). Use `TODO(content):` comments and `ContentPlaceholder` instead
- Respect `prefers-reduced-motion` via `useReducedMotion`
- Above-the-fold CTAs must not be gated behind scroll-triggered animation

## Locales
- URL: `/ar/...` and `/en/...`; `/` redirects to `/ar`
- Set `dir` and `lang` on `<html>` from the locale layout

## Agent skills
Project skills live in `.agents/skills/` (mirrored locally at `.cursor/skills/` for Cursor). Restore with `npx skills experimental_install`. Impeccable design hook is enabled via `.cursor/hooks.json` + `.impeccable/config.json`. Prefer these for UI craft work:

| Skill | Use when |
|---|---|
| `impeccable` | Design, redesign, critique, audit, polish, or improve frontend UI |
| `emil-design-eng` | Design-engineering taste, polish, and interaction details |
| `animate` / `improve-animations` / `review-animations` / `find-animation-opportunities` / `animation-vocabulary` | Motion work (Motion, GSAP, ScrollTrigger, Lenis) |
| `prototype` | Fast UI prototyping |
| `ask-sonner` | Toast / notification UX with Sonner |
| `pick-ui-library` | Choosing a UI library |

Also installed (use only if relevant): `animate-expo`, `apple-design`, `mobile-native`, `write-swift`.

Do not invent brand tokens — follow `src/lib/theme.ts`, `DESIGN.md`, and existing page patterns.
