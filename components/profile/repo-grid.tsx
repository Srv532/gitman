"use client"

import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, GitFork, Search, Code2 } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { getLanguageColor } from "@/lib/colors"
import { generateRepoInsight } from "@/lib/gemini"

// --- Lazy AI one-liner per card ---
function RepoAIInsight({ repo }: { repo: any }) {
  const [insight, setInsight] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const fetchedRef = useRef(false)

  const fetchInsight = useCallback(async () => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    setLoading(true)
    const result = await generateRepoInsight({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      topics: repo.topics || [],
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
    })
    setInsight(result)
    setLoading(false)
  }, [repo])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchInsight()
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [fetchInsight])

  return (
    <div ref={ref} className="min-h-[20px]">
      <AnimatePresence>
        {loading && (
          <motion.div
            key="shimmer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-2 h-3 w-3/4 rounded-full bg-violet-500/15 animate-pulse"
          />
        )}
        {insight && !loading && (
          <motion.p
            key="insight"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 flex items-start gap-1.5 text-xs italic text-violet-300/80 leading-relaxed"
          >
            <span className="mt-0.5 shrink-0 text-[10px] text-violet-400">✦</span>
            {insight}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// --- Main RepoGrid ---
export function RepoGrid({ repos, username }: { repos: any[]; username: string }) {
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("Updated")
  const [filter, setFilter] = useState("All")
  const [langFilter, setLangFilter] = useState("All")

  const uniqueLangs = useMemo(() => {
    const set = new Set<string>()
    repos.forEach(r => { if (r.language) set.add(r.language) })
    return Array.from(set).sort()
  }, [repos])

  const filteredRepos = useMemo(() => {
    let result = repos

    if (search) {
      result = result.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (filter === "Original") result = result.filter((r) => !r.fork)
    if (filter === "Forked") result = result.filter((r) => r.fork)
    if (filter === "Archived") result = result.filter((r) => r.archived)

    if (langFilter !== "All") {
      result = result.filter((r) => r.language === langFilter)
    }

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "Stars": return b.stargazers_count - a.stargazers_count
        case "Forks": return b.forks_count - a.forks_count
        case "Size": return b.size - a.size
        case "A-Z": return a.name.localeCompare(b.name)
        case "Updated": default:
          return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
      }
    })

    return result
  }, [repos, search, sort, filter, langFilter])

  const pillClass = (active: boolean) =>
    `cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-all ${
      active
        ? "border-[#39d353] bg-[#39d353]/10 text-[#39d353]"
        : "border-white/10 bg-transparent text-slate-400 hover:border-white/30 hover:text-slate-300"
    }`

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <Code2 className="h-5 w-5 text-[#39d353]" />
            Public Repositories
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-300 ml-2">{filteredRepos.length}</span>
          </h2>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur-md lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Find a repository..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-[#39d353] focus:outline-none focus:ring-1 focus:ring-[#39d353]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-400 hidden sm:block">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#39d353] focus:outline-none"
            >
              <option value="Updated">Recently Updated</option>
              <option value="Stars">Stars</option>
              <option value="Forks">Forks</option>
              <option value="Size">Size</option>
              <option value="A-Z">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
          <div className="flex flex-wrap items-center gap-2 border-r border-white/10 pr-2">
            {["All", "Original", "Forked", "Archived"].map((f) => (
              <div key={f} onClick={() => setFilter(f)} className={pillClass(filter === f)}>
                {f}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 overflow-hidden px-2 py-1 scrollbar-hide shrink">
             <div onClick={() => setLangFilter("All")} className={pillClass(langFilter === "All")}>All Langs</div>
             {uniqueLangs.map(lang => (
               <div key={lang} onClick={() => setLangFilter(lang)} className={pillClass(langFilter === lang)} style={{ borderColor: langFilter === lang ? getLanguageColor(lang) : '', color: langFilter === lang ? getLanguageColor(lang) : '' }}>
                 {lang}
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Repo Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {filteredRepos.map((repo) => (
            <motion.div
              layout
              key={repo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3 }}
            >
              <Link href={`/r/${repo.full_name}`} className="block h-full outline-none" data-cursor="hover">
                <div className="group relative flex h-full flex-col justify-between rounded-xl border border-white/10 bg-black/40 p-5 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-[#39d353]/50 hover:shadow-[0_4px_20px_rgba(57,211,83,0.1)]">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-bold text-[#39d353] group-hover:underline truncate max-w-[70%]">
                        {repo.name}
                      </h3>
                      <div className="flex gap-2 text-xs">
                        {repo.fork && <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-slate-400">Fork</span>}
                        {repo.archived && <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-red-400">Archived</span>}
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-400 line-clamp-2 min-h-[40px]">
                      {repo.description || "No description provided."}
                    </p>

                    {/* AI one-liner */}
                    <RepoAIInsight repo={repo} />

                    {repo.topics && repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {repo.topics.slice(0, 4).map((topic: string) => (
                          <span key={topic} className="rounded border border-[#8b5cf6]/20 bg-[#8b5cf6]/10 px-1.5 py-0.5 text-[10px] text-[#8b5cf6] font-medium tracking-wide">
                            {topic}
                          </span>
                        ))}
                        {repo.topics.length > 4 && <span className="text-[10px] text-slate-500 flex items-center">&bull;&bull;&bull;</span>}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-1.5 truncate">
                      {repo.language && (
                        <>
                          <span className="h-2.5 w-2.5 rounded-full block shrink-0" style={{ backgroundColor: getLanguageColor(repo.language) }} />
                          <span className="truncate">{repo.language}</span>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1 group-hover:text-amber-400 transition-colors">
                        <Star className="h-3.5 w-3.5" />
                        <span>{repo.stargazers_count}</span>
                      </div>
                      <div className="flex items-center gap-1 group-hover:text-blue-400 transition-colors">
                        <GitFork className="h-3.5 w-3.5" />
                        <span>{repo.forks_count}</span>
                      </div>
                      <span className="text-slate-600 hidden xs:inline pl-1 border-l border-white/10">
                        {formatDistanceToNow(new Date(repo.pushed_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredRepos.length === 0 && (
          <div className="col-span-1 md:col-span-2 py-12 text-center text-slate-500 border border-white/5 bg-white/5 rounded-xl border-dashed">
            No repositories found matching your filters.
          </div>
        )}
      </motion.div>
    </div>
  )
}
