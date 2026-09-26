/**
 * Chat HTTP base.
 * Browser always uses same-origin `/chat` via the Next route proxy
 * (src/app/chat/[...path]/route.ts) so droplet CORS never blocks the UI.
 * Sockets use NEXT_PUBLIC_CHAT_API_URL in socket.ts — not this module.
 */
const API_BASE = (
  typeof window === "undefined"
    ? process.env.CHAT_API_URL ||
      process.env.NEXT_PUBLIC_CHAT_API_URL ||
      ""
    : ""
).replace(/\/$/, "")

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export const api = async <T>(
  path: string,
  options: RequestInit & { json?: unknown } = {},
): Promise<T> => {
  const { json, headers, ...rest } = options
  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...rest,
      headers: {
        Accept: "application/json",
        ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: json !== undefined ? JSON.stringify(json) : rest.body,
    })
  } catch {
    throw new ApiError(
      0,
      "Network error — check the chat API URL / CORS configuration.",
    )
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message =
      (data &&
        typeof data === "object" &&
        "error" in data &&
        String((data as { error: unknown }).error)) ||
      `Request failed (${res.status})`
    throw new ApiError(res.status, message)
  }
  return data as T
}

export const chatApiBase = () => API_BASE
