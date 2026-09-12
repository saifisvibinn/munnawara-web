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
        "mx-auto max-w-4xl px-6",
        align === "center" && "text-center",
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
          "font-display text-[40px] leading-[1.05] font-semibold tracking-tight md:text-6xl lg:text-7xl",
          tone === "dark" ? "text-ink" : "text-white",
        )}
      >
        {title}
      </h1>
      {subtitle ? (
        <p
          className={cn(
            "mx-auto mt-5 max-w-2xl text-lg leading-relaxed md:text-xl",
            align === "start" && "mx-0",
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
