import { api, ApiError } from "./api"

/** `href` options are links (e.g. the quote form); the rest are sent back as `choiceId`. */
export type ChatOption = { id: string; label: string; href?: string }

export type ChatLang = "en" | "ar"

/** Set when Durra is waiting for a file (a CV, a complaint photo): show the attach button. */
export type ChatUpload = { accept: string[]; maxMb: number; optional: boolean }

export type ChatReply = {
  conversationId: string
  status: string
  escalated: boolean
  answer: string | null
  /** Server id of Durra AI's reply — used to de-duplicate HTTP + socket copies. */
  messageId?: string | null
  reason: string | null
  systemMessage: string | null
  options?: ChatOption[]
  detail?: string | null
  upload?: ChatUpload | null
}

export type GuidedWelcome = {
  answer: string
  options: ChatOption[]
  reason: string
}

export type VisitorIdentity = {
  name: string
  phone: string
}

export type ChatSession = {
  conversationId: string
  status: string
  customer: {
    id?: string
    name: string
    contact?: string
    email?: string | null
    phone?: string | null
  }
}

const IDENTITY_KEY = "dmtc-chat-identity"
const CONV_KEY = "dmtc-chat-conversation"

export const loadIdentity = (): VisitorIdentity | null => {
  try {
    const stored = localStorage.getItem(IDENTITY_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored) as VisitorIdentity
    if (parsed?.name?.trim() && parsed?.phone?.trim()) {
      return {
        name: parsed.name.trim(),
        phone: parsed.phone.trim(),
      }
    }
  } catch {
    /* ignore */
  }
  return null
}

export const saveIdentity = (identity: VisitorIdentity) => {
  try {
    localStorage.setItem(
      IDENTITY_KEY,
      JSON.stringify({
        name: identity.name.trim(),
        phone: identity.phone.trim(),
      }),
    )
  } catch {
    /* ignore */
  }
}

export const clearIdentity = () => {
  try {
    localStorage.removeItem(IDENTITY_KEY)
  } catch {
    /* ignore */
  }
}

export const loadConversationId = (): string | null => {
  try {
    return localStorage.getItem(CONV_KEY)
  } catch {
    return null
  }
}

export const saveConversationId = (id: string | null) => {
  try {
    if (id) localStorage.setItem(CONV_KEY, id)
    else localStorage.removeItem(CONV_KEY)
  } catch {
    /* ignore */
  }
}

export const fetchGuidedWelcome = (lang: ChatLang) =>
  api<GuidedWelcome>(`/chat/guided?lang=${lang}`)

export const startChatSession = (identity: VisitorIdentity, lang: ChatLang) =>
  api<ChatSession>("/chat/session", {
    method: "POST",
    json: {
      name: identity.name.trim(),
      phone: identity.phone.trim(),
      lang,
    },
  })

export type ChatHistory =
  | { resumable: false }
  | {
      resumable: true
      conversationId: string
      status: string
      language: ChatLang
      messages: { id: string; sender: string; text: string; createdAt?: string }[]
      options: ChatOption[]
      upload?: ChatUpload | null
    }

/** Ask the server to restore an open chat after a page reload. */
export const fetchChatHistory = (conversationId: string, phone: string) =>
  api<ChatHistory>(
    `/chat/history?conversationId=${encodeURIComponent(conversationId)}&phone=${encodeURIComponent(phone)}`,
  )

/**
 * Upload a file straight to storage for the step Durra is waiting on.
 * Returns what to send back as the message's `attachment`.
 */
export const uploadChatFile = async (conversationId: string, file: File) => {
  const slot = await api<{ key: string; uploadUrl: string; headers: Record<string, string> }>(
    "/chat/upload",
    {
      method: "POST",
      // The phone proves this visitor owns the chat (same check as history and live updates).
      json: { conversationId, contentType: file.type, size: file.size, customerPhone: loadIdentity()?.phone },
    },
  )
  const res = await fetch(slot.uploadUrl, { method: "PUT", headers: slot.headers, body: file })
  if (!res.ok) throw new ApiError(res.status, "Upload failed")
  return { key: slot.key, name: file.name }
}

export const sendChatMessage = (input: {
  text?: string
  choiceId?: string
  attachment?: { key: string; name: string }
  conversationId?: string | null
  lang?: ChatLang
}) => {
  if (!input.conversationId) {
    return Promise.reject(new Error("Start a chat session first"))
  }
  return api<ChatReply>("/chat/message", {
    method: "POST",
    json: {
      text: input.text,
      choiceId: input.choiceId,
      attachment: input.attachment,
      conversationId: input.conversationId,
      // The phone proves this visitor owns the chat (same check as history and live updates).
      customerPhone: loadIdentity()?.phone,
      lang: input.lang,
    },
  })
}
