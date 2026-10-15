import { cn } from "@/lib/cn"
import {
  DURRI_MOOD_SRC,
  type DurriMood,
} from "@/components/chat/durriMoods"

type RobotAvatarProps = {
  className?: string
  /** Face crop — idle for chrome, think while Durra AI is working. */
  mood?: DurriMood
}

/** Circular Durra AI face for the chat panel header and assistant bubbles. */
export const RobotAvatar = ({
  className,
  mood = "idle",
}: RobotAvatarProps) => (
  <span className={cn("durri-avatar", className)} aria-hidden>
    {/* eslint-disable-next-line @next/next/no-img-element -- tiny fixed avatar */}
    <img
      src={DURRI_MOOD_SRC[mood]}
      alt=""
      width={48}
      height={48}
      className="durri-avatar__photo"
      decoding="async"
    />
  </span>
)
