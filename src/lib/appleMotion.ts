/** Apple WWDC fluid-interface helpers — projection + springs. */

/** Exponential decay projection (Designing Fluid Interfaces sample). */
export const project = (
  initialVelocity: number,
  decelerationRate = 0.998,
): number =>
  (initialVelocity / 1000) * decelerationRate / (1 - decelerationRate)


export const SPRING_SHEET = {
  type: "spring" as const,
  bounce: 0,
  duration: 0.38,
}
