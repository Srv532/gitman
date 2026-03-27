"use client"

import { useEffect, useState } from "react"
import { motion, useSpring, useTransform } from "framer-motion"

export function AnimatedCounter({ value, duration = 1.2 }: { value: number, duration?: number }) {
  const [hasAnimated, setHasAnimated] = useState(false)
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 })
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString())

  useEffect(() => {
    spring.set(value)
    setHasAnimated(true)
  }, [value, spring])

  return <motion.span>{display}</motion.span>
}
