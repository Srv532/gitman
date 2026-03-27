"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { GitBranch, Menu, X, Star } from "lucide-react"
import { MagneticButton } from "./magnetic-button"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-[#0d1117]/80 backdrop-blur-md border-b border-white/10"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 group" data-cursor="hover">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[#39d353]/10 text-[#39d353] group-hover:bg-[#39d353]/20 transition-colors">
              <GitBranch className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Git<span className="text-[#39d353]">Man</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              data-cursor="hover"
            >
              Explore
            </Link>
            {/* Compare page can be navigated here */}
            {/* Github repo link */}
            <MagneticButton>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:border-[#39d353]/50"
              >
                <Star className="h-4 w-4 text-[#e3b341]" />
                <span>Star on GitHub</span>
              </a>
            </MagneticButton>
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-16 left-0 z-40 w-full overflow-hidden bg-[#0d1117]/95 backdrop-blur-md md:hidden border-b border-white/10"
          >
            <div className="flex flex-col px-4 py-6 space-y-4">
              <Link
                href="/"
                className="text-lg font-medium text-slate-300 hover:text-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Explore
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-lg font-medium text-slate-300 hover:text-white transition-colors"
              >
                <Star className="h-5 w-5 text-[#e3b341]" />
                <span>Star on GitHub</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
