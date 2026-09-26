"use client"

import { AiChatButton } from "@/components/chat/AiChatButton"
import { ChatPanel } from "@/components/chat/ChatPanel"
import { cn } from "@/lib/cn"
import { forwardRef, useCallback, useState } from "react"

type ChatWidgetProps = {
  className?: string
  /** Landing intro starts hidden until GSAP reveals the button. */
  revealed?: boolean
}

/** FAB + backend-connected chat panel with unread badge. */
export const ChatWidget = forwardRef<HTMLButtonElement, ChatWidgetProps>(
  function ChatWidget({ className, revealed = true }, ref) {
    const [open, setOpen] = useState(false)
    const [unread, setUnread] = useState(0)

    const handleUnread = useCallback((n: number) => {
      setUnread(n)
    }, [])

    return (
      <>
        <AiChatButton
          ref={ref}
          className={cn(
            open && "is-open",
            revealed && "is-revealed",
            className,
          )}
          aria-expanded={open}
          unread={open ? 0 : unread}
          onClick={() => {
            setOpen((value) => {
              const next = !value
              if (next) setUnread(0)
              return next
            })
          }}
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
