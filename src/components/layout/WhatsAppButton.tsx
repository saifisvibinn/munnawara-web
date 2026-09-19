"use client"

import { getSiteConfig } from "@/content"
import { useTranslations } from "next-intl"

export const WhatsAppButton = () => {
  const t = useTranslations()
  const config = getSiteConfig()
  const text = encodeURIComponent(t("whatsappPrefill"))
  const href = `https://wa.me/${config.whatsappNumber}?text=${text}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("common.whatsapp")}
      tabIndex={0}
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] end-4 z-40 inline-flex size-12 items-center justify-center rounded-full bg-whatsapp text-white shadow-md transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp focus-visible:ring-offset-2 sm:end-6 sm:bottom-6"
      data-whatsapp-fab
    >
      <svg aria-hidden viewBox="0 0 24 24" className="size-5 fill-current">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.12c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24s8.24 3.7 8.24 8.24-3.69 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.7-.8-.23-.09-.39-.12-.56.12-.16.25-.64.8-.79.96-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74 1.48.64 1.89.7 2.56.59.48-.08 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.17-.48-.29z" />
      </svg>
    </a>
  )
}
