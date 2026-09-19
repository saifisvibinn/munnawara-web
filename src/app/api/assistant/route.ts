import {
  assistantRequestSchema,
  type AssistantResponse,
} from "@/lib/aiAssistant"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

/**
 * Proxies chat turns to an external assistant backend when configured.
 * Set AI_ASSISTANT_API_URL (and optionally AI_ASSISTANT_API_KEY) to connect.
 *
 * Expected upstream contract:
 * POST { message, locale, conversationId? }
 * → { conversationId, reply }
 */
export const POST = async (request: Request) => {
  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json(
      {
        ok: false,
        conversationId: crypto.randomUUID(),
        reply: null,
        status: "error",
      } satisfies AssistantResponse,
      { status: 400 },
    )
  }

  const parsed = assistantRequestSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        conversationId: crypto.randomUUID(),
        reply: null,
        status: "error",
      } satisfies AssistantResponse,
      { status: 400 },
    )
  }

  const conversationId = parsed.data.conversationId ?? crypto.randomUUID()
  const backendUrl = process.env.AI_ASSISTANT_API_URL?.trim()

  if (!backendUrl) {
    return NextResponse.json({
      ok: true,
      conversationId,
      reply: null,
      status: "unavailable",
    } satisfies AssistantResponse)
  }

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }
    const apiKey = process.env.AI_ASSISTANT_API_KEY?.trim()
    if (apiKey) {
      headers.Authorization = `Bearer ${apiKey}`
    }

    const upstream = await fetch(backendUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        message: parsed.data.message,
        locale: parsed.data.locale,
        conversationId,
      }),
    })

    if (!upstream.ok) {
      return NextResponse.json(
        {
          ok: false,
          conversationId,
          reply: null,
          status: "error",
        } satisfies AssistantResponse,
        { status: 502 },
      )
    }

    const data = (await upstream.json()) as {
      conversationId?: string
      reply?: string
    }

    return NextResponse.json({
      ok: true,
      conversationId: data.conversationId ?? conversationId,
      reply: typeof data.reply === "string" ? data.reply : null,
      status: "ok",
    } satisfies AssistantResponse)
  } catch {
    return NextResponse.json(
      {
        ok: false,
        conversationId,
        reply: null,
        status: "error",
      } satisfies AssistantResponse,
      { status: 502 },
    )
  }
}
