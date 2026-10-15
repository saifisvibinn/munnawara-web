import { getCareers, getNews, getTestimonials } from "@/content"
import type { AppLocale, CareerRole, NewsPost, Testimonial } from "@/content/types"
import { DEFAULT_CHAT_API_URL } from "@/lib/chat/upstream"

/**
 * News, careers and testimonials are edited by staff in the admin console
 * (backend `GET /content/:kind`). Pages re-check at most once a minute. If the
 * backend is down or returns nothing usable, the hard-coded lists in
 * src/content are used so the site never breaks.
 */
const REVALIDATE_SECONDS = 60
const TIMEOUT_MS = 5_000

type Kind = "news" | "career" | "testimonial"

function backendBaseUrl() {
  return (
    process.env.CHAT_API_URL ||
    process.env.NEXT_PUBLIC_CHAT_API_URL ||
    DEFAULT_CHAT_API_URL
  ).replace(/\/$/, "")
}

const str = (value: unknown) => (typeof value === "string" ? value : "")
const strOrNull = (value: unknown) => (typeof value === "string" && value ? value : null)

async function fetchItems(kind: Kind, locale: AppLocale): Promise<unknown[] | null> {
  const base = backendBaseUrl()
  if (!base) return null
  try {
    const response = await fetch(`${base}/content/${kind}?locale=${locale}`, {
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
  const items = await fetchItems("news", locale)
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

export async function loadCareers(locale: AppLocale): Promise<readonly CareerRole[]> {
  const items = await fetchItems("career", locale)
  if (!items) return getCareers(locale)
  const roles = items.filter(isRecord).flatMap((item): CareerRole[] => {
    const id = str(item.id)
    const title = str(item.title)
    if (!id || !title) return []
    return [
      {
        id,
        title,
        location: str(item.location),
        type: str(item.type),
        summary: str(item.summary),
      },
    ]
  })
  return roles.length ? roles : getCareers(locale)
}

export async function loadTestimonials(locale: AppLocale): Promise<readonly Testimonial[]> {
  const items = await fetchItems("testimonial", locale)
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

/** ISO dates from the admin become "15 Oct 2026"; anything else is shown as written. */
export function formatContentDate(value: string, locale: AppLocale): string {
  if (!/^\d{4}-\d{2}-\d{2}/.test(value)) return value
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(locale === "ar" ? "ar-SA-u-ca-gregory" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Riyadh",
  })
}
