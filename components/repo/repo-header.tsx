"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Star, GitFork, Eye, CircleDot, Globe, ExternalLink } from "lucide-react"
import { AnimatedCounter } from "@/components/ui/counter"

function StatBox({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-[#39d353]/30 hover:shadow-[0_0_15px_rgba(57,211,83,0.1)]">
      <div className={`mb-2 rounded-full bg-white/5 p-2 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-2xl font-bold text-white mb-1"><AnimatedCounter value={value} /></div>
      <div className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</div>
    </div>
  )
}

export function RepoHeader({ details }: { details: any }) {
  if (!details) return null

  return (
    <div className="flex flex-col gap-8 rounded-2xl border border-white/10 bg-black/40 p-6 shadow-xl backdrop-blur-md lg:flex-row lg:p-10 z-10 relative">
      <div className="flex flex-1 flex-col justify-center">
        <h1 className="mb-4 flex flex-wrap items-center gap-2 text-3xl font-bold text-[#39d353] sm:text-4xl">
          <Link href={`/u/${details.owner.login}`} className="text-white hover:underline decoration-[#39d353]/50 hover:text-[#39d353] transition-colors" data-cursor="hover">
            {details.owner.login}
          </Link>
          <span className="text-slate-500">/</span>
          <span>{details.name}</span>
        </h1>
        
        <p className="mb-6 max-w-3xl text-balance text-lg text-slate-300">
          {details.description || "No description provided."}
        </p>

        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
          {details.homepage && (
            <a href={details.homepage.startsWith("http") ? details.homepage : `https://${details.homepage}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-medium text-[#39d353] hover:text-[#39d353] transition-colors" data-cursor="hover">
              <Globe className="h-4 w-4" /> {details.homepage.replace(/^(https?:\/\/)?(www\.)?/, '')}
            </a>
          )}
          <a href={details.html_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-medium text-slate-400 hover:text-white transition-colors" data-cursor="hover">
            <ExternalLink className="h-4 w-4" /> View on GitHub
          </a>
        </div>

        {details.topics && details.topics.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-auto">
            {details.topics.map((topic: string) => (
              <span key={topic} className="rounded-full border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 px-3 py-1 text-xs font-medium text-[#8b5cf6]">
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 w-full lg:w-96 flex flex-col justify-center">
        <div className="grid grid-cols-2 gap-4">
          <StatBox icon={Star} label="Stars" value={details.stargazers_count} color="text-yellow-400" />
          <StatBox icon={GitFork} label="Forks" value={details.forks_count} color="text-blue-400" />
          <StatBox icon={Eye} label="Watchers" value={details.subscribers_count || details.watchers_count} color="text-[#8b5cf6]" />
          <StatBox icon={CircleDot} label="Issues" value={details.open_issues_count} color="text-red-400" />
        </div>
      </div>
    </div>
  )
}
