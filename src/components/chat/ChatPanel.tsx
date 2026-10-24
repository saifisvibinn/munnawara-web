"use client"

import { Link } from "@/i18n/navigation"
import {
  ApiError,
  clearIdentity,
  connectCustomerSocket,
  disconnectCustomerSocket,
  fetchChatHistory,
  fetchGuidedWelcome,
  joinConversation,
  loadConversationId,
  loadIdentity,
  playChatNotifySound,
  saveConversationId,
  saveIdentity,
  sendChatMessage,
  startChatSession,
  uploadChatFile,
  type ChatLang,
  type ChatOption,
  type ChatUpload,
  type VisitorIdentity,
} from "@/lib/chat"
import { useLocale, useTranslations } from "next-intl"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { project, SPRING_SHEET } from "@/lib/appleMotion"
import { AnimatePresence, motion, useDragControls } from "motion/react"
import { RobotAvatar } from "./RobotAvatar"
import { chatGreeting } from "./chatGreeting"
import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react"

type Role = "user" | "assistant" | "admin" | "system"

type UiMessage = {
  id: string
  role: Role
  text: string
}

type ChatPanelProps = {
  open: boolean
  onClose: () => void
  onUnreadChange?: (count: number) => void
}

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const mapSocketSender = (sender: string): Role => {
  if (sender === "admin") return "admin"
  if (sender === "customer") return "user"
  if (sender === "system") return "system"
  return "assistant"
}

const emptyIdentity = (): VisitorIdentity => ({ name: "", phone: "" })

/** The server's text only when it is meant for visitors (rate limit, already translated); else our own. */
const visitorError = (err: unknown, fallback: string) =>
  err instanceof ApiError && err.status === 429 ? err.message : fallback

/** The stored chat is gone (deleted by staff, or not this visitor's): 404, or 400 for an unknown id. */
const chatIsGone = (err: unknown) =>
  err instanceof ApiError && (err.status === 404 || err.status === 400)

const TYPE_BY_EXT: Record<string, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
}

/** Turn bare https:// links in a message into real links. */
const RichText = ({ text }: { text: string }) => {
  const parts = text.split(/(https?:\/\/[^\s)]+)/g)
  return (
    <>
      {parts.map((part, i) =>
        /^https?:\/\//.test(part) ? (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}

export const ChatPanel = ({ open, onClose, onUnreadChange }: ChatPanelProps) => {
  const t = useTranslations("chat")
  const locale = useLocale()
  const lang: ChatLang = locale === "ar" ? "ar" : "en"
  const titleId = useId()
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const seenIdsRef = useRef<Set<string>>(new Set())
  const restartRef = useRef<() => void>(() => {})
  const openRef = useRef(open)
  const unreadRef = useRef(0)
  const dragControls = useDragControls()
  const reducedMotion = useReducedMotion()
  const [coarsePointer, setCoarsePointer] = useState(false)

  const [identity, setIdentity] = useState<VisitorIdentity>(
    () => loadIdentity() || emptyIdentity(),
  )
  const [identified, setIdentified] = useState(() => Boolean(loadIdentity()))
  const [messages, setMessages] = useState<UiMessage[]>([])
  const [options, setOptions] = useState<ChatOption[]>([])
  /** Set while Durra waits for a file (CV, complaint photo). */
  const [upload, setUpload] = useState<ChatUpload | null>(null)
  const [uploadingName, setUploadingName] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [draft, setDraft] = useState("")
  const [busy, setBusy] = useState(false)
  const [escalated, setEscalated] = useState(false)
  const [claimed, setClaimed] = useState(false)
  const [bootError, setBootError] = useState<string | null>(null)
  const [booted, setBooted] = useState(false)
  const [moreTopics, setMoreTopics] = useState(false)
  const [choicesOpen, setChoicesOpen] = useState(false)
  const greeting = useMemo(() => (open ? chatGreeting() : null), [open])

  const showTopics = async () => {
    try {
      const welcome = await fetchGuidedWelcome(lang)
      setMoreTopics(false)
      setOptions(welcome.options ?? [])
    } catch {
      /* menu is optional; the composer still works */
    }
  }

  openRef.current = open

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)")
    const sync = () => setCoarsePointer(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  const setUnread = useCallback(
    (n: number) => {
      unreadRef.current = n
      onUnreadChange?.(n)
    },
    [onUnreadChange],
  )

  // Unseen = panel closed, or open in a browser tab the visitor has left.
  const bumpUnread = useCallback(() => {
    if (openRef.current && !document.hidden) return
    const next = unreadRef.current + 1
    setUnread(next)
    playChatNotifySound()
  }, [setUnread])

  useEffect(() => {
    if (open) setUnread(0)
  }, [open, setUnread])

  // Coming back to the tab with the chat open counts as reading it.
  useEffect(() => {
    const onVisible = () => {
      if (!document.hidden && openRef.current) setUnread(0)
    }
    document.addEventListener("visibilitychange", onVisible)
    return () => document.removeEventListener("visibilitychange", onVisible)
  }, [setUnread])

  // Phones: the panel fills the screen. Track the visual viewport so the on-screen
  // keyboard shrinks the panel instead of covering the composer, and stop the page behind from scrolling.
  const [viewport, setViewport] = useState<{ top: number; height: number } | null>(null)
  useEffect(() => {
    const phone = window.matchMedia("(max-width: 520px)")
    if (!open || !phone.matches) return
    const vv = window.visualViewport
    const sync = () => {
      // Rotated or resized past phone width: back to the floating panel.
      if (!phone.matches) return setViewport(null)
      if (vv) setViewport({ top: vv.offsetTop, height: vv.height })
    }
    sync()
    vv?.addEventListener("resize", sync)
    vv?.addEventListener("scroll", sync)
    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = "hidden"
    return () => {
      vv?.removeEventListener("resize", sync)
      vv?.removeEventListener("scroll", sync)
      root.style.overflow = prevOverflow
      setViewport(null)
    }
  }, [open])

  // Escape closes the panel.
  useEffect(() => {
    if (!open) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  /** De-duplicates by server message id, then by identical consecutive text. */
  // A fresh set of buttons starts collapsed again once the chat is under way.
  useEffect(() => {
    setMoreTopics(false)
  }, [options])

  const appendMessage = useCallback((message: UiMessage) => {
    if (seenIdsRef.current.has(message.id)) return
    seenIdsRef.current.add(message.id)
    setMessages((prev) => {
      const last = prev[prev.length - 1]
      if (last && last.role === message.role && last.text === message.text) {
        return prev
      }
      return [...prev, message]
    })
  }, [])

  const scrollToEnd = useCallback(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: reducedMotion ? "auto" : "smooth" })
  }, [reducedMotion])

  useEffect(() => {
    if (open && identified) scrollToEnd()
  }, [open, identified, messages, options, busy, scrollToEnd])

  // Focus the composer when the panel opens — but only with a mouse/keyboard,
  // so phones don't pop the on-screen keyboard over the answers.
  useEffect(() => {
    if (!open || !identified) return
    if (!window.matchMedia("(pointer: fine)").matches) return
    const timer = window.setTimeout(() => inputRef.current?.focus(), 120)
    return () => window.clearTimeout(timer)
  }, [open, identified])

  useEffect(() => {
    if (!conversationId) return

    const socket = connectCustomerSocket()
    joinConversation(conversationId)

    const onMessage = (payload: {
      sender?: string
      text?: string
      messageId?: string
      conversationId?: string
    }) => {
      if (
        payload.conversationId &&
        payload.conversationId !== conversationId
      ) {
        return
      }
      const text = String(payload.text || "").trim()
      if (!text) return
      const sender = payload.sender || "ai"
      if (sender === "customer") return

      appendMessage({
        id: payload.messageId || `sock-${uid()}`,
        role: mapSocketSender(sender),
        text,
      })
      bumpUnread()

      if (sender === "admin") {
        setClaimed(true)
        setEscalated(true)
        setOptions([])
        setUpload(null)
      }
    }

    const onClaimed = (payload: { conversationId?: string }) => {
      if (payload.conversationId && payload.conversationId !== conversationId) {
        return
      }
      setClaimed(true)
      setEscalated(true)
      setOptions([])
      setUpload(null)
      appendMessage({
        id: `claimed-${uid()}`,
        role: "system",
        text: t("claimed"),
      })
      bumpUnread()
    }

    const onEscalated = (payload: { conversationId?: string }) => {
      if (payload.conversationId && payload.conversationId !== conversationId) {
        return
      }
      setEscalated(true)
      setOptions([])
      setUpload(null)
    }

    socket.on("message:new", onMessage)
    socket.on("conversation:claimed", onClaimed)
    // Chat closed (by the team or for inactivity): Durra AI answers the next message.
    const onClosed = (payload: { conversationId?: string }) => {
      if (payload.conversationId && payload.conversationId !== conversationId) {
        return
      }
      setEscalated(false)
      setClaimed(false)
      fetchGuidedWelcome(lang)
        .then((welcome) => setOptions(welcome.options ?? []))
        .catch(() => {})
    }

    // Staff deleted the chat: open a fresh one so the visitor isn't left writing into nothing.
    const onDeleted = (payload: { conversationId?: string }) => {
      if (payload.conversationId && payload.conversationId !== conversationId) {
        return
      }
      restartRef.current()
    }

    socket.on("conversation:escalated", onEscalated)
    socket.on("conversation:closed", onClosed)
    socket.on("conversation:deleted", onDeleted)

    // Rooms are lost on disconnect: rejoin, and after a *re*connect pull anything missed.
    let wasConnected = socket.connected
    const onConnect = () => {
      joinConversation(conversationId)
      if (!wasConnected) {
        wasConnected = true
        return
      }
      const phone = loadIdentity()?.phone
      if (!phone) return
      fetchChatHistory(conversationId, phone)
        .then((history) => {
          if (!history.resumable) return
          for (const m of history.messages) {
            if (m.sender === "customer") continue
            appendMessage({ id: m.id, role: mapSocketSender(m.sender), text: m.text })
          }
        })
        .catch(() => {})
    }
    socket.on("connect", onConnect)

    return () => {
      socket.off("message:new", onMessage)
      socket.off("conversation:claimed", onClaimed)
      socket.off("conversation:escalated", onEscalated)
      socket.off("conversation:closed", onClosed)
      socket.off("conversation:deleted", onDeleted)
      socket.off("connect", onConnect)
    }
  }, [conversationId, appendMessage, bumpUnread, t, lang])

  useEffect(() => {
    return () => disconnectCustomerSocket()
  }, [])

  // Safety net: if the live connection is down while staff handle the chat,
  // check for their replies every 10 seconds so the visitor still sees them.
  useEffect(() => {
    if (!conversationId || !escalated) return
    const timer = window.setInterval(() => {
      if (connectCustomerSocket().connected) return
      const phone = loadIdentity()?.phone
      if (!phone) return
      fetchChatHistory(conversationId, phone)
        .then((history) => {
          if (!history.resumable) return
          if (history.status === "claimed") setClaimed(true)
          for (const m of history.messages) {
            if (m.sender === "customer" || seenIdsRef.current.has(m.id)) continue
            appendMessage({ id: m.id, role: mapSocketSender(m.sender), text: m.text })
            bumpUnread()
          }
        })
        .catch(() => {})
    }, 10_000)
    return () => window.clearInterval(timer)
  }, [conversationId, escalated, appendMessage, bumpUnread])

  /**
   * Open the chat: restore the stored conversation if the server still has it open,
   * otherwise start a fresh session with the welcome menu.
   */
  const beginSession = useCallback(
    /** `resumeOnly`: reconnect a stored live chat in the background, never start a new one. */
    async (visitor: VisitorIdentity, resumeOnly = false) => {
      setBusy(true)
      setBootError(null)
      try {
        saveIdentity(visitor)

        const storedId = loadConversationId()
        if (storedId) {
          try {
            const history = await fetchChatHistory(storedId, visitor.phone)
            if (history.resumable && history.messages.length > 0) {
              seenIdsRef.current.clear()
              history.messages.forEach((m) => seenIdsRef.current.add(m.id))
              setMessages(
                history.messages.map((m) => ({
                  id: m.id,
                  role: mapSocketSender(m.sender),
                  text: m.text,
                })),
              )
              setOptions(history.options ?? [])
              setUpload(history.upload ?? null)
              setConversationId(history.conversationId)
              joinConversation(history.conversationId)
              setEscalated(history.status === "needs_human" || history.status === "claimed")
              setClaimed(history.status === "claimed")
              setIdentified(true)
              setBooted(true)
              setUnread(0)
              return
            }
          } catch {
            /* stale or unreachable history — fall through to a fresh chat */
          }
          if (resumeOnly) return
          saveConversationId(null)
        }
        if (resumeOnly) return

        const session = await startChatSession(visitor, lang)
        const welcome = await fetchGuidedWelcome(lang)

        const welcomeMsg = {
          id: uid(),
          role: "assistant" as const,
          text: welcome.answer,
        }
        seenIdsRef.current.clear()
        seenIdsRef.current.add(welcomeMsg.id)
        setMessages([welcomeMsg])
        setOptions(welcome.options ?? [])
        setUpload(null)
        setConversationId(session.conversationId)
        saveConversationId(session.conversationId)
        joinConversation(session.conversationId)
        setEscalated(false)
        setClaimed(false)
        setIdentified(true)
        setBooted(true)
        setUnread(0)
      } catch (err) {
        if (resumeOnly) return
        setBootError(visitorError(err, t("error")))
        throw err
      } finally {
        setBusy(false)
      }
    },
    [t, setUnread, lang],
  )

  /** Drop the stored chat and start a new one for the same visitor. */
  const restartChat = useCallback(async () => {
    saveConversationId(null)
    setConversationId(null)
    const visitor = loadIdentity()
    if (!visitor) {
      setIdentified(false)
      setBooted(false)
      return
    }
    try {
      await beginSession(visitor)
      appendMessage({ id: uid(), role: "system", text: t("restarted") })
    } catch {
      /* bootError set */
    }
  }, [beginSession, appendMessage, t])

  restartRef.current = () => void restartChat()

  useEffect(() => {
    if (!identified || booted) return
    // Closed: only reconnect a returning visitor's chat, so staff replies still ring.
    if (!open && !loadConversationId()) return
    const visitor = loadIdentity()
    if (!visitor) {
      setIdentified(false)
      return
    }
    let cancelled = false
    void beginSession(visitor, !open).catch(() => {
      if (!cancelled) setIdentified(false)
    })
    return () => {
      cancelled = true
    }
  }, [open, identified, booted, beginSession])

  const handleIdentitySubmit = async (event: FormEvent) => {
    event.preventDefault()
    const next = {
      name: identity.name.trim(),
      phone: identity.phone.trim(),
    }
    if (!next.name || !next.phone) return
    setIdentity(next)
    try {
      await beginSession(next)
    } catch {
      /* bootError set */
    }
  }

  const send = useCallback(
    async (payload: {
      text?: string
      choiceId?: string
      label?: string
      attachment?: { key: string; name: string }
    }) => {
      if (busy || !conversationId) return
      const text = payload.text?.trim()
      const { choiceId, attachment } = payload
      if (!text && !choiceId && !attachment) return

      setBusy(true)
      setBootError(null)
      const previousOptions = options
      const previousUpload = upload
      const optimistic = payload.label || text || ""
      if (optimistic) {
        appendMessage({ id: uid(), role: "user", text: optimistic })
      }
      setDraft("")
      setOptions([])
      setUpload(null)

      try {
        const reply = await sendChatMessage({
          text: text || undefined,
          choiceId,
          attachment,
          conversationId,
          lang,
        })

        setConversationId(reply.conversationId)
        saveConversationId(reply.conversationId)
        joinConversation(reply.conversationId)

        if (
          reply.escalated ||
          reply.reason === "claimed" ||
          reply.reason === "already_escalated"
        ) {
          setEscalated(true)
        }
        if (reply.reason === "claimed") setClaimed(true)
        // Reopened after a close: Durra AI is answering again.
        if (reply.status === "ai_handling") {
          setEscalated(false)
          setClaimed(false)
        }
        setOptions(reply.options ?? [])
        setUpload(reply.upload ?? null)

        if (reply.escalated && reply.systemMessage) {
          appendMessage({
            id: reply.messageId || uid(),
            role: "system",
            text: reply.systemMessage,
          })
        } else if (reply.answer?.trim()) {
          appendMessage({
            id: reply.messageId || uid(),
            role: "assistant",
            text: reply.answer.trim(),
          })
        } else if (reply.reason === "already_escalated" && reply.systemMessage) {
          appendMessage({ id: uid(), role: "system", text: reply.systemMessage })
        }
      } catch (err) {
        // Give the customer their words and buttons back so nothing is lost.
        setDraft(text ?? "")
        if (chatIsGone(err)) {
          await restartChat()
          return
        }
        setOptions(previousOptions)
        setUpload(previousUpload)
        setBootError(visitorError(err, t("error")))
      } finally {
        setBusy(false)
      }
    },
    [appendMessage, busy, conversationId, lang, options, upload, t, restartChat],
  )

  /** Check the picked file, upload it straight to storage, then send it as the answer. */
  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0]
    event.target.value = ""
    if (!picked || !upload || !conversationId || busy) return
    // Some systems (Windows without Office, Android pickers) give Word files no type: use the extension.
    const type = upload.accept.includes(picked.type)
      ? picked.type
      : TYPE_BY_EXT[picked.name.split(".").pop()?.toLowerCase() ?? ""] ?? picked.type
    const file = type === picked.type ? picked : new File([picked], picked.name, { type })
    if (!upload.accept.includes(file.type)) {
      setBootError(t("attachWrongType"))
      return
    }
    if (file.size > upload.maxMb * 1024 * 1024) {
      setBootError(t("attachTooBig", { max: upload.maxMb }))
      return
    }
    setBootError(null)
    setUploadingName(file.name)
    let attachment: { key: string; name: string }
    try {
      attachment = await uploadChatFile(conversationId, file)
    } catch {
      setBootError(t("attachFailed"))
      return
    } finally {
      setUploadingName(null)
    }
    await send({ attachment, label: file.name })
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    void send({ text: draft })
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      void send({ text: draft })
    }
  }

  const handleResetChat = () => {
    saveConversationId(null)
    setConversationId(null)
    setMessages([])
    setOptions([])
    setUpload(null)
    setEscalated(false)
    setClaimed(false)
    setBooted(false)
    setBootError(null)
    setDraft("")
    seenIdsRef.current.clear()
    setUnread(0)
    disconnectCustomerSocket()
  }

  const handleChangeIdentity = () => {
    clearIdentity()
    saveConversationId(null)
    setConversationId(null)
    setIdentified(false)
    setBooted(false)
    setMessages([])
    setOptions([])
    setUpload(null)
    setEscalated(false)
    setClaimed(false)
    setBootError(null)
    setDraft("")
    seenIdsRef.current.clear()
    setUnread(0)
    disconnectCustomerSocket()
  }

  const whoLabel = (role: Role) => {
    if (role === "user") return t("you")
    if (role === "system") return t("system")
    if (role === "admin") return t("agent")
    return t("assistant")
  }

  const canSubmitIdentity =
    identity.name.trim() && identity.phone.trim()

  const COMPACT_TOPICS = 6
  const topics = options.filter((o) => !o.href)
  const links = options.filter((o) => o.href)
  const compactMenu = messages.length > 2 && !moreTopics && topics.length > COMPACT_TOPICS
  const visibleTopics = compactMenu ? topics.slice(0, COMPACT_TOPICS) : topics
  const hiddenCount = topics.length - COMPACT_TOPICS

  const statusLabel = claimed
    ? t("claimed")
    : escalated
      ? t("escalated")
      : t("subtitle")

  const handleSheetDragEnd = (
    _: unknown,
    info: { offset: { y: number }; velocity: { y: number } },
  ) => {
    const projected = info.offset.y + project(info.velocity.y)
    if (projected > 110 || info.velocity.y > 700) onClose()
  }

  return (
    <AnimatePresence>
      {open ? (
    <motion.div
      key="chat-panel"
      className="chat-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      dir={locale === "ar" ? "rtl" : "ltr"}
      style={
        viewport
          ? { top: viewport.top, height: viewport.height, bottom: "auto" }
          : undefined
      }
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
      animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.98 }}
      transition={SPRING_SHEET}
      drag={reducedMotion || !coarsePointer ? false : "y"}
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.06, bottom: 0.5 }}
      onDragEnd={handleSheetDragEnd}
    >
      <header
        className="chat-panel__header"
        onPointerDown={(event) => {
          if (reducedMotion) return
          // Don't steal taps on close / reset.
          if ((event.target as HTMLElement).closest("button")) return
          dragControls.start(event)
        }}
      >
        <div className="chat-panel__heading">
          <div className="chat-panel__title-row">
            <RobotAvatar
              className="chat-panel__avatar"
              mood={busy ? "think" : "idle"}
            />
            <span className="chat-panel__live" aria-hidden />
            <h2 id={titleId}>{t("title")}</h2>
          </div>
          {identified ? (
            <p>
              {statusLabel}
              {" · "}
              <button
                type="button"
                className="chat-panel__inline"
                onClick={handleChangeIdentity}
              >
                {t("identityChange")}
              </button>
            </p>
          ) : null}
        </div>
        <div className="chat-panel__actions">
          {identified ? (
            <button
              type="button"
              className="chat-panel__ghost"
              onClick={handleResetChat}
            >
              {t("reset")}
            </button>
          ) : null}
          <button
            type="button"
            className="chat-panel__close"
            aria-label={t("close")}
            onClick={onClose}
          >
            ×
          </button>
        </div>
      </header>

      {!identified ? (
        <form
          className="chat-panel__identity"
          onSubmit={(e) => void handleIdentitySubmit(e)}
        >
          <h3>{t("identityTitle")}</h3>
          <p>{t("identityLead")}</p>
          <label>
            <span>{t("identityName")}</span>
            <input
              type="text"
              name="name"
              autoComplete="name"
              required
              maxLength={120}
              value={identity.name}
              placeholder={t("identityNamePh")}
              onChange={(e) =>
                setIdentity((s) => ({ ...s, name: e.target.value }))
              }
            />
          </label>
          <label>
            <span>{t("identityPhone")}</span>
            <input
              type="tel"
              name="phone"
              dir="ltr"
              autoComplete="tel"
              minLength={5}
              maxLength={40}
              inputMode="tel"
              required
              value={identity.phone}
              placeholder={t("identityPhonePh")}
              onChange={(e) =>
                setIdentity((s) => ({ ...s, phone: e.target.value }))
              }
            />
          </label>
          {bootError ? <p className="chat-panel__error">{bootError}</p> : null}
          <button type="submit" disabled={busy || !canSubmitIdentity}>
            {busy ? t("identityStarting") : t("identityContinue")}
          </button>
        </form>
      ) : (
        <>
          <div
            className="chat-panel__messages"
            // Lenis smooth scroll swallows wheel events unless the scroller opts out.
            data-lenis-prevent
            ref={listRef}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.length === 0 && !busy && !bootError ? (
              <p className="chat-panel__hint">{t("empty")}</p>
            ) : null}

            {greeting && messages.length > 0 ? (
              <p className="chat-greeting">
                <span>{t(greeting.time)}</span>
                {greeting.season ? (
                  <span className="chat-greeting__season">{t(greeting.season)}</span>
                ) : null}
              </p>
            ) : null}

            {messages.map((message, index) =>
              // Status notices (handed to a human, agent joined, chat closed) read as a quiet line, not a bubble.
              message.role === "system" ? (
                <p key={message.id} className="chat-greeting chat-notice" dir="auto">
                  {message.text}
                </p>
              ) : (
              <div
                key={message.id}
                className={`chat-bubble chat-bubble--${message.role}`}
                style={{ animationDelay: `${Math.min(index, 8) * 28}ms` }}
              >
                {message.role === "assistant" ? (
                  <RobotAvatar className="chat-bubble__avatar" mood="idle" />
                ) : null}
                <div className="chat-bubble__body">
                  <span className="chat-bubble__who">{whoLabel(message.role)}</span>
                  <p dir="auto">
                    <RichText text={message.text} />
                  </p>
                </div>
              </div>
              ),
            )}

            {/* Links the bot offers (e.g. open the quote form) sit in the conversation, not behind the choices toggle. */}
            {links.length > 0 && !busy ? (
              <div className="chat-panel__links">
                {links.map((option, i) => (
                  <Link
                    key={option.id}
                    href={option.href!}
                    className="chat-panel__option-link"
                    style={{ animationDelay: `${i * 40}ms` }}
                    onClick={onClose}
                  >
                    {option.label} →
                  </Link>
                ))}
              </div>
            ) : null}

            {/* The reply often lands over the socket before the request resolves: drop the dots
                the moment it does, so the bubble takes their place instead of popping in above. */}
            {busy && (messages.length === 0 || messages[messages.length - 1].role === "user") ? (
              <div className="chat-typing-row" role="status" aria-label={t("typing")}>
                <RobotAvatar className="chat-bubble__avatar" mood="think" />
                <div className="chat-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            ) : null}
            {uploadingName ? (
              <p className="chat-panel__hint" role="status">
                {t("attachUploading", { name: uploadingName })}
              </p>
            ) : null}
            {bootError ? <p className="chat-panel__error">{bootError}</p> : null}
          </div>

          {topics.length === 0 && !escalated && !busy && conversationId && messages.length > 1 ? (
            <div className="chat-panel__options">
              <button type="button" className="chat-panel__more" onClick={() => void showTopics()}>
                {t("showTopics")}
              </button>
            </div>
          ) : null}
          {topics.length > 0 && !escalated ? (
            <div className="chat-panel__options">
              <button
                type="button"
                className="chat-panel__more"
                aria-expanded={choicesOpen}
                onClick={() => setChoicesOpen((v) => !v)}
              >
                {choicesOpen ? t("hideChoices") : `${t("showChoices")} (${topics.length})`}
              </button>
              {choicesOpen ? (
                <>
              {visibleTopics.map((option, i) => (
                <button
                  key={option.id}
                  type="button"
                  disabled={busy}
                  style={{ animationDelay: `${i * 40}ms` }}
                  onClick={() =>
                    void send({ choiceId: option.id, label: option.label })
                  }
                >
                  {option.label}
                </button>
              ))}
              {topics.length > COMPACT_TOPICS && messages.length > 2 ? (
                <button
                  type="button"
                  className="chat-panel__more"
                  aria-expanded={moreTopics}
                  onClick={() => setMoreTopics((v) => !v)}
                >
                  {moreTopics ? t("fewerTopics") : `${t("moreTopics")} (${hiddenCount})`}
                </button>
              ) : null}
                </>
              ) : null}
            </div>
          ) : null}
          <form
            className={`chat-panel__composer${upload ? " chat-panel__composer--attach" : ""}`}
            onSubmit={handleSubmit}
          >
            {upload ? (
              <>
                <button
                  type="button"
                  className="chat-panel__attach"
                  aria-label={t("attach")}
                  title={t("attach")}
                  disabled={busy || Boolean(uploadingName)}
                  onClick={() => fileRef.current?.click()}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  hidden
                  accept={upload.accept.join(",")}
                  onChange={(e) => void handleFile(e)}
                />
              </>
            ) : null}
            <textarea
              ref={inputRef}
              rows={2}
              dir="auto"
              maxLength={1000}
              value={draft}
              disabled={busy || !conversationId}
              placeholder={upload && !upload.optional ? t("attachPlaceholder") : t("placeholder")}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="submit"
              disabled={busy || !draft.trim() || !conversationId}
            >
              {t("send")}
            </button>
          </form>
        </>
      )}
    </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
