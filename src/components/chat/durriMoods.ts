export type DurriMood =
  | "idle"
  | "wave"
  | "think"
  | "listen"
  | "greet"
  | "explain"
  | "happy"
  | "curious"

export type DurriHintKey =
  | "idle1"
  | "idle2"
  | "idle3"
  | "fleet"
  | "contact"
  | "quote"
  | "about"
  | "companies"

export const DURRI_MOOD_SRC: Record<DurriMood, string> = {
  idle: "/mascot/durri/idle.webp",
  wave: "/mascot/durri/wave.webp",
  think: "/mascot/durri/think.webp",
  listen: "/mascot/durri/listen.webp",
  greet: "/mascot/durri/greet.webp",
  explain: "/mascot/durri/explain.webp",
  happy: "/mascot/durri/happy.webp",
  curious: "/mascot/durri/curious.webp",
}

export const IDLE_HINTS: DurriHintKey[] = ["idle1", "idle2", "idle3"]

/** Idle at rest, wave while the bubble is hovered, think once it is opened. */
export const fabMood = (opts: {
  open: boolean
  hoveringFab: boolean
}): DurriMood => {
  if (opts.open) return "think"
  if (opts.hoveringFab) return "wave"
  return "idle"
}

export const resolveContextHint = (
  target: EventTarget | null,
): DurriHintKey | null => {
  if (!(target instanceof Element)) return null

  const explicit = target
    .closest("[data-durri-hint]")
    ?.getAttribute("data-durri-hint")
  if (
    explicit === "fleet" ||
    explicit === "contact" ||
    explicit === "quote" ||
    explicit === "about" ||
    explicit === "companies"
  ) {
    return explicit
  }

  const anchor = target.closest("a[href]")
  if (anchor instanceof HTMLAnchorElement) {
    const path = anchor.pathname
    if (path.includes("/contact")) return "contact"
    if (path.includes("/quote")) return "quote"
    if (path.includes("/fleet")) return "fleet"
    if (path.includes("/about")) return "about"
    if (path.includes("/companies") || path.includes("/corporate")) {
      return "companies"
    }
  }

  if (
    target.closest(
      "#fleet-panel, [data-af-fleet], [data-fleet-bus], .about-film__gallery-image, [data-fleet-hero]",
    )
  ) {
    return "fleet"
  }

  return null
}
