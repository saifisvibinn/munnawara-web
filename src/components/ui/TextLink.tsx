import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/cn"
import type { ReactNode } from "react"

type TextLinkProps = {
  href: string
  children: ReactNode
  className?: string
  tone?: "light" | "dark"
}

export const TextLink = ({
  href,
  children,
  className,
  tone = "dark",
}: TextLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "font-label inline-flex items-center gap-1 text-[15px] font-semibold transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange",
        tone === "dark" ? "text-blue" : "text-blue-soft",
        className,
      )}
    >
      {children}
      <span aria-hidden>›</span>
    </Link>
  )
}
