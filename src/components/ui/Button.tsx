import { cn } from "@/lib/cn"
import type { ButtonHTMLAttributes, ReactNode } from "react"

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "vip"
type ButtonSize = "sm" | "md" | "lg"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-orange text-white hover:bg-orange-soft focus-visible:ring-orange",
  vip: "bg-orange text-white hover:bg-orange-soft focus-visible:ring-orange",
  secondary:
    "border border-orange bg-surface-mint text-orange hover:bg-secondary-container focus-visible:ring-orange",
  ghost: "bg-transparent text-ink hover:bg-surface-muted focus-visible:ring-orange",
  outline:
    "border border-orange bg-transparent text-orange hover:bg-surface-mint focus-visible:ring-orange",
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-[15px]",
  lg: "px-6 py-3 text-[17px]",
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={cn(
        "font-label inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
