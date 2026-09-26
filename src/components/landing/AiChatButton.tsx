"use client"

import { AiAssistant } from "@/components/ai/AiAssistant"
import { forwardRef } from "react"
import { LogoMark } from "./LogoMark"

type AiChatButtonProps = {
  chatAria: string
}

/** Floating Chat-with-AI control — opens the assistant panel (landing fab). */
export const AiChatButton = forwardRef<HTMLButtonElement, AiChatButtonProps>(
  function AiChatButton({ chatAria }, ref) {
    return (
      <AiAssistant
        className="landing-ai-assistant"
        triggerRef={ref}
        triggerClassName="ai-chat-btn"
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
