"use client"

import { pick, places, type PlaceId } from "./quoteWizardConfig"
import { useId } from "react"

/** Slowly revolving globe — shown on the opening steps. */
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

function Kaaba({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 6} ${y - 17})`}>
      <rect width="12" height="12" rx="1" fill="#1f1d1a" />
      <rect y="3.2" width="12" height="1.8" fill="#d9a441" />
    </g>
  )
}

/**
 * Route map of the Umrah corridor. `route` is the ordered list of places to
 * highlight; the bus drives along it and the Kaaba marks Makkah.
 */
export function RouteVisual({
  route,
  locale,
  showKaaba = true,
  className,
}: {
  route: readonly PlaceId[]
  locale: string
  showKaaba?: boolean
  className?: string
}) {
  const point = (id: PlaceId) => places.find((p) => p.id === id)!
  const roadPoints = places.map((p) => `${p.x},${p.y}`).join(" ")
  const hasRoute = route.length >= 2
  const routePath = route
    .map((id, i) => `${i === 0 ? "M" : "L"}${point(id).x},${point(id).y}`)
    .join(" ")
  const routeKey = route.join(">")

  return (
    <svg
      className={className}
      viewBox="0 0 200 100"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <polyline
        points={roadPoints}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {hasRoute ? (
        <path
          key={routeKey}
          d={routePath}
          fill="none"
          stroke="#e8702a"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4 4"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="16"
            to="0"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </path>
      ) : null}
      {places.map((p) => {
        const on = route.includes(p.id)
        return (
          <g key={p.id}>
            <circle
              cx={p.x}
              cy={p.y}
              r={on ? 4.2 : 3}
              fill={on ? "#e8702a" : "currentColor"}
              fillOpacity={on ? 1 : 0.3}
              stroke="#fff"
              strokeWidth="1.2"
            />
            <text
              x={p.x}
              y={p.y + 11}
              textAnchor="middle"
              fontSize="6.4"
              fill="currentColor"
              fillOpacity={on ? 0.9 : 0.5}
              fontWeight={on ? 700 : 500}
            >
              {pick(p.label, locale)}
            </text>
          </g>
        )
      })}
      {showKaaba ? <Kaaba x={point("makkah").x} y={point("makkah").y - 3} /> : null}
      {hasRoute ? (
        <g key={`bus-${routeKey}`}>
          <rect x="-6" y="-3.4" width="12" height="6.8" rx="2.2" fill="#2a2350" />
          <rect x="-4.4" y="-2.2" width="8.8" height="2.4" rx="0.8" fill="#bfe6ff" />
          <circle cx="-3" cy="3.4" r="1.2" fill="#1f1d1a" />
          <circle cx="3" cy="3.4" r="1.2" fill="#1f1d1a" />
          <animateMotion
            dur={`${Math.max(3, route.length * 1.8)}s`}
            repeatCount="indefinite"
            path={routePath}
            rotate="0"
          />
        </g>
      ) : null}
    </svg>
  )
}
