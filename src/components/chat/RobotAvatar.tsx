import { useId } from "react"

/** Friendly robot mark for the Durri assistant — uses the brand petal palette. */
export function RobotAvatar({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "")
  const body = `robot-body-${uid}`
  const visor = `robot-visor-${uid}`

  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={body} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6b445" />
          <stop offset="1" stopColor="#e8702a" />
        </linearGradient>
        <linearGradient id={visor} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2350" />
          <stop offset="1" stopColor="#4a3a8c" />
        </linearGradient>
      </defs>
      {/* antenna */}
      <line x1="24" y1="4" x2="24" y2="10" stroke="#4a3a8c" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="4" r="2.6" fill="#2d8ad6" />
      {/* ears */}
      <rect x="3" y="21" width="5" height="10" rx="2.5" fill="#2d8ad6" />
      <rect x="40" y="21" width="5" height="10" rx="2.5" fill="#2d8ad6" />
      {/* head */}
      <rect x="7" y="10" width="34" height="30" rx="11" fill={`url(#${body})`} />
      {/* visor */}
      <rect x="12" y="17" width="24" height="15" rx="7.5" fill={`url(#${visor})`} />
      {/* eyes */}
      <circle cx="19" cy="24" r="2.8" fill="#bfe6ff" />
      <circle cx="29" cy="24" r="2.8" fill="#bfe6ff" />
      {/* smile */}
      <path
        d="M19.5 29c1.4 1.2 3 1.8 4.5 1.8s3.1-.6 4.5-1.8"
        fill="none"
        stroke="#bfe6ff"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}
