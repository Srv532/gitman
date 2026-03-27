"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Spring configuration for the outer circle
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 }
  const cursorXSpring = useSpring(mouseX, springConfig)
  const cursorYSpring = useSpring(mouseY, springConfig)

  useEffect(() => {
    // Hide custom cursor on mobile touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return

    setIsVisible(true)

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Check if target has data-cursor="hover" or is a button/link
      if (
        target.closest('[data-cursor="hover"]') ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener("mousemove", moveCursor)
    window.addEventListener("mouseover", handleMouseOver)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      window.removeEventListener("mouseover", handleMouseOver)
    }
  }, [mouseX, mouseY])

  if (!isVisible) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {/* Small dot */}
      <motion.div
        className="absolute h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.4)]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      {/* Outer morphing ring */}
      <motion.div
        className="absolute h-8 w-8 rounded-full border border-white/40"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          borderColor: isHovering ? "rgba(57, 211, 83, 0.8)" : "rgba(255, 255, 255, 0.4)",
          backgroundColor: isHovering ? "rgba(57, 211, 83, 0.1)" : "transparent",
        }}
        transition={{ duration: 0.2 }}
      />
    </div>
  )
}
