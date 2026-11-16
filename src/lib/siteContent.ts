import { getFleet, getNews, getTestimonials } from "@/content"
import type { AppLocale, FleetCategory, NewsPost, Testimonial } from "@/content/types"
import { serverChatApiUrl } from "@/lib/chat/upstream"

/**
 * News, testimonials and the bus fleet are edited by staff in the admin console
 * (backend `GET /content/:kind`, `GET /fleet`). Pages re-check at most once a minute. If the
 * backend is down or returns nothing usable, the hard-coded lists in
 * src/content are used so the site never breaks.
 */
const REVALIDATE_SECONDS = 60
const TIMEOUT_MS = 5_000

const str = (value: unknown) => (typeof value === "string" ? value : "")
const strOrNull = (value: unknown) => (typeof value === "string" && value ? value : null)

const strList = (value: unknown) => (Array.isArray(value) ? value.map(str).filter(Boolean) : [])

// Staff write Arabic and English only; French and Indonesian pages read the English.
const contentLocale = (locale: AppLocale) => (locale === "ar" ? "ar" : "en")

async function fetchItems(path: string): Promise<unknown[] | null> {
  const base = serverChatApiUrl()
  try {
    const response = await fetch(`${base}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["site-content"] },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!response.ok) return null
    const body = (await response.json()) as { items?: unknown }
    return Array.isArray(body.items) ? body.items : null
  } catch {
    return null
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null

export async function loadNews(locale: AppLocale): Promise<readonly NewsPost[]> {
  const items = await fetchItems(`/content/news?locale=${contentLocale(locale)}`)
  if (!items) return getNews(locale)
  const posts = items.filter(isRecord).flatMap((item): NewsPost[] => {
    const slug = str(item.slug)
    const title = str(item.title)
    if (!slug || !title) return []
    return [
      {
        slug,
        title,
        excerpt: str(item.excerpt),
        body: str(item.body),
        publishedAt: str(item.publishedAt),
        coverImage: strOrNull(item.coverImage),
        media: strList(item.media),
      },
    ]
  })
  return posts.length ? posts : getNews(locale)
}

export async function loadNewsPost(
  locale: AppLocale,
  slug: string,
): Promise<NewsPost | undefined> {
  return (await loadNews(locale)).find((post) => post.slug === slug)
}

export async function loadTestimonials(locale: AppLocale): Promise<readonly Testimonial[]> {
  const items = await fetchItems(`/content/testimonial?locale=${contentLocale(locale)}`)
  if (!items) return getTestimonials(locale)
  const list = items.filter(isRecord).flatMap((item): Testimonial[] => {
    const id = str(item.id)
    const quote = str(item.quote)
    const name = str(item.name)
    if (!id || !quote || !name) return []
    return [{ id, quote, name, role: str(item.role), avatar: strOrNull(item.avatar) }]
  })
  return list.length ? list : getTestimonials(locale)
}

/** The backend stores all four locales for the fleet (falling back per field itself). */
export async function loadFleet(locale: AppLocale): Promise<readonly FleetCategory[]> {
  const items = await fetchItems(`/fleet?locale=${locale}`)
  if (!items) return getFleet(locale)
  const fleet = items.filter(isRecord).flatMap((item): FleetCategory[] => {
    const id = str(item.id)
    const name = str(item.name)
    if (!id || !name) return []
    const exteriorImages = strList(item.exteriorImages)
    const interiorImages = strList(item.interiorImages)
    return [
      {
        id,
        name,
        seatsLabel: str(item.seatsLabel),
        summary: str(item.summary),
        amenities: strList(item.amenities),
        coverImage: str(item.coverImage) || exteriorImages[0] || "",
        exteriorImages,
        interiorImages,
        images: [...exteriorImages, ...interiorImages],
        showInShowroom: item.showInShowroom !== false,
        quoteClass: str(item.quoteClass),
      },
    ]
  })
  return fleet.length ? fleet : getFleet(locale)
}

/** ISO dates from the admin become "15 Oct 2026"; anything else is shown as written. */
export function formatContentDate(value: string, locale: AppLocale): string {
  if (!/^\d{4}-\d{2}-\d{2}/.test(value)) return value
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const dateLocales: Record<AppLocale, string> = {
    ar: "ar-SA-u-ca-gregory",
    en: "en-GB",
    fr: "fr-FR",
    id: "id-ID",
  }
  return date.toLocaleDateString(dateLocales[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Riyadh",
  })
}
