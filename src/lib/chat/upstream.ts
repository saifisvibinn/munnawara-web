/**
 * Live chat backend (the droplet). Used when no env var is set, so removing
 * this would break production chat if CHAT_API_URL is missing on Vercel.
 * Keep `next.config.ts` (socket.io rewrite) in sync — it cannot import this file.
 */
export const DEFAULT_CHAT_API_URL = "https://164-92-131-93.sslip.io"
