"use client"

import { LogoMark } from "@/components/landing/LogoMark"
import {
  sendAssistantMessage,
  type AssistantMessage,
} from "@/lib/aiAssistant"
import { cn } from "@/lib/cn"
import { useLocale, useTranslations } from "next-intl"
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react"

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
    <path
      d="M6 6l12 12M18 6L6 18"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
    <path
      d="M5 12h12M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const AiAssistant = () => {
  const t = useTranslations("aiAssistant")
  const locale = useLocale()
  const panelId = useId()
  const titleId = useId()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [pending, setPending] = useState(false)
  const [conversationId, setConversationId] = useState<string | undefined>()
  const [messages, setMessages] = useState<AssistantMessage[]>([])

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open || messages.length > 0) return
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: t("welcome"),
      },
    ])
  }, [open, messages.length, t])

  useEffect(() => {
    const node = listRef.current
    if (!node) return
    node.scrollTop = node.scrollHeight
  }, [messages, pending, open])

  useEffect(() => {
    if (!open) return
    const handleKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open])

  const handleToggle = () => {
    setOpen((current) => !current)
  }

  const handleToggleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleToggle()
    }
  }

  const handleClose = () => setOpen(false)

  const handleSubmit = async (event?: FormEvent) => {
    event?.preventDefault()
    const text = input.trim()
    if (!text || pending) return

    const userMessage: AssistantMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    }

    setInput("")
    setMessages((current) => [...current, userMessage])
    setPending(true)

    try {
      const result = await sendAssistantMessage({
        message: text,
        locale: locale === "ar" ? "ar" : "en",
        conversationId,
      })

      setConversationId(result.conversationId)

      let reply = result.reply
      if (result.status === "unavailable") reply = t("unavailable")
      if (result.status === "error" || !reply) reply = t("error")

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: reply,
        },
      ])
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: t("error"),
        },
      ])
    } finally {
      setPending(false)
    }
  }

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      void handleSubmit()
    }
  }

  return (
    <div className="relative flex flex-col items-end gap-3">
      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          className="flex w-[min(calc(100vw-2rem),22rem)] flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-md"
        >
          <div className="flex items-start justify-between gap-3 border-b border-ink/10 bg-surface px-4 py-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-orange text-white">
                <LogoMark
                  className="size-5 logo-mark logo-mark--live"
                  idPrefix="ai-panel"
                />
              </span>
              <div className="min-w-0">
                <p
                  id={titleId}
                  className="font-label text-sm font-semibold tracking-tight text-ink"
                >
                  {t("title")}
                </p>
                <p className="mt-0.5 text-xs text-ink-muted">{t("subtitle")}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label={t("close")}
              className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-ink-muted transition hover:bg-ink/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
            >
              <CloseIcon />
            </button>
          </div>

          <div
            ref={listRef}
            className="flex max-h-[min(52dvh,22rem)] min-h-[14rem] flex-col gap-3 overflow-y-auto bg-white px-3.5 py-4"
          >
            {messages.map((message) => {
              const isUser = message.role === "user"
              return (
                <div
                  key={message.id}
                  className={cn("flex", isUser ? "justify-end" : "justify-start")}
                >
                  <p
                    className={cn(
                      "max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      isUser
                        ? "rounded-ee-md bg-ink text-white"
                        : "rounded-es-md bg-surface text-ink ring-1 ring-ink/8",
                    )}
                  >
                    {message.content}
                  </p>
                </div>
              )
            })}
            {pending ? (
              <div className="flex justify-start">
                <p
                  className="rounded-2xl rounded-es-md bg-surface px-3.5 py-2.5 text-sm text-ink-muted ring-1 ring-ink/8"
                  aria-live="polite"
                >
                  {t("thinking")}
                </p>
              </div>
            ) : null}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-ink/10 bg-white p-3"
          >
            <label htmlFor={`${panelId}-input`} className="sr-only">
              {t("placeholder")}
            </label>
            <div className="flex items-end gap-2">
              <textarea
                id={`${panelId}-input`}
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={t("placeholder")}
                disabled={pending}
                className="max-h-28 min-h-[2.75rem] flex-1 resize-none rounded-full bg-surface px-4 py-2.5 text-base text-ink outline-none ring-1 ring-ink/10 placeholder:text-ink/40 focus-visible:ring-2 focus-visible:ring-orange disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={pending || !input.trim()}
                aria-label={t("send")}
                className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-orange text-white transition hover:bg-orange-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className={locale === "ar" ? "-scale-x-100" : undefined}>
                  <SendIcon />
                </span>
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? t("close") : t("open")}
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={handleToggleKeyDown}
        className={cn(
          "inline-flex size-12 cursor-pointer items-center justify-center rounded-full text-white shadow-md transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2",
          open ? "bg-ink hover:bg-ink/90" : "bg-orange hover:bg-orange-soft",
        )}
      >
        {open ? (
          <CloseIcon />
        ) : (
          <LogoMark
            className="size-5 logo-mark logo-mark--live"
            idPrefix="ai-fab"
          />
        )}
      </button>
    </div>
  )
}
