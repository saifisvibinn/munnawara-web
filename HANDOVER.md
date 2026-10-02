# Handover — Munawwara Web (DMTC)

Last pushed commit on `master`: **feat(about): add Durrah cinematic About film and polish quote handoff** (`d6ee526`).

Remote: `https://github.com/saifisvibinn/munnawara-web.git` (note spelling: **munnawara**).

## New machine setup

```bash
git clone https://github.com/saifisvibinn/munnawara-web.git
cd munnawara-web   # or your folder name
npm install
npm run dev        # prefer default webpack dev, not turbopack, if /en JSON issues return
```

Open `http://localhost:3000` → redirects to `/ar`. Key routes: `/en/about`, `/en/quote`, `/en`.

## Docs map (read order)

| File | Purpose |
|------|---------|
| `AGENTS.md` | **Start here** — stack, hard rules, About film, skills |
| `README.md` | Surfaces, assets, dev commands |
| `DESIGN.md` | Editorial “Sacred Hospitality” draft — **hex/tokens in production follow `src/lib/theme.ts` (orange/blue/purple)** |
| `src/lib/theme.ts` | Shipped brand tokens |
| `src/content/{ar,en}/` | Page copy; accessors in `src/content/index.ts` |
| `src/messages/{ar,en}.json` | UI chrome (nav, quote labels, etc.) |

No `PRODUCT.md` yet (Impeccable init optional).

## Recent product work (this branch)

### About film (`/about`)

- `src/components/about/AboutFilm.tsx` + `src/styles/about-film.css`
- Copy: `AboutContent.film` in `src/content/{ar,en}/about.ts`
- **Durrah Al-Munawwara** group story — not Munawwara Care
- GSAP + ScrollTrigger + Lenis; **no Three.js**
- Logo: `LogoMark` only; `public/dmtc-logo.svg` **deleted** — do not restore
- Full-bleed hero: `html:has([data-about-film])` hides `.site-chrome__spacer`
- Still room for polish (transitions, mobile pass, content TODOs in `about.ts` history)

### Quote (`/quote`)

- Wizard icons: `src/components/forms/QuoteChoiceIcons.tsx`
- Manual Continue (no auto-advance on choice pick)
- Back to ticket: `src/components/forms/QuotePageChrome.tsx` + `QuoteSectionClient.tsx` (`#quote`, session flag)
- Prefetch home from quote page

## Agent tooling (Cursor)

### In repo

- `.cursor/hooks.json` — Impeccable pre-edit hook (requires `.agents/skills/impeccable` or `npx skills experimental_install`)
- Project skills: `.agents/skills/` (mirror at `.cursor/skills/` when installed)

### On each developer machine (not in git)

Configure in **Cursor Settings → MCP** on the new PC:

| MCP | Use for this repo |
|-----|-------------------|
| **Context7** (`user-context7`: `resolve-library-id`, `query-docs`) | **Library docs** — Next.js, GSAP, ScrollTrigger, Lenis, next-intl, Tailwind. Follow skill: `~/.cursor/skills/context7-mcp/SKILL.md` (or copy skill to new machine). |
| **Chrome DevTools** (plugin) | Debug `/about`, `/quote`, scroll, a11y, performance |
| **Three.js DevTools** | **Not used** — no Three.js in this project |

User rules also reference Context7 via workspace rule `context7.mdc` — enable Context7 MCP so agents call it for framework docs instead of guessing.

Optional: GitHub MCP (`gh`), Vercel, Mobbin — only if you use those workflows.

## Git hygiene

- **Committed & pushed:** About film, quote polish, README/AGENTS updates, deleted lockup SVG, quote ticket image.
- **Untracked (local only):** `.impeccable/about-*.png` — design review screenshots; safe to ignore or `.gitignore` if noisy.

## Content rules (do not break)

- No invented CR, licenses, clients, or Munawwara Care product pivot on About unless asked
- `about.licensingNote` stays `null` until client provides
- RTL: logical properties (`ms-`, `me-`, `start`, `end`)

## Known dev notes

- If webpack cache ENOENT: delete `.next/cache` and restart `npm run dev`
- Port conflict: Next may use `3001` — check terminal output
- `npm run dev:turbo` exists but webpack `dev` is safer for i18n message loading per prior sessions
