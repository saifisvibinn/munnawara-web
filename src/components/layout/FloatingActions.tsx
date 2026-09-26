"use client"

import { AiChatButton } from "@/components/landing/AiChatButton"
import { WhatsAppButton } from "@/components/layout/WhatsAppButton"
import { useTranslations } from "next-intl"

export const FloatingActions = () => {
  const t = useTranslations("aiAssistant")

  return (
    <div
      data-floating-actions
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] end-4 z-40 flex flex-row items-end gap-3 sm:end-6 sm:bottom-6"
    >
      <AiChatButton revealed chatAria={t("open")} />
      <WhatsAppButton />
    </div>
  )
}
