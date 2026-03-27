"use client"

import { GitBranch, ArrowUp, Zap } from "lucide-react"

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="relative mt-24 border-t border-white/10 bg-[#0d1117]/80 backdrop-blur-md pb-12 pt-8 z-10">
      {/* Animated glowing top border */}
      <div className="absolute top-0 left-0 h-[1px] w-full overflow-hidden">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-[#39d353] to-transparent opacity-50 animate-[pulse_3s_ease-in-out_infinite]"></div>
      </div>
      
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 md:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-slate-300">
          <GitBranch className="h-5 w-5 text-[#39d353]" />
          <span className="font-semibold text-white tracking-tight">GitMan</span>
        </div>

        <div className="text-center text-sm text-slate-500 max-w-md flex flex-col items-center">
          <p className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-[#39d353]" /> Built with the GitHub API.
          </p>
          <p>No data is stored. Everything is fetched live.</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-300">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
          <button
            onClick={scrollToTop}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 hover:text-[#39d353] border border-white/10 transition-all hover:border-[#39d353]/50 focus:outline-none focus:ring-2 focus:ring-[#39d353]"
            aria-label="Back to top"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  )
}
