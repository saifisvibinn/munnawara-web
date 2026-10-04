import { DEFAULT_CHAT_API_URL } from "@/lib/chat/upstream"
import { NextRequest, NextResponse } from "next/server"

const UPSTREAM = (
  process.env.CHAT_API_URL ||
  process.env.NEXT_PUBLIC_CHAT_API_URL ||
  DEFAULT_CHAT_API_URL
).replace(/\/$/, "")

const UPSTREAM_TIMEOUT_MS = 30_000
const MAX_BODY_BYTES = 64 * 1024

/** Only the calls made by `src/lib/chat/chat.ts`. */
const ALLOWED_ROUTES: Record<string, readonly string[]> = {
  guided: ["GET"],
  history: ["GET"],
  session: ["POST"],
  message: ["POST"],
}

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
  "origin",
  "referer",
  "cookie",
  // Re-computed by fetch from the body we forward.
  "content-length",
])

type RouteContext = {
  params: Promise<{ path: string[] }>
}

const json = (error: string, status: number) =>
  NextResponse.json({ error }, { status })

const proxyChat = async (req: NextRequest, context: RouteContext) => {
  const { path } = await context.params
  const allowedMethods = path.length === 1 ? ALLOWED_ROUTES[path[0]] : undefined
  if (!allowedMethods) return json("Not found", 404)
  if (!allowedMethods.includes(req.method)) return json("Method not allowed", 405)

  const declaredLength = Number(req.headers.get("content-length") ?? 0)
  if (declaredLength > MAX_BODY_BYTES) return json("Payload too large", 413)

  const target = new URL(`${UPSTREAM}/chat/${path[0]}`)
  req.nextUrl.searchParams.forEach((value, key) => {
    target.searchParams.set(key, value)
  })

  // x-forwarded-for / x-real-ip pass through on purpose: the backend
  // rate-limits per client IP.
  const headers = new Headers()
  req.headers.forEach((value, key) => {
    if (HOP_BY_HOP.has(key.toLowerCase())) return
    headers.set(key, value)
  })
  headers.set("Accept", "application/json")

  let body: ArrayBuffer | undefined
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = await req.arrayBuffer()
    if (body.byteLength > MAX_BODY_BYTES) return json("Payload too large", 413)
  }

  let upstream: Response
  try {
    upstream = await fetch(target, {
      method: req.method,
      headers,
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    })
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === "TimeoutError"
    return json(
      timedOut ? "Chat API timed out" : "Chat API unreachable",
      timedOut ? 504 : 502,
    )
  }

  const responseHeaders = new Headers()
  const contentType = upstream.headers.get("content-type")
  if (contentType) responseHeaders.set("content-type", contentType)

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  })
}

export const GET = proxyChat
export const POST = proxyChat
