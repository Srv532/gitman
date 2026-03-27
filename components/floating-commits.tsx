"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const COMMITS = [
  "fix: resolve merge conflict",
  "feat: add dark mode",
  "chore: update deps",
  "refactor: optimize rendering",
  "docs: update README",
  "style: adjust padding",
  "test: add unit tests",
  "build: update webpack config",
]

export function FloatingCommits() {
  const [commits, setCommits] = useState<{ id: number; text: string; left: number; top: number; delay: number }[]>([])

  useEffect(() => {
    let idCounter = 0
    const interval = setInterval(() => {
      const newCommit = {
        id: idCounter++,
        text: COMMITS[Math.floor(Math.random() * COMMITS.length)],
        left: Math.random() * 80 + 10,
        top: Math.random() * 80 + 10,
        delay: Math.random() * 2,
      }

      setCommits((prev) => [...prev, newCommit])

      setTimeout(() => {
        setCommits((prev) => prev.filter((c) => c.id !== newCommit.id))
      }, 8000)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <AnimatePresence>
        {commits.map((commit) => (
          <motion.div
            key={commit.id}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 0.15, y: -100, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 8, ease: "linear", delay: commit.delay }}
            className="absolute font-mono text-sm text-[#39d353] whitespace-nowrap"
            style={{ left: `${commit.left}%`, top: `${commit.top}%` }}
          >
            {commit.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
