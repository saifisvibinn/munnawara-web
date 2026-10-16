---
name: react-bits
description: >-
  Use React Bits (DavidHDev/react-bits) animated React/Next components — text,
  backgrounds, UI, micro-interactions. Trigger when the user asks for React Bits,
  reactbits.dev, BlurText, animated backgrounds, or to add a flashy React
  animation component via shadcn/jsrepo. Prefer TS + Tailwind variants.
---

# React Bits

Library: [DavidHDev/react-bits](https://github.com/DavidHDev/react-bits) · Docs: [reactbits.dev](https://reactbits.dev)

Open-source, copy/CLI-installable animated React components (text, backgrounds, UI, micro). Not a full design system — drop in pieces and restyle.

## Install (preferred)

React Bits supports [shadcn](https://ui.shadcn.com/) and [jsrepo](https://jsrepo.dev). Each component page shows the exact command.

```bash
# Example — TypeScript + Tailwind variant
npx shadcn@latest add @react-bits/BlurText-TS-TW
```

Variant suffixes:

| Suffix | Stack |
| --- | --- |
| `TS-TW` | TypeScript + Tailwind (**prefer for Next + Tailwind projects**) |
| `TS-CSS` | TypeScript + CSS |
| `JS-TW` | JavaScript + Tailwind |
| `JS-CSS` | JavaScript + CSS |

Always pick the variant that matches the host project. Do not introduce a parallel CSS approach when the app is Tailwind-first.

## Workflow

1. Confirm the effect category: Text / Animations / Components / Backgrounds / Micro.
2. Open the component page on reactbits.dev and read deps + CLI command.
3. Install via CLI **or** copy source into the project’s components folder.
4. Restyle to brand tokens — never ship demo purple/neon defaults if the host design system forbids them.
5. Wire `prefers-reduced-motion` / project `useReducedMotion` when motion is non-essential.
6. Keep user-facing strings in i18n/content layers when the host project requires it (e.g. next-intl).

## Categories (mental map)

- **Text** — split/blur/typewriter-style headlines
- **Backgrounds** — canvas/WebGL/CSS atmospheric layers
- **Components** — interactive UI blocks
- **Micro** — small hover/press flourishes
- **Animations** — general motion primitives

## Hard rules for branded sites

1. **Brand first** — remap colors to existing CSS variables / Tailwind tokens; no hardcoded demo hex if the project bans it.
2. **One composition** — don’t dump a React Bits collage into a hero that already has a visual language.
3. **Deps audit** — only add packages the component needs; prefer TS-TW to avoid orphan CSS files.
4. **A11y** — decorative motion stays `aria-hidden` when appropriate; never gate primary CTAs behind scroll/hover animation.
5. **License** — MIT + Commons Clause; OK for personal/commercial use per upstream LICENSE — don’t strip attribution where required.

## When not to use

- Simple fades/slides already covered by Motion/GSAP already in the project
- Layout that must stay calm/editorial (over-animated backgrounds)
- Replacing an established design-system control with a novelty component

## Munawwara-web notes (if in that repo)

- Stack is Next 15 + Tailwind v4 + theme tokens from `src/lib/theme.ts`
- Prefer **TS-TW**; restyle orange/blue/purple brand tokens — avoid generic AI purple gradients
- Motion already uses GSAP + Lenis + Motion — don’t stack conflicting scroll libraries
- Never hardcode UI copy; use `src/messages` / `src/content`
- Respect `useReducedMotion` and logical CSS (`ms`/`me`/`start`/`end`)

## References

- Docs: https://reactbits.dev
- Install: https://reactbits.dev/get-started/installation
- Tools (Background Studio, etc.): https://reactbits.dev/tools
- Repo: https://github.com/DavidHDev/react-bits
