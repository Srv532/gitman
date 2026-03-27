"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { generateDeveloperSummary } from "@/lib/gemini"
import { Sparkles, BarChart3, Star, Code2 } from "lucide-react"

// --- "Fun" stats pill ---
function DetailBadge({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-white/5 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-300">
      <Icon className={`h-3 w-3 ${color}`} />
      <span>{label}: <span className="text-white">{value}</span></span>
    </div>
  )
}

function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed("")
    setDone(false)
    if (!text) return
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++
      if (i >= text.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, 15)
    return () => clearInterval(interval)
  }, [text])

  return (
    <span className="relative">
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block w-[2px] h-[1em] bg-violet-400 ml-0.5 align-middle"
        />
      )}
    </span>
  )
}

export function AISummaryCard({ profileData }: { profileData: any }) {
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const topLanguage = useMemo(() => {
    const entries = Object.entries(profileData.languages || {})
    if (entries.length === 0) return "N/A"
    return (entries.sort(([, a], [, b]) => (b as number) - (a as number))[0][0])
  }, [profileData.languages])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const result = await generateDeveloperSummary({
        profile: profileData.profile,
        topRepos: profileData.topRepos || [],
        languages: profileData.languages || {},
        totalStars: profileData.totalStars || 0
      })
      if (!cancelled) {
        setSummary(result)
        setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [profileData])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-2xl border border-violet-500/20 bg-[#0d1117] p-8 shadow-[0_0_60px_rgba(139,92,246,0.1)] transition-all hover:border-violet-500/40"
    >
      {/* Dynamic Background */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/10 blur-[100px] transition-all group-hover:bg-violet-600/20" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
               <Sparkles className="h-6 w-6" />
               <motion.div 
                 animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                 transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute inset-0 rounded-xl bg-violet-400/20" 
               />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-widest text-violet-300 uppercase">✦ AI Profile Intelligence</h2>
              <p className="text-[10px] text-slate-500 font-mono">MODEL: GEMINI-1.5-FLASH-PRO</p>
            </div>
          </div>

          {/* Fun Context Pills */}
          <div className="flex flex-wrap gap-2">
            <DetailBadge icon={Star} label="Total Reputation" value={profileData.totalStars} color="text-amber-400" />
            <DetailBadge icon={Code2} label="Primary" value={topLanguage} color="text-blue-400" />
            <DetailBadge icon={BarChart3} label="Repos" value={profileData.profile?.public_repos || 0} color="text-emerald-400" />
          </div>
        </div>

        {/* Content Section */}
        <div className="min-h-[60px] rounded-xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-3"
              >
                <div className="h-4 w-full animate-pulse rounded bg-white/10" />
                <div className="h-4 w-[92%] animate-pulse rounded bg-white/10" />
                <div className="h-4 w-[85%] animate-pulse rounded bg-white/10" />
              </motion.div>
            ) : (
              <motion.div
                key="summary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-base leading-relaxed text-slate-200"
              >
                <TypewriterText text={summary || ""} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
           <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Unbiased Data Generation Engine</span>
           <div className="flex gap-1.5">
             {[...Array(3)].map((_, i) => (
                <motion.div 
                   key={i} 
                   animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                   transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                   className="h-1 w-1 rounded-full bg-violet-400" 
                />
             ))}
           </div>
        </div>
      </div>
    </motion.div>
  )
}
