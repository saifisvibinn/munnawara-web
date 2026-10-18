"use client"

import { ChatWidget } from "@/components/chat/ChatWidget"
import { WhatsAppButton } from "@/components/layout/WhatsAppButton"

/**
 * Chat + WhatsApp stay pinned to the viewport bottom. They do not lift or
 * hide when the footer enters — only the quote pill is end-of-page gated.
 */
export const FloatingActions = () => (
  <div
    data-floating-actions
    className="fixed end-4 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 flex flex-row items-center sm:end-6 sm:bottom-6"
  >
    <ChatWidget revealed />
    <WhatsAppButton />
  </div>
)
