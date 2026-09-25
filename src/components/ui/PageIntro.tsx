import { cn } from "@/lib/cn"
import type { ReactNode } from "react"

type PageIntroProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: "center" | "start"
  tone?: "dark" | "light"
  children?: ReactNode
  className?: string
}

export const PageIntro = ({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "dark",
  children,
  className,
}: PageIntroProps) => {
  return (
    <div
      className={cn(
        "mx-auto max-w-4xl px-4 sm:px-6",
        align === "center" && "text-center",
        align === "start" && "text-start",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 text-sm font-medium tracking-wide",
            tone === "dark" ? "text-ink-muted" : "text-white/60",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h1
        className={cn(
          "font-display text-[clamp(1.85rem,7vw,2.5rem)] leading-[1.15] font-semibold tracking-tight sm:text-[40px] sm:leading-[1.05] md:text-6xl lg:text-7xl",
          tone === "dark" ? "text-ink" : "text-white",
        )}
      >
        {title}
      </h1>
      {subtitle ? (
        <p
          className={cn(
            "mt-5 max-w-2xl text-base leading-relaxed sm:text-lg md:text-xl",
            align === "center" && "mx-auto",
            align === "start" && "ms-0 me-auto",
            tone === "dark" ? "text-ink-muted" : "text-white/70",
          )}
        >
          {subtitle}
        </p>
      ) : null}
      {children}
    </div>
  )
}
