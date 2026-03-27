"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, GitBranch, ArrowRight, Loader2 } from "lucide-react"

const PLACEHOLDERS = [
  "torvalds",
  "github.com/vercel/next.js",
  "sindresorhus",
  "github.com/facebook/react",
]

export function SearchBar() {
  const router = useRouter()
  const [value, setValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Typewriter effect
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [placeholderText, setPlaceholderText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    const current = PLACEHOLDERS[placeholderIndex]

    if (isDeleting) {
      if (placeholderText === "") {
        setIsDeleting(false)
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length)
        timeout = setTimeout(() => {}, 500)
      } else {
        timeout = setTimeout(() => {
          setPlaceholderText(current.substring(0, placeholderText.length - 1))
        }, 50)
      }
    } else {
      if (placeholderText === current) {
        timeout = setTimeout(() => setIsDeleting(true), 2500)
      } else {
        timeout = setTimeout(() => {
          setPlaceholderText(current.substring(0, placeholderText.length + 1))
        }, 100)
      }
    }

    return () => clearTimeout(timeout)
  }, [placeholderText, isDeleting, placeholderIndex])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!value.trim() || isSubmitting) return

    setIsSubmitting(true)

    const input = value.trim()
    let url = ""

    // check if repo
    if (input.includes("github.com/")) {
      const parts = input.split("github.com/")[1].split("/")
      if (parts.length >= 2) {
        url = `/r/${parts[0]}/${parts[1].replace(".git", "")}`
      } else {
        url = `/u/${parts[0]}`
      }
    } else if (input.includes("/")) {
      const parts = input.split("/")
      url = `/r/${parts[0]}/${parts[1]}`
    } else {
      url = `/u/${input}`
    }

    // animate out then navigate
    setTimeout(() => {
      router.push(url)
    }, 600)
  }

  return (
    <motion.form
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.6 }}
      onSubmit={handleSubmit}
      className={`relative flex w-full max-w-2xl items-center rounded-full border bg-black/40 backdrop-blur-md transition-all duration-300 ${
        isFocused
          ? "border-[#39d353] shadow-[0_0_20px_rgba(57,211,83,0.3)]"
          : "border-white/10 hover:border-white/20"
      }`}
    >
      <div className="flex h-16 w-16 items-center justify-center pl-4 text-slate-400">
        <motion.div animate={{ scale: isFocused ? 1.1 : 1, color: isFocused ? "#39d353" : "#94a3b8" }}>
          <GitBranch className="h-6 w-6" />
        </motion.div>
      </div>

      <div className="relative flex-1">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="h-16 w-full bg-transparent text-lg text-white outline-none placeholder:text-transparent z-10 relative"
          disabled={isSubmitting}
        />
        {!value && (
          <div className="pointer-events-none absolute inset-0 flex items-center text-lg text-slate-500">
            {placeholderText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="ml-[1px] h-[1em] w-[2px] bg-[#39d353]"
            />
          </div>
        )}
      </div>

      <div className="pr-2">
        <button
          type="submit"
          disabled={!value.trim() || isSubmitting}
          className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-[#39d353]/10 text-[#39d353] transition-all hover:bg-[#39d353] hover:text-white disabled:opacity-50 disabled:hover:bg-[#39d353]/10 disabled:hover:text-[#39d353]"
          aria-label="Search"
        >
          <AnimatePresence mode="wait">
            {isSubmitting ? (
              <motion.div
                key="loading"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
              >
                <Loader2 className="h-5 w-5 animate-spin" />
              </motion.div>
            ) : (
              <motion.div
                key="arrow"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="transition-transform group-hover:translate-x-1"
              >
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.form>
  )
}
