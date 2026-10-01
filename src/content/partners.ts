export type Partner = {
  name: string
  /** Path under /public, e.g. "/partners/acme.svg" (SVG preferred, else transparent PNG). */
  logo: string
  /** Optional link to the partner's site. */
  url?: string
}

/**
 * Real partner logos from Abdullah go here — drop the files in
 * public/partners/ and add one entry each. No code change needed elsewhere.
 * While this list is empty the site falls back to the client categories.
 */
export const partners: readonly Partner[] = []
