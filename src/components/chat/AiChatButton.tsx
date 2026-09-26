"use client"

import { LogoMark } from "@/components/landing/LogoMark"
import { cn } from "@/lib/cn"
import { useTranslations } from "next-intl"
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
} from "react"

type AiChatLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  unread?: number
}

type AiChatButtonOnlyProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined
  unread?: number
}

type AiChatButtonProps = AiChatLinkProps | AiChatButtonOnlyProps

/** Floating “chat with AI” control — dam-frontend branded mark. */
export const AiChatButton = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  AiChatButtonProps
>(function AiChatButton(props, ref) {
  const t = useTranslations("chat")
  const unread = props.unread ?? 0
  const badge =
    unread > 0 ? (
      <span className="ai-chat-btn__badge" aria-label={`${unread} unread`}>
        {unread > 9 ? "9+" : unread}
      </span>
    ) : null

  const content = (
    <>
      {badge}
      <div className="ai-chat-btn__mark">
        <LogoMark
          className="ai-chat-btn__icon logo-mark logo-mark--live"
          idPrefix="ai-chat"
        />
        <span className="ai-chat-btn__brand">{t("brand")}</span>
      </div>
      <div className="ai-chat-btn__text">
        <span>{t("chatWith")}</span>
        <span>{t("chatAi")}</span>
      </div>
    </>
  )

  if ("href" in props && props.href) {
    const { href, className = "", unread: _u, ...rest } = props
    return (
      <a
        className={cn("ai-chat-btn", className)}
        href={href}
        ref={ref as React.Ref<HTMLAnchorElement>}
        aria-label={t("open")}
        {...rest}
      >
        {content}
      </a>
    )
  }

  const { className = "", unread: _u, ...rest } = props as AiChatButtonOnlyProps
  return (
    <button
      className={cn("ai-chat-btn", className)}
      type="button"
      ref={ref as React.Ref<HTMLButtonElement>}
      aria-label={t("open")}
      {...rest}
    >
      {content}
    </button>
  )
})
