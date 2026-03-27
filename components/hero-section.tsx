"use client"

import dynamic from "next/dynamic"
import { SearchBar } from "./search-bar"
import { motion } from "framer-motion"

const ParticlesBg = dynamic(() => import("./particles-bg"), { ssr: false })
// Use our CSS/SVG globe (crash-free, always works)
const HeroGlobe = dynamic(() => import("./hero-globe"), { ssr: false })

export function HeroSection() {
  const words = "Everything about any GitHub profile. Instantly.".split(" ")

  return (
    <section className="relative flex min-h-screen items-center justify-center pt-20 overflow-hidden">
      <ParticlesBg />

      {/* Container for content */}
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center px-4 text-center">

        {/* Animated Badge */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mb-8 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-2 pr-4 text-sm font-medium text-slate-300 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#39d353] opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#39d353]"></span>
          </span>
          GitHub Intelligence Explorer
        </motion.div>

        {/* 3D Globe SVG — centered in hero */}
        <HeroGlobe />

        {/* Headline — layered on top of globe */}
        <div className="mb-6 flex flex-wrap justify-center gap-x-3 gap-y-1 text-5xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-8xl relative z-20 pointer-events-none mt-56 md:mt-64">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ filter: "blur(12px)", opacity: 0, y: 30 }}
              animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              transition={{ delay: i * 0.09 + 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className={word === "Instantly." ? "text-[#39d353]" : "text-white"}
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mb-12 max-w-2xl text-lg text-slate-400 sm:text-xl font-medium relative z-20 pointer-events-none"
        >
          Paste any GitHub username or repository URL. GitMan pulls every public detail —&nbsp;
          repos, stats, contributions, languages, activity — and presents it beautifully.
        </motion.p>

        {/* Search Bar */}
        <div className="w-full relative z-20 flex justify-center">
          <SearchBar />
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="mt-16 flex flex-col items-center gap-2 text-xs text-slate-600 relative z-10"
        >
          <span>Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-5 w-[1px] bg-gradient-to-b from-transparent via-[#39d353]/50 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  )
}
