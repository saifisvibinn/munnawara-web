/** Apple WWDC fluid-interface helpers — projection + springs. */

/** Exponential decay projection (Designing Fluid Interfaces sample). */
export const project = (
  initialVelocity: number,
  decelerationRate = 0.998,
): number =>
  (initialVelocity / 1000) * decelerationRate / (1 - decelerationRate)

/** Progressive resistance past a bound. */
export const rubberband = (
  overshoot: number,
  dimension: number,
  constant = 0.55,
): number =>
  (overshoot * dimension * constant) /
  (dimension + constant * Math.abs(overshoot))

/** Critically damped UI spring (Apple damping 1.0 ≈ bounce 0). */
export const SPRING_UI = {
  type: "spring" as const,
  bounce: 0,
  duration: 0.4,
}

/** Slight bounce only after a flick / momentum gesture. */
export const SPRING_FLICK = {
  type: "spring" as const,
  bounce: 0.2,
  duration: 0.35,
}

export const SPRING_SHEET = {
  type: "spring" as const,
  bounce: 0,
  duration: 0.38,
}
