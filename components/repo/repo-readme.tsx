"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { BookOpen, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"

export function RepoReadme({ readme, htmlUrl }: { readme: string; htmlUrl: string }) {
  const [expanded, setExpanded] = useState(false)

  if (!readme) return null

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-[#0d1117] overflow-hidden shadow-lg" id="readme">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-black/80 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-2 font-semibold text-white">
          <BookOpen className="h-5 w-5 text-[#39d353]" />
          README.md
        </div>
        <a href={`${htmlUrl}#readme`} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:border-[#39d353]" data-cursor="hover">
          <ExternalLink className="h-4 w-4" /> View
        </a>
      </div>

      {/* Content */}
      <motion.div
        animate={{ height: expanded ? "auto" : "500px" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative overflow-hidden p-6 sm:p-8"
      >
        <div className="prose prose-invert prose-slate max-w-none prose-headings:text-white prose-a:text-[#39d353] hover:prose-a:text-[#39d353]/80 prose-code:text-[#8b5cf6] prose-code:bg-[#8b5cf6]/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#161b22] prose-pre:border prose-pre:border-white/10 prose-img:rounded-lg">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {readme}
          </ReactMarkdown>
        </div>

        {/* Gradient fade */}
        <AnimatePresence>
          {!expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0d1117] to-transparent pointer-events-none flex items-end justify-center pb-4"
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Expand Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-center gap-2 border-t border-white/10 bg-black/40 py-4 text-sm font-medium text-[#39d353] hover:bg-black/60 transition-colors focus:outline-none"
        data-cursor="hover"
      >
        {expanded ? (
          <>
            <ChevronUp className="h-4 w-4" /> Show less
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" /> Show full README
          </>
        )}
      </button>

    </div>
  )
}
