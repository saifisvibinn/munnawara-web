"use client"

import { useReducedMotion } from "@/hooks/useReducedMotion"
import { motion, type Variants } from "motion/react"
import type { ReactNode } from "react"

type Tag = "div" | "ul" | "li" | "article"

const MOTION = { div: motion.div, ul: motion.ul, li: motion.li, article: motion.article }

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

type Props = { as?: Tag; className?: string; children: ReactNode }

/** Reveals its `StaggerItem` children one after another when scrolled into view. */
export const Stagger = ({ as = "div", className, children }: Props) => {
  const reduced = useReducedMotion()
  if (reduced) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }
  const Component = MOTION[as]
  return (
    <Component
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: "some", margin: "0px 0px -10% 0px" }}
    >
      {children}
    </Component>
  )
}

export const StaggerItem = ({ as = "div", className, children }: Props) => {
  const reduced = useReducedMotion()
  if (reduced) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }
  const Component = MOTION[as]
  return (
    <Component className={className} variants={item}>
      {children}
    </Component>
  )
}
