/**
 * Every visitor reaches the backend from this server's IP. With the shared
 * CHAT_PROXY_KEY the backend rate-limits on the real visitor IP instead of
 * one bucket for the whole site. Empty when the key or the IP is missing.
 */
export const proxyHeadersFrom = (incoming: Headers): Record<string, string> => {
  const proxyKey = process.env.CHAT_PROXY_KEY
  const visitorIp =
    incoming.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    incoming.get("x-real-ip")?.trim()
  return proxyKey && visitorIp ? { "x-proxy-key": proxyKey, "x-client-ip": visitorIp } : {}
}
