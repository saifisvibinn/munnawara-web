"use client"

import { AiAssistant } from "@/components/ai/AiAssistant"
import { WhatsAppButton } from "@/components/layout/WhatsAppButton"

export const FloatingActions = () => {
  return (
    <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] end-4 z-40 flex flex-col-reverse items-end gap-3 sm:end-6 sm:bottom-6">
      <WhatsAppButton />
      <AiAssistant />
    </div>
  )
}
