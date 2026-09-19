"use client"

import {
  FacebookIcon,
  InstagramIcon,
  SnapchatIcon,
  TwitterIcon,
  type SocialLinks,
} from "@/components/ui/SocialLinks"
import { cn } from "@/lib/cn"
import { useTranslations } from "next-intl"
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentType,
  type KeyboardEvent,
} from "react"

type SocialFollowButtonProps = {
  label: string
  links: SocialLinks
  tone?: "light" | "dark"
  className?: string
}

export const SocialFollowButton = ({
  label,
  links,
  tone = "light",
  className,
}: SocialFollowButtonProps) => {
  const t = useTranslations("common")
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  const platforms = [
    links.twitter
      ? { id: "twitter", href: links.twitter, label: t("socialTwitter"), Icon: TwitterIcon }
      : null,
    links.facebook
      ? {
          id: "facebook",
          href: links.facebook,
          label: t("socialFacebook"),
          Icon: FacebookIcon,
        }
      : null,
    links.instagram
      ? {
          id: "instagram",
          href: links.instagram,
          label: t("socialInstagram"),
          Icon: InstagramIcon,
        }
      : null,
    links.snapchat
      ? {
          id: "snapchat",
          href: links.snapchat,
          label: t("socialSnapchat"),
          Icon: SnapchatIcon,
        }
      : null,
  ].filter(Boolean) as {
    id: string
    href: string
    label: string
    Icon: ComponentType<{ className?: string }>
  }[]

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    window.addEventListener("pointerdown", handlePointerDown)
    window.addEventListener("keydown", handleKey)
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("keydown", handleKey)
    }
  }, [open])

  if (platforms.length === 0) return null

  const isLight = tone === "light"

  const handleToggleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      setOpen((current) => !current)
    }
  }

  const renderLabel = (text: string) => {
    const parts = text.split(/(@[A-Za-z0-9_]+)/g).filter(Boolean)
    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        return (
          <span key={`${part}-${index}`} dir="ltr">
            {part}
          </span>
        )
      }
      return <span key={`${part}-${index}`}>{part}</span>
    })
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        aria-label={`${t("followUs")}: ${links.handle}`}
        tabIndex={0}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleToggleKeyDown}
        className={cn(
          "font-label inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2",
          isLight
            ? "border border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10 focus-visible:ring-white"
            : "border border-ink/15 bg-transparent text-ink hover:border-orange hover:text-orange focus-visible:ring-orange",
        )}
      >
        <span className="inline-flex items-center gap-1.5">{renderLabel(label)}</span>
        <span aria-hidden className={cn("text-xs transition", open && "rotate-180")}>
          ▾
        </span>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={t("followUs")}
          className={cn(
            "absolute left-1/2 z-20 mt-3 flex -translate-x-1/2 items-center gap-2 rounded-full border px-2 py-2 shadow-lg backdrop-blur-md",
            isLight ? "border-white/20 bg-ink/80" : "border-ink/10 bg-white",
          )}
        >
          {platforms.map(({ id, href, label: platformLabel, Icon }) => (
            <a
              key={id}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              aria-label={`${platformLabel} ${links.handle}`}
              className={cn(
                "inline-flex size-10 cursor-pointer items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2",
                isLight
                  ? "text-white hover:bg-white/15 focus-visible:ring-white"
                  : "text-ink hover:bg-surface-muted focus-visible:ring-orange",
              )}
            >
              <Icon />
            </a>
          ))}
        </div>
      ) : null}
    </div>
  )
}
