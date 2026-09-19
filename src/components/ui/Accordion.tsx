"use client"

import { cn } from "@/lib/cn"
import { useId, useState, type KeyboardEvent } from "react"

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

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, id: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleToggle(id)
    }
  }

  return (
    <div className={cn("divide-y divide-ink/10", className)}>
      {items.map((item) => {
        const isOpen = openId === item.id
        const panelId = `${baseId}-${item.id}-panel`
        const buttonId = `${baseId}-${item.id}-button`

        return (
          <div key={item.id} className="py-1">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                tabIndex={0}
                className="flex w-full items-center justify-between gap-4 py-5 text-start text-base font-medium break-words text-ink transition hover:text-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange sm:py-6 sm:text-lg"
                onClick={() => handleToggle(item.id)}
                onKeyDown={(event) => handleKeyDown(event, item.id)}
              >
                <span>{item.title}</span>
                <span
                  aria-hidden
                  className={cn(
                    "font-label flex size-8 shrink-0 items-center justify-center rounded-full border border-ink/10 text-lg leading-none text-ink/55 transition",
                    isOpen && "border-orange/40 text-orange",
                  )}
                >
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="pb-6 text-base leading-relaxed text-ink/55">
                  {item.content}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
