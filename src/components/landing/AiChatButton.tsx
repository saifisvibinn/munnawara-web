"use client"

import { AiAssistant } from "@/components/ai/AiAssistant"
import { cn } from "@/lib/cn"
import { forwardRef } from "react"
import { LogoMark } from "./LogoMark"

type AiChatButtonProps = {
  chatAria: string
  className?: string
  /** Landing intro starts hidden; site chrome is visible immediately. */
  revealed?: boolean
}

/** Floating Chat-with-AI control — opens the assistant panel. */
export const AiChatButton = forwardRef<HTMLButtonElement, AiChatButtonProps>(
  function AiChatButton({ chatAria, className, revealed = false }, ref) {
    return (
      <AiAssistant
        className={cn("ai-assistant-root", className)}
        triggerRef={ref}
        triggerClassName={cn("ai-chat-btn", revealed && "is-revealed")}
        triggerAriaLabel={chatAria}
        swapTriggerWhenOpen={false}
        triggerContent={
          <LogoMark
            className="ai-chat-btn__icon logo-mark logo-mark--live"
            idPrefix="ai-chat"
          />
        }
      />
    )
  },
)
