"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { getLanguageColor } from "@/lib/colors"

export function RepoLanguages({ languages }: { languages: Record<string, number> | null }) {
  const languageStats = useMemo(() => {
    if (!languages) return []

    const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0)
    if (totalBytes === 0) return []

    return Object.entries(languages)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: Number(((bytes / totalBytes) * 100).toFixed(1)),
        color: getLanguageColor(name),
      }))
      .sort((a, b) => b.bytes - a.bytes)
  }, [languages])

  if (languageStats.length === 0) return null

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-black/40 p-6 shadow-lg backdrop-blur-md">
      <h2 className="text-xl font-bold text-white">Languages</h2>
      
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

      <div className="flex flex-wrap items-center gap-4">
        {languageStats.map((lang, i) => (
          <motion.div
            key={lang.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 + 0.5 }}
            className="flex items-center gap-2 group cursor-default"
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
    </div>
  )
}
