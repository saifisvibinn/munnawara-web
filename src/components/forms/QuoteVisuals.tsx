"use client"

import { useId } from "react"

/** Slowly revolving globe — shown on the opening steps. (The route map lives in QuoteMap.tsx.) */
export function GlobeVisual({ className }: { className?: string }) {
  const clip = `globe-${useId().replace(/:/g, "")}`
  const meridians = [0, -1.6, -3.2]
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={clip}>
          <circle cx="50" cy="50" r="40" />
        </clipPath>
        <radialGradient id={`${clip}-fill`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#d7ecfb" />
          <stop offset="1" stopColor="#7ab8e8" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill={`url(#${clip}-fill)`} />
      <g
        clipPath={`url(#${clip})`}
        fill="none"
        stroke="#2d6aa8"
        strokeWidth="0.9"
        opacity="0.55"
      >
        <ellipse cx="50" cy="50" rx="40" ry="14" />
        <line x1="10" y1="50" x2="90" y2="50" />
        <ellipse cx="50" cy="30" rx="30" ry="9" />
        <ellipse cx="50" cy="70" rx="30" ry="9" />
        {meridians.map((begin) => (
          <ellipse key={begin} cx="50" cy="50" rx="40" ry="40">
            <animate
              attributeName="rx"
              values="40;0;40"
              dur="6s"
              begin={`${begin}s`}
              repeatCount="indefinite"
            />
          </ellipse>
        ))}
      </g>
      <circle cx="50" cy="50" r="40" fill="none" stroke="#2d6aa8" strokeWidth="1.2" />
      <circle cx="50" cy="50" r="46" fill="none" stroke="#e8702a" strokeWidth="0.8" strokeDasharray="2 5" opacity="0.7">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="18s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  )
}
