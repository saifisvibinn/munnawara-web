"use client"

import { cn } from "@/lib/cn"
import { useEffect, useId, useRef, type ReactNode } from "react"

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}

export const Modal = ({
  open,
  onClose,
  title,
  children,
  className,
}: ModalProps) => {
  const titleId = useId()
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
    }
    if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  if (!open) return null

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className={cn(
        "fixed inset-0 z-50 m-auto w-[min(92vw,32rem)] rounded-lg bg-white p-0 text-ink shadow-md open:flex open:flex-col",
        className,
      )}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose()
      }}
    >
      <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
        <h2 id={titleId} className="text-lg font-semibold text-wordmark">
          {title}
        </h2>
        <button
          type="button"
          aria-label="Close"
          className="rounded-md px-2 py-1 text-ink-muted hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <div className="px-5 py-4">{children}</div>
    </dialog>
  )
}
