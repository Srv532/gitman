"use client"

import { motion } from "framer-motion"

// A fully CSS + SVG animated hero globe — no Three.js dependency
// Stunning glowing network sphere with orbiting rings, nodes, and code-commit particles
export default function HeroGlobe() {
  return (
    <div
      className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 hidden md:block select-none"
      style={{ width: 480, height: 480 }}
    >
      <svg
        viewBox="0 0 480 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 0 60px rgba(57,211,83,0.18)) drop-shadow(0 0 120px rgba(139,92,246,0.12))" }}
      >
        <defs>
          {/* Green glow */}
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#39d353" stopOpacity="0.18" />
            <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0d1117" stopOpacity="0" />
          </radialGradient>
          {/* Core pulse gradient */}
          <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#161b22" />
            <stop offset="70%" stopColor="#0d1117" />
            <stop offset="100%" stopColor="#0a0f14" />
          </radialGradient>
          <filter id="blur-sm">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <filter id="glow-green">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-purple">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background ambient glow */}
        <circle cx="240" cy="240" r="220" fill="url(#centerGlow)" />

        {/* ORBIT RINGS - rotating via CSS animation */}
        {/* Outer ring horizontal */}
        <motion.ellipse
          cx="240" cy="240" rx="195" ry="35"
          stroke="#39d353" strokeWidth="0.8" strokeOpacity="0.3" fill="none"
          style={{ transformOrigin: "240px 240px" }}
          animate={{ rotateX: [0, 360] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          filter="url(#glow-green)"
        />
        {/* Outer ring tilted 60deg */}
        <motion.ellipse
          cx="240" cy="240" rx="195" ry="65"
          stroke="#8b5cf6" strokeWidth="0.7" strokeOpacity="0.25" fill="none"
          style={{ transform: "rotate(-40deg)", transformOrigin: "240px 240px" }}
          animate={{ rotate: [-40, 320] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          filter="url(#glow-purple)"
        />
        {/* Inner ring tilted opposite */}
        <motion.ellipse
          cx="240" cy="240" rx="130" ry="40"
          stroke="#39d353" strokeWidth="0.6" strokeOpacity="0.4" fill="none"
          style={{ transform: "rotate(30deg)", transformOrigin: "240px 240px" }}
          animate={{ rotate: [30, -330] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Core sphere body */}
        <circle cx="240" cy="240" r="115" fill="url(#coreGrad)" />
        {/* Core sphere border with a green glow ring */}
        <circle cx="240" cy="240" r="115" stroke="#39d353" strokeWidth="1.5" strokeOpacity="0.5" fill="none" filter="url(#glow-green)" />

        {/* Core sphere internal latitude lines */}
        {[0.25, 0.5, 0.75].map((ratio, i) => {
          const ry = 115 * ratio
          return (
            <ellipse key={i} cx="240" cy="240" rx="115" ry={Math.min(ry, 112)} stroke="#39d353" strokeWidth="0.4" strokeOpacity="0.15" fill="none" />
          )
        })}

        {/* Vertical longitude line */}
        <line x1="240" y1="125" x2="240" y2="355" stroke="#39d353" strokeWidth="0.4" strokeOpacity="0.15" />
        <line x1="125" y1="240" x2="355" y2="240" stroke="#39d353" strokeWidth="0.4" strokeOpacity="0.15" />

        {/* Glowing nodes on the sphere at various positions */}
        {[
          { cx: 240, cy: 138, delay: 0 },      // top
          { cx: 340, cy: 200, delay: 0.5 },    // top-right
          { cx: 340, cy: 280, delay: 1 },      // bottom-right
          { cx: 240, cy: 342, delay: 1.5 },    // bottom
          { cx: 140, cy: 280, delay: 2 },      // bottom-left
          { cx: 140, cy: 200, delay: 2.5 },    // top-left
          { cx: 285, cy: 170, delay: 0.3 },    // upper right
          { cx: 195, cy: 310, delay: 0.8 },    // lower left
        ].map((n, i) => (
          <motion.circle
            key={i} cx={n.cx} cy={n.cy} r="4.5"
            fill="#39d353" opacity="0.9"
            filter="url(#glow-green)"
            animate={{ opacity: [0.5, 1, 0.5], r: [4, 6, 4] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: n.delay, ease: "easeInOut" }}
          />
        ))}

        {/* Purple secondary nodes */}
        {[
          { cx: 290, cy: 230 }, { cx: 190, cy: 250 }, { cx: 245, cy: 185 }, { cx: 235, cy: 295 }
        ].map((n, i) => (
          <motion.circle
            key={i} cx={n.cx} cy={n.cy} r="3"
            fill="#8b5cf6" opacity="0.8"
            filter="url(#glow-purple)"
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
          />
        ))}

        {/* Connection lines between nodes */}
        {[
          [240, 138, 340, 200], [340, 200, 340, 280], [340, 280, 240, 342],
          [240, 342, 140, 280], [140, 280, 140, 200], [140, 200, 240, 138],
          [240, 138, 240, 342], [140, 200, 340, 280],
          [240, 138, 285, 170], [340, 200, 285, 170],
          [140, 280, 195, 310], [240, 342, 195, 310],
        ].map(([x1, y1, x2, y2], i) => (
          <motion.line
            key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#39d353" strokeWidth="0.8" strokeOpacity="0.3"
            animate={{ strokeOpacity: [0.15, 0.45, 0.15] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
          />
        ))}

        {/* Floating ORBITING dot on outer ring */}
        <motion.circle
          cx="435" cy="240" r="6"
          fill="#39d353"
          filter="url(#glow-green)"
          style={{ transformOrigin: "240px 240px" }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle
          cx="45" cy="240" r="4"
          fill="#8b5cf6"
          filter="url(#glow-purple)"
          style={{ transformOrigin: "240px 240px" }}
          animate={{ rotate: [180, 540] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />

        {/* Subtle outer particle dots around the sphere */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          const r = 165
          const cx = 240 + r * Math.cos(rad)
          const cy = 240 + r * Math.sin(rad)
          return (
            <motion.circle
              key={i} cx={cx} cy={cy} r="1.5"
              fill="#39d353" opacity="0.4"
              animate={{ opacity: [0.2, 0.7, 0.2], scale: [1, 1.5, 1] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
            />
          )
        })}

        {/* Center icon — stylized git branch symbol */}
        <motion.g
          style={{ transformOrigin: "240px 240px" }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Vertical stem */}
          <rect x="236" y="218" width="8" height="44" rx="4" fill="#39d353" opacity="0.9" />
          {/* Top circle */}
          <circle cx="240" cy="215" r="8" fill="#39d353" opacity="0.9" />
          {/* Branch circle */}
          <circle cx="262" cy="230" r="7" fill="#8b5cf6" opacity="0.9" />
          {/* Branch curve */}
          <path d="M 244 222 Q 255 222 262 230" stroke="#8b5cf6" strokeWidth="2" fill="none" opacity="0.8" strokeLinecap="round" />
          {/* Bottom node */}
          <circle cx="240" cy="265" r="6" fill="#39d353" opacity="0.7" />
        </motion.g>
      </svg>
    </div>
  )
}
