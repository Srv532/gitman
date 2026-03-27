"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { LoadingScreen } from "@/components/loading-screen"
import { 
  fetchUserProfile, fetchUserRepos, fetchContributionCalendar 
} from "@/lib/github"
import { AnimatedCounter } from "@/components/ui/counter"
import Image from "next/image"
import Link from "next/link"

function getPrimaryLanguage(repos: any[]) {
  if (!repos || repos.length === 0) return "None"
  const map: Record<string, number> = {}
  repos.forEach((r) => {
    if (r.language) map[r.language] = (map[r.language] || 0) + 1
  })
  const sorted = Object.entries(map).sort((a, b) => b[1] - a[1])
  return sorted.length > 0 ? sorted[0][0] : "None"
}

export default function ComparePage() {
  const params = useParams()
  const router = useRouter()
  const u1 = params.u1 as string
  const u2 = params.u2 as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [user1Data, setUser1Data] = useState<any>(null)
  const [user2Data, setUser2Data] = useState<any>(null)

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      
      const p1 = fetchUserProfile(u1)
      const p2 = fetchUserProfile(u2)
      const c1 = fetchContributionCalendar(u1)
      const c2 = fetchContributionCalendar(u2)
      const r1 = fetchUserRepos(u1)
      const r2 = fetchUserRepos(u2)

      const [resP1, resP2, resC1, resC2, resR1, resR2] = await Promise.all([p1, p2, c1, c2, r1, r2])

      if (resP1.error || resP2.error) {
        setError(resP1.error || resP2.error)
        setLoading(false)
        return
      }

      // Compute total stars & forks
      const getTotals = (repos: any[]) => {
        let stars = 0
        let forks = 0
        repos?.forEach(r => {
          stars += r.stargazers_count
          forks += r.forks_count
        })
        return { stars, forks }
      }

      const totals1 = getTotals(resR1.data || [])
      const totals2 = getTotals(resR2.data || [])

      setUser1Data({
        profile: resP1.data,
        contributions: resC1.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions || 0,
        stars: totals1.stars,
        forks: totals1.forks,
        topLang: getPrimaryLanguage(resR1.data || [])
      })

      setUser2Data({
        profile: resP2.data,
        contributions: resC2.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions || 0,
        stars: totals2.stars,
        forks: totals2.forks,
        topLang: getPrimaryLanguage(resR2.data || [])
      })
      
      setLoading(false)
    }

    if (u1 && u2) {
      fetchAll()
    }
  }, [u1, u2])

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <Navbar />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 p-8 shadow-2xl backdrop-blur-md">
          <h2 className="mb-4 text-2xl font-bold text-red-400">Comparison Failed</h2>
          <p className="mb-8 text-slate-300">{error}</p>
          <button onClick={() => router.push("/")} className="rounded-full bg-[#39d353] px-6 py-2 font-medium text-black transition-transform hover:scale-105">
            Try Again
          </button>
        </motion.div>
      </div>
    )
  }

  if (loading || !user1Data || !user2Data) {
    return <LoadingScreen stage={2} />
  }

  const ComparisonRow = ({ label, v1, v2, formatValue }: { label: string, v1: any, v2: any, formatValue?: (v: any) => string }) => {
    const isNum = typeof v1 === 'number'
    const wins1 = isNum ? v1 > v2 : false
    const wins2 = isNum ? v2 > v1 : false
    
    const pct1 = isNum ? (v1 / Math.max(v1 + v2, 1)) * 100 : 50
    const pct2 = isNum ? (v2 / Math.max(v1 + v2, 1)) * 100 : 50

    return (
      <div className="flex w-full flex-col gap-2 py-4 border-b border-white/5 last:border-0 relative">
        <div className="flex w-full justify-between z-10 text-sm sm:text-base font-semibold">
          <span className={`${wins1 ? "text-[#39d353]" : "text-white"}`}>
             {isNum ? <AnimatedCounter value={v1} /> : v1}
          </span>
          <span className="text-slate-500 uppercase tracking-widest text-xs font-bold pt-1">{label}</span>
          <span className={`${wins2 ? "text-[#39d353]" : "text-white"}`}>
             {isNum ? <AnimatedCounter value={v2} /> : v2}
          </span>
        </div>
        
        {isNum && (
          <div className="flex w-full h-3 rounded-full bg-white/5 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${pct1}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full ${wins1 ? "bg-[#39d353]" : "bg-white/20"} `}
            />
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${pct2}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full ${wins2 ? "bg-[#8b5cf6]" : "bg-white/20"} `}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative min-h-screen pb-20 pt-24">
      <Navbar />
      
      <main className="mx-auto flex max-w-5xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        
        {/* VS Header Profiles */}
        <div className="relative flex justify-between items-center bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl overflow-hidden mt-8">
          
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/10 -translate-x-1/2 hidden md:block" />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full bg-[#161b22] border-4 border-[#0d1117] shadow-[0_0_30px_rgba(57,211,83,0.3)] z-10 font-black text-[#39d353] italic">
            VS
          </div>

          <div className="flex flex-col items-center gap-4 w-1/2 md:pr-12">
            <Link href={`/u/${user1Data.profile.login}`} className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full overflow-hidden border-2 border-white/10 hover:border-[#39d353] transition-colors" data-cursor="hover">
              <Image src={user1Data.profile.avatar_url} alt={user1Data.profile.name} fill className="object-cover" sizes="128px" />
            </Link>
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white line-clamp-1">{user1Data.profile.name || user1Data.profile.login}</h2>
              <span className="text-sm font-mono text-slate-400">@{user1Data.profile.login}</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 w-1/2 md:pl-12">
            <Link href={`/u/${user2Data.profile.login}`} className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full overflow-hidden border-2 border-white/10 hover:border-[#8b5cf6] transition-colors" data-cursor="hover">
              <Image src={user2Data.profile.avatar_url} alt={user2Data.profile.name} fill className="object-cover" sizes="128px" />
            </Link>
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white line-clamp-1">{user2Data.profile.name || user2Data.profile.login}</h2>
              <span className="text-sm font-mono text-slate-400">@{user2Data.profile.login}</span>
            </div>
          </div>

        </div>

        {/* Comparison Stats */}
        <div className="flex flex-col rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 p-6 sm:p-10 shadow-xl">
          <ComparisonRow label="Followers" v1={user1Data.profile.followers} v2={user2Data.profile.followers} />
          <ComparisonRow label="Public Repos" v1={user1Data.profile.public_repos} v2={user2Data.profile.public_repos} />
          <ComparisonRow label="Total Stars" v1={user1Data.stars} v2={user2Data.stars} />
          <ComparisonRow label="Total Forks" v1={user1Data.forks} v2={user2Data.forks} />
          <ComparisonRow label="Yearly Contributions" v1={user1Data.contributions} v2={user2Data.contributions} />
          <ComparisonRow label="Top Language" v1={user1Data.topLang} v2={user2Data.topLang} />
        </div>

      </main>
      
      <Footer />
    </div>
  )
}
