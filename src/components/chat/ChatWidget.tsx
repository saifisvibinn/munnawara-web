"use client"

import { AiChatButton } from "@/components/chat/AiChatButton"
import { ChatPanel } from "@/components/chat/ChatPanel"
import {
  IDLE_HINTS,
  fabMood,
  resolveContextHint,
  type DurriHintKey,
} from "@/components/chat/durriMoods"
import { cn } from "@/lib/cn"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { usePathname } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type Ref,
} from "react"

const assignRef = <T,>(ref: Ref<T> | undefined, value: T | null) => {
  if (!ref) return
  if (typeof ref === "function") {
    ref(value)
    return
  }
  ;(ref as { current: T | null }).current = value
}

type ChatWidgetProps = {
  className?: string
  /** Landing intro starts hidden until GSAP reveals the button. */
  revealed?: boolean
}

const tipCopy = (
  t: ReturnType<typeof useTranslations<"chat">>,
  key: DurriHintKey,
) => {
  switch (key) {
    case "idle1":
      return t("hintIdle1")
    case "idle2":
      return t("hintIdle2")
    case "idle3":
      return t("hintIdle3")
    case "fleet":
      return t("hintFleet")
    case "contact":
      return t("hintContact")
    case "quote":
      return t("hintQuote")
    case "about":
      return t("hintAbout")
    case "companies":
      return t("hintCompanies")
  }
}

const pageDefaultHint = (pathname: string): DurriHintKey | null => {
  if (pathname.startsWith("/fleet")) return "fleet"
  if (pathname.startsWith("/contact")) return "contact"
  if (pathname.startsWith("/quote")) return "quote"
  if (pathname.startsWith("/about")) return "about"
  if (pathname.startsWith("/companies") || pathname.startsWith("/corporate")) {
    return "companies"
  }
  return null
}

/** FAB + backend-connected chat panel with unread badge and contextual tips. */
export const ChatWidget = forwardRef<HTMLButtonElement, ChatWidgetProps>(
  function ChatWidget({ className, revealed = true }, ref) {
    const t = useTranslations("chat")
    const pathname = usePathname()
    const reduced = useReducedMotion()
    const [open, setOpen] = useState(false)
    const [unread, setUnread] = useState(0)
    const [idleIndex, setIdleIndex] = useState(0)
    const [contextHint, setContextHint] = useState<DurriHintKey | null>(null)
    const [hoveringFab, setHoveringFab] = useState(false)
    const [tipReady, setTipReady] = useState(false)
    // Landing starts with revealed=false; GSAP adds is-revealed. Latch it so a
    // React re-render (opening the panel) does not wipe the class and hide the FAB.
    const [fabRevealed, setFabRevealed] = useState(revealed)
    const buttonNodeRef = useRef<HTMLButtonElement | null>(null)
    const contextTimer = useRef<number | null>(null)

    const handleUnread = useCallback((n: number) => {
      setUnread(n)
    }, [])

    useEffect(() => {
      if (revealed) setFabRevealed(true)
    }, [revealed])

    useEffect(() => {
      if (fabRevealed) return
      const node = buttonNodeRef.current
      if (!node) return
      if (node.classList.contains("is-revealed")) {
        setFabRevealed(true)
        return
      }
      const observer = new MutationObserver(() => {
        if (node.classList.contains("is-revealed")) {
          setFabRevealed(true)
          observer.disconnect()
        }
      })
      observer.observe(node, { attributes: true, attributeFilter: ["class"] })
      return () => observer.disconnect()
    }, [fabRevealed])

    const setButtonRef = useCallback(
      (node: HTMLButtonElement | null) => {
        buttonNodeRef.current = node
        assignRef(ref, node)
      },
      [ref],
    )

    // Soft-enter tip only after the FAB is revealed — never during landing loader.
    useEffect(() => {
      setTipReady(false)
      setContextHint(null)
      setIdleIndex(0)
      if (!fabRevealed) return
      const id = window.setTimeout(() => setTipReady(true), 650)
      return () => window.clearTimeout(id)
    }, [pathname, fabRevealed])

    const rotationHints = useMemo(() => {
      const page = pageDefaultHint(pathname)
      return page ? ([page, ...IDLE_HINTS] as DurriHintKey[]) : IDLE_HINTS
    }, [pathname])

    useEffect(() => {
      if (open || reduced || contextHint || hoveringFab) return
      const id = window.setInterval(() => {
        setIdleIndex((i) => (i + 1) % rotationHints.length)
      }, 5600)
      return () => window.clearInterval(id)
    }, [open, reduced, contextHint, hoveringFab, rotationHints.length])

    useEffect(() => {
      const clearContextTimer = () => {
        if (contextTimer.current !== null) {
          window.clearTimeout(contextTimer.current)
          contextTimer.current = null
        }
      }

      const onOver = (event: Event) => {
        const hint = resolveContextHint(event.target)
        if (!hint) return
        clearContextTimer()
        contextTimer.current = window.setTimeout(() => {
          setContextHint(hint)
          contextTimer.current = null
        }, 140)
      }

      const onOut = (event: Event) => {
        const pointer = event as PointerEvent
        const leaving = resolveContextHint(pointer.target)
        if (!leaving) return
        const next =
          pointer.relatedTarget instanceof Element
            ? resolveContextHint(pointer.relatedTarget)
            : null
        clearContextTimer()
        if (next) {
          setContextHint(next)
          return
        }
        contextTimer.current = window.setTimeout(() => {
          setContextHint(null)
          contextTimer.current = null
        }, 180)
      }

      document.addEventListener("pointerover", onOver, true)
      document.addEventListener("pointerout", onOut, true)
      return () => {
        clearContextTimer()
        document.removeEventListener("pointerover", onOver, true)
        document.removeEventListener("pointerout", onOut, true)
      }
    }, [])

    const tipKey: DurriHintKey | null = open
      ? null
      : (contextHint ??
        rotationHints[idleIndex % rotationHints.length] ??
        null)

    const tip =
      fabRevealed && tipReady && !open
        ? hoveringFab
          ? t("hintHello")
          : tipKey
            ? tipCopy(t, tipKey)
            : null
        : null

    const mood = fabMood({ open, hoveringFab })

    const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      setOpen((value) => {
        const next = !value
        if (next) setUnread(0)
        return next
      })
    }

    return (
      <>
        <AiChatButton
          ref={setButtonRef}
          className={cn(
            open && "is-open",
            fabRevealed && "is-revealed",
            contextHint && "is-context",
            className,
          )}
          aria-expanded={open}
          unread={open ? 0 : unread}
          tip={tip}
          mood={mood}
          onClick={handleClick}
          onPointerEnter={() => setHoveringFab(true)}
          onPointerLeave={() => setHoveringFab(false)}
        />
        <ChatPanel
          open={open}
          onClose={() => setOpen(false)}
          onUnreadChange={handleUnread}
        />
      </>
    )
  },
)
