/**
 * Live chat backend (the droplet). Used when no env var is set, so removing
 * this would break production chat if CHAT_API_URL is missing on Vercel.
 */
export const DEFAULT_CHAT_API_URL = "https://104-248-198-154.sslip.io"

/**
 * Server-side backend base: CHAT_API_URL, then NEXT_PUBLIC_CHAT_API_URL,
 * then `fallback`. Trailing slash stripped.
 */
export const serverChatApiUrl = (fallback: string = DEFAULT_CHAT_API_URL) =>
  (
    process.env.CHAT_API_URL ||
    process.env.NEXT_PUBLIC_CHAT_API_URL ||
    fallback
  ).replace(/\/$/, "")
