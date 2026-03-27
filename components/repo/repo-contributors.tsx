"use client"

import { motion } from "framer-motion"
import { Users, Crown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function RepoContributors({ contributors }: { contributors: any[] }) {
  if (!contributors || contributors.length === 0) return null

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-black/40 p-6 shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-[#39d353]" />
        <h2 className="text-xl font-bold text-white">Contributors</h2>
      </div>

      <div className="flex w-full gap-4 overflow-x-auto pb-4 scrollbar-hide py-2">
        {contributors.map((c, i) => (
          <Link
            key={c.login}
            href={`/u/${c.login}`}
            className="group relative flex shrink-0 flex-col items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:-translate-y-1 hover:border-[#39d353]/30 hover:bg-white/10 min-w-[140px]"
            data-cursor="hover"
          >
            {i === 0 && (
              <div className="absolute -top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500 ring-2 ring-black">
                <Crown className="h-3.5 w-3.5" />
              </div>
            )}
            
            <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-transparent transition-colors group-hover:border-[#39d353]">
              <Image src={c.avatar_url} alt={c.login} fill className="object-cover" sizes="64px" />
            </div>
            
            <div className="flex flex-col items-center text-center">
              <span className="font-semibold text-white group-hover:text-[#39d353] transition-colors line-clamp-1">{c.login}</span>
              <span className="text-xs text-slate-400">{c.contributions} contributions</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
