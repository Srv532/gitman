"use client"

import { useMemo, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { getLanguageColor } from "@/lib/colors"
import { generateLanguagePersonality } from "@/lib/gemini"

// Gemini sparkle icon (small, inline)
function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 2C14 2 14.8 9.2 17.6 11.8C20.4 14.4 28 14 28 14C28 14 20.8 13.6 17.6 16.8C14.4 20 14 28 14 28C14 28 13.6 20 10.4 16.8C7.2 13.6 0 14 0 14C0 14 7.6 14.4 10.4 11.8C13.2 9.2 14 2 14 2Z"
        fill="url(#sparkleGrad)"
      />
      <defs>
        <linearGradient id="sparkleGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a78bfa" />
          <stop offset="1" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function LanguageDistribution({ repos }: { repos: any[] }) {
  const [personality, setPersonality] = useState<string | null>(null)
  const [loadingPersonality, setLoadingPersonality] = useState(false)

  const languageStats = useMemo(() => {
    if (!repos || repos.length === 0) return []

    const map: Record<string, number> = {}
    let totalSize = 0

    repos.forEach((repo) => {
      const lang = repo.language
      if (lang) {
        const size = repo.size || 1
        map[lang] = (map[lang] || 0) + size
        totalSize += size
      }
    })

    if (totalSize === 0) return []

    const stats = Object.entries(map)
      .map(([name, size]) => ({
        name,
        size,
        percentage: Number(((size / totalSize) * 100).toFixed(1)),
        color: getLanguageColor(name),
      }))
      .sort((a, b) => b.size - a.size)

    return stats
  }, [repos])

  // Build percentage map for Gemini
  const languagePercentages = useMemo(() => {
    return Object.fromEntries(languageStats.map((l) => [l.name, l.percentage]))
  }, [languageStats])

  useEffect(() => {
    if (languageStats.length === 0) return
    let cancelled = false
    async function load() {
      setLoadingPersonality(true)
      const result = await generateLanguagePersonality(languagePercentages)
      if (!cancelled) {
        setPersonality(result)
        setLoadingPersonality(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [languageStats])

  if (languageStats.length === 0) return null

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-black/40 p-6 shadow-lg backdrop-blur-md">
      <h2 className="text-xl font-bold text-white">Top Languages</h2>
      
      {/* Horizontal Stacked Bar */}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/5">
        {languageStats.map((lang, i) => (
          <motion.div
            key={lang.name}
            initial={{ width: 0 }}
            animate={{ width: `${lang.percentage}%` }}
            transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
            style={{ backgroundColor: lang.color }}
            className="h-full first:rounded-l-full last:rounded-r-full"
            title={`${lang.name} ${lang.percentage}%`}
          />
        ))}
      </div>

      {/* Language Pills */}
      <div className="flex flex-wrap items-center gap-4">
        {languageStats.map((lang, i) => (
          <motion.div
            key={lang.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 + 0.5 }}
            className="flex items-center gap-2 group"
            data-cursor="hover"
          >
            <div
              className="h-3 w-3 rounded-full transition-transform group-hover:scale-125"
              style={{ backgroundColor: lang.color }}
            />
            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
              {lang.name}
            </span>
            <span className="text-xs text-slate-500">
              {lang.percentage}%
            </span>
          </motion.div>
        ))}
      </div>

      {/* AI Personality Pill */}
      {(personality || loadingPersonality) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 self-start rounded-full border border-violet-500/40 bg-gradient-to-r from-violet-900/50 to-purple-900/30 px-4 py-1.5 shadow-[0_0_16px_rgba(139,92,246,0.2)]"
        >
          <SparkleIcon />
          {loadingPersonality ? (
            <motion.span
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="text-xs text-violet-400"
            >
              Analysing personality…
            </motion.span>
          ) : (
            <span className="text-xs font-medium italic text-violet-200">
              {personality}
            </span>
          )}
        </motion.div>
      )}
    </div>
  )
}
