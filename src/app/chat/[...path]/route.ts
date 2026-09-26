import { NextRequest, NextResponse } from "next/server"

const UPSTREAM = (
  process.env.CHAT_API_URL ||
  process.env.NEXT_PUBLIC_CHAT_API_URL ||
  "https://164-92-131-93.sslip.io"
).replace(/\/$/, "")

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
])

type RouteContext = {
  params: Promise<{ path: string[] }>
}

const proxyChat = async (req: NextRequest, context: RouteContext) => {
  const { path } = await context.params
  const target = new URL(`${UPSTREAM}/chat/${path.join("/")}`)
  req.nextUrl.searchParams.forEach((value, key) => {
    target.searchParams.set(key, value)
  })

  const headers = new Headers()
  req.headers.forEach((value, key) => {
    if (HOP_BY_HOP.has(key.toLowerCase())) return
    headers.set(key, value)
  })
  headers.set("Accept", "application/json")

  let body: ArrayBuffer | undefined
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = await req.arrayBuffer()
  }

  let upstream: Response
  try {
    upstream = await fetch(target, {
      method: req.method,
      headers,
      body,
      cache: "no-store",
    })
  } catch {
    return NextResponse.json(
      { error: "Chat API unreachable" },
      { status: 502 },
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
export const PUT = proxyChat
export const PATCH = proxyChat
export const DELETE = proxyChat
