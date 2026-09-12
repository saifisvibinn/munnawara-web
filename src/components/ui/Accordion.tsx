"use client"

import { cn } from "@/lib/cn"
import { useId, useState } from "react"

type AccordionItem = {
  id: string
  title: string
  content: string
}

type AccordionProps = {
  items: readonly AccordionItem[]
  className?: string
}

export const Accordion = ({ items, className }: AccordionProps) => {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null)
  const baseId = useId()

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id))
  }

  return (
    <div className={cn("divide-y divide-ink/10", className)}>
      {items.map((item) => {
        const isOpen = openId === item.id
        const panelId = `${baseId}-${item.id}-panel`
        const buttonId = `${baseId}-${item.id}-button`

        return (
          <div key={item.id}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-4 py-4 text-start text-base font-medium break-words text-ink transition hover:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange sm:py-5 sm:text-lg"
                onClick={() => handleToggle(item.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    handleToggle(item.id)
                  }
                }}
              >
                <span>{item.title}</span>
                <span
                  aria-hidden
                  className={`text-ink-muted transition ${isOpen ? "rotate-0" : ""}`}
                >
                  <span className={`inline-block transition ${isOpen ? "rotate-45" : ""}`}>
                    {isOpen ? "−" : "+"}
                  </span>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-6 text-base leading-relaxed text-ink-muted"
            >
              {item.content}
            </div>
          </div>
        )
      })}
    </div>
  )
}
