import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/cn"
import type { ReactNode } from "react"

type TextLinkProps = {
  href: string
  children: ReactNode
  className?: string
  tone?: "light" | "dark"
  back?: boolean
}

export const TextLink = ({
  href,
  children,
  className,
  tone = "dark",
  back = false,
}: TextLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "font-label inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange",
        tone === "dark" ? "text-blue" : "text-white/85 hover:text-white",
        className,
      )}
    >
      {back ? (
        <span aria-hidden className="inline-block rtl:-scale-x-100">‹</span>
      ) : null}
      {children}
      {back ? null : (
        <span aria-hidden className="inline-block rtl:-scale-x-100">›</span>
      )}
    </Link>
  )
}
