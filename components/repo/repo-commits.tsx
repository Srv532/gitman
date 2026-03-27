"use client"

import { motion } from "framer-motion"
import { GitCommit } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"

export function RepoCommits({ commits }: { commits: any[] }) {
  if (!commits || commits.length === 0) return null

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-black/40 p-6 shadow-lg backdrop-blur-md max-h-[600px] overflow-hidden flex-1">
      <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
        <GitCommit className="h-5 w-5 text-[#39d353]" />
        Recent Commits
      </h2>

      <div className="relative pl-3 overflow-y-auto pr-2 scrollbar-hide pb-4 flex-1 h-full">
        {/* Vertical line running down */}
        <div className="absolute left-[15px] top-6 bottom-0 w-[2px] bg-white/10 shrink-0" />

        <div className="flex flex-col gap-6 pt-4">
          {commits.slice(0, 30).map((commitItem, i) => {
            const commit = commitItem.commit
            const author = commitItem.author || commitItem.committer
            const authorName = commit.author.name
            
            return (
              <motion.div
                key={commitItem.sha}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "20px" }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                className="relative flex flex-col gap-2 pl-6"
                data-cursor="hover"
              >
                {/* Dot marker */}
                <div className="absolute -left-[5px] top-1 h-3 w-3 rounded-full border-2 border-black bg-[#39d353] z-10" />

                <div className="flex w-full items-start justify-between gap-4">
                  <a href={commitItem.html_url} target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-200 hover:text-[#39d353] hover:underline flex-1 line-clamp-2">
                    {commit.message.split('\n')[0]}
                  </a>
                  <a href={commitItem.html_url} target="_blank" rel="noreferrer" className="shrink-0 font-mono text-xs text-[#8b5cf6] bg-[#8b5cf6]/10 px-1.5 py-0.5 rounded border border-[#8b5cf6]/20 hover:bg-[#8b5cf6] hover:text-white transition-colors">
                    {commitItem.sha.substring(0, 7)}
                  </a>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  {author && author.avatar_url ? (
                    <Image src={author.avatar_url} alt={authorName} width={16} height={16} className="rounded-full" unoptimized />
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-slate-700" />
                  )}
                  <span className="font-semibold text-slate-400">{author ? author.login : authorName}</span>
                  <span>commited {formatDistanceToNow(new Date(commit.author.date), { addSuffix: true })}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
