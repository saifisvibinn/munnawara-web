"use client"

import { RobotAvatar } from "./RobotAvatar"
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
  const { unread: unreadProp, ...domProps } = props
  const unread = unreadProp ?? 0
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
        <RobotAvatar className="ai-chat-btn__icon" />
      </div>
      <div className="ai-chat-btn__text">
        <span>{t("chatWith")}</span>
        <span>{t("chatAi")}</span>
      </div>
    </>
  )

  if ("href" in domProps && domProps.href) {
    const { href, className = "", ...rest } = domProps
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

  const { className = "", ...rest } = domProps as Omit<
    AiChatButtonOnlyProps,
    "unread"
  >
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
