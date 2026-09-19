import { cn } from "@/lib/cn"
import type { ComponentType } from "react"

const iconClass = "size-[1.15rem]"

export const TwitterIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={cn(iconClass, className)}
    aria-hidden
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.851L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
)

export const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={cn(iconClass, className)}
    aria-hidden
  >
    <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.4V9.84c0-2.37 1.4-3.68 3.55-3.68 1.03 0 2.11.18 2.11.18v2.33h-1.19c-1.17 0-1.54.73-1.54 1.48v1.78h2.62l-.42 2.91h-2.2V22c4.78-.75 8.44-4.91 8.44-9.93z" />
  </svg>
)

export const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={cn(iconClass, className)}
    aria-hidden
  >
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="5"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
  </svg>
)

export const SnapchatIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={cn(iconClass, className)}
    aria-hidden
  >
    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z" />
  </svg>
)

export type SocialLinks = {
  handle: string
  twitter?: string
  facebook?: string
  instagram?: string
  snapchat?: string
}

type SocialLinksRowProps = {
  links: SocialLinks
  twitterLabel: string
  facebookLabel: string
  instagramLabel: string
  snapchatLabel: string
  className?: string
}

export const SocialLinksRow = ({
  links,
  twitterLabel,
  facebookLabel,
  instagramLabel,
  snapchatLabel,
  className,
}: SocialLinksRowProps) => {
  const platforms = [
    links.twitter
      ? { id: "twitter", href: links.twitter, label: twitterLabel, Icon: TwitterIcon }
      : null,
    links.facebook
      ? {
          id: "facebook",
          href: links.facebook,
          label: facebookLabel,
          Icon: FacebookIcon,
        }
      : null,
    links.instagram
      ? {
          id: "instagram",
          href: links.instagram,
          label: instagramLabel,
          Icon: InstagramIcon,
        }
      : null,
    links.snapchat
      ? {
          id: "snapchat",
          href: links.snapchat,
          label: snapchatLabel,
          Icon: SnapchatIcon,
        }
      : null,
  ].filter(Boolean) as {
    id: string
    href: string
    label: string
    Icon: ComponentType<{ className?: string }>
  }[]

  if (platforms.length === 0) return null

  return (
    <ul className={cn("flex items-center gap-1", className)}>
      {platforms.map(({ id, href, label, Icon }) => (
        <li key={id}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label} ${links.handle}`}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full text-ink/55 transition hover:bg-surface-muted hover:text-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
          >
            <Icon />
          </a>
        </li>
      ))}
    </ul>
  )
}
