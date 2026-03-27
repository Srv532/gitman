"use client"

import { useRef, useState } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"

export function MagneticButton({ children, className }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    
    // Calculate distance from center
    const xDist = (clientX - (left + width / 2)) * 0.3
    const yDist = (clientY - (top + height / 2)) * 0.3
    
    mouseX.set(xDist)
    mouseY.set(yDist)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{ x: isHovered ? mouseX.get() : 0, y: isHovered ? mouseY.get() : 0 }}
      style={{ x, y }}
    >
      {children}
    </motion.div>
  )
}
