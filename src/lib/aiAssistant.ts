import { z } from "zod"

export const assistantRequestSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  locale: z.enum(["ar", "en"]),
  conversationId: z.string().uuid().optional(),
})

export type AssistantRequest = z.infer<typeof assistantRequestSchema>

export type AssistantMessage = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

export type AssistantResponse = {
  ok: boolean
  conversationId: string
  reply: string | null
  status: "ok" | "unavailable" | "error"
}

export const ASSISTANT_API_PATH = "/api/assistant"

export const sendAssistantMessage = async (
  payload: AssistantRequest,
): Promise<AssistantResponse> => {
  const response = await fetch(ASSISTANT_API_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    return {
      ok: false,
      conversationId: payload.conversationId ?? crypto.randomUUID(),
      reply: null,
      status: "error",
    }
  }

  return (await response.json()) as AssistantResponse
}
