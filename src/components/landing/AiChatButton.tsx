"use client"

import { Link } from "@/i18n/navigation"
import { forwardRef } from "react"
import { LogoMark } from "./LogoMark"

type AiChatButtonProps = {
  href?: string
  chatAria: string
}

/** Floating Chat-with-AI control — squircle + brand flower mark. */
export const AiChatButton = forwardRef<HTMLAnchorElement, AiChatButtonProps>(
  function AiChatButton({ href = "/contact", chatAria }, ref) {
    return (
      <Link
        className="ai-chat-btn"
        href={href}
        ref={ref}
        aria-label={chatAria}
        tabIndex={0}
      >
        <LogoMark
          className="ai-chat-btn__icon logo-mark logo-mark--live"
          idPrefix="ai-chat"
        />
      </Link>
    )
  },
)
