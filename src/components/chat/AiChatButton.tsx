"use client"

import { cn } from "@/lib/cn"
import {
  DURRI_MOOD_SRC,
  type DurriMood,
} from "@/components/chat/durriMoods"
import { useLocale, useTranslations } from "next-intl"
import {
  forwardRef,
  useEffect,
  type ButtonHTMLAttributes,
} from "react"

type AiChatButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  unread?: number
  tip?: string | null
  mood?: DurriMood
}

const Face = ({ mood }: { mood: DurriMood }) => (
  <span className="ai-chat-btn__face" aria-hidden>
    {/* eslint-disable-next-line @next/next/no-img-element -- small fixed FAB asset */}
    <img
      key={mood}
      src={DURRI_MOOD_SRC[mood]}
      alt=""
      width={160}
      height={160}
      data-mood={mood}
      className="ai-chat-btn__photo"
      decoding="async"
    />
  </span>
)

/** Floating Durra AI FAB — expression sheet + tip bubble. */
export const AiChatButton = forwardRef<HTMLButtonElement, AiChatButtonProps>(
  function AiChatButton(
    { unread: unreadProp, tip, mood = "idle", className = "", ...rest },
    ref,
  ) {
    const t = useTranslations("chat")
    const locale = useLocale()
    const unread = unreadProp ?? 0

    useEffect(() => {
      const preload = ["idle", "wave", "think"] as const
      for (const key of preload) {
        const img = new window.Image()
        img.src = DURRI_MOOD_SRC[key]
      }
    }, [])

    const badge =
      unread > 0 ? (
        <span className="ai-chat-btn__badge" aria-label={`${unread} unread`}>
          {unread > 9 ? "9+" : unread}
        </span>
      ) : null

    // Tip sits outside the control so its visible text does not fight aria-label
    // (axe label-content-name-mismatch).
    const tipNode =
      tip && tip.length > 0 ? (
        <span
          key={tip}
          className="ai-chat-fab__tip"
          lang={locale}
          dir={locale === "ar" ? "rtl" : "ltr"}
          aria-live="polite"
        >
          {tip}
        </span>
      ) : null

    return (
      <span className={cn("ai-chat-fab", tip && "has-tip")}>
        {tipNode}
        <button
          className={cn("ai-chat-btn", className)}
          type="button"
          ref={ref}
          aria-label={t("open")}
          {...rest}
        >
          {badge}
          <Face mood={mood} />
        </button>
      </span>
    )
  },
)
