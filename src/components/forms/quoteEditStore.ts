import type { WizardState } from "./quoteWizardTypes"

/**
 * The last request sent from this browser, kept so the visitor can correct it
 * until staff start working on it. Only one is kept; a new request replaces it.
 */
export type SavedQuote = {
  version: 1
  quoteId: string
  editToken: string
  leadId?: string
  state: WizardState
  savedAt: number
}

const STORAGE_KEY = "dm-quote-edit"
// Staff usually pick a request up within a day; after this the link is noise.
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000

export function loadSavedQuote(): SavedQuote | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const saved = JSON.parse(raw) as Partial<SavedQuote>
    if (
      saved.version !== 1 ||
      typeof saved.quoteId !== "string" ||
      typeof saved.editToken !== "string" ||
      !saved.state ||
      !Array.isArray(saved.state.trips) ||
      typeof saved.savedAt !== "number" ||
      Date.now() - saved.savedAt > MAX_AGE_MS
    ) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return saved as SavedQuote
  } catch {
    return null
  }
}

export function storeSavedQuote(saved: Omit<SavedQuote, "version" | "savedAt">): SavedQuote {
  const record: SavedQuote = { ...saved, version: 1, savedAt: Date.now() }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  } catch {}
  return record
}

export function clearSavedQuote() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}
