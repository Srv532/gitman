"use client"

import { formatDistanceToNow, format } from "date-fns"
import { Shield, Calendar, Clock, GitBranch, Database, GitFork, Archive, ExternalLink } from "lucide-react"
import Link from "next/link"

export function RepoSidebar({ details }: { details: any }) {
  if (!details) return null

  const sizeKb = details.size || 0
  let formattedSize = `${sizeKb} KB`
  if (sizeKb > 1024) formattedSize = `${(sizeKb / 1024).toFixed(1)} MB`
  if (sizeKb > 1024 * 1024) formattedSize = `${(sizeKb / 1024 / 1024).toFixed(1)} GB`

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-black/40 p-6 shadow-lg backdrop-blur-md">
      <h2 className="text-lg font-bold text-white mb-2 pb-4 border-b border-white/10">About</h2>

      <div className="flex flex-col gap-4 text-sm text-slate-300">
        {details.license && (
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-[#39d353]" /> License</div>
            <span className="font-medium">{details.license.name}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[#39d353]" /> Created</div>
          <span className="font-medium" title={details.created_at}>{format(new Date(details.created_at), "MMM d, yyyy")}</span>
        </div>

        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#39d353]" /> Updated</div>
          <span className="font-medium">{formatDistanceToNow(new Date(details.updated_at), { addSuffix: true })}</span>
        </div>

        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-2"><GitBranch className="h-4 w-4 text-[#39d353]" /> Default</div>
          <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-xs text-[#39d353]">{details.default_branch}</span>
        </div>

        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-2"><Database className="h-4 w-4 text-[#39d353]" /> Size</div>
          <span className="font-medium">{formattedSize}</span>
        </div>

        {details.fork && details.parent && (
          <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2 text-[#8b5cf6]"><GitFork className="h-4 w-4" /> Forked from</div>
            <Link href={`/r/${details.parent.full_name}`} className="text-[#8b5cf6] hover:underline hover:text-white transition-colors">
              {details.parent.full_name}
            </Link>
          </div>
        )}

        {details.archived && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 mt-2 text-red-400">
            <Archive className="h-4 w-4 shrink-0" />
            <span className="text-xs font-medium">This repository has been archived by the owner. It is now read-only.</span>
          </div>
        )}

      </div>
      
      <a href={details.html_url} target="_blank" rel="noreferrer" className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:border-[#39d353]" data-cursor="hover">
        <ExternalLink className="h-4 w-4" /> View full on GitHub
      </a>
    </div>
  )
}
