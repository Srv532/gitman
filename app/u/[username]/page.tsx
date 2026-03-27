"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LoadingScreen } from "@/components/loading-screen"
import { ProfileHeader } from "@/components/profile/profile-header"
import { PinnedRepos } from "@/components/profile/pinned-repos"
import { ContributionHeatmap } from "@/components/profile/contribution-heatmap"
import { LanguageDistribution } from "@/components/profile/language-distribution"
import { RepoGrid } from "@/components/profile/repo-grid"
import { ActivityFeed } from "@/components/profile/activity-feed"
import { AISummaryCard } from "@/components/ai-summary-card"
import { 
  fetchUserProfile, fetchUserRepos, fetchUserOrgs, fetchUserFollowers, 
  fetchUserEvents, fetchContributionCalendar 
} from "@/lib/github"

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const username = params.username as string

  const [loadingStage, setLoadingStage] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  const [profile, setProfile] = useState<any>(null)
  const [repos, setRepos] = useState<any[]>([])
  const [orgs, setOrgs] = useState<any[]>([])
  const [followers, setFollowers] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [contributions, setContributions] = useState<any>(null)

  useEffect(() => {
    async function loadData() {
      // Stage 1: Profile
      setLoadingStage(1)
      const pRes = await fetchUserProfile(username)
      if (pRes.error) {
        setError(pRes.error)
        return
      }
      setProfile(pRes.data)
      
      const [oRes, fRes] = await Promise.all([
        fetchUserOrgs(username),
        fetchUserFollowers(username)
      ])
      if (oRes.data) setOrgs(oRes.data)
      if (fRes.data) setFollowers(fRes.data)

      // Stage 2: Repos
      setLoadingStage(2)
      const rRes = await fetchUserRepos(username)
      if (rRes.data) setRepos(rRes.data)

      // Stage 3: Contributions & Events
      setLoadingStage(3)
      const [cRes, eRes] = await Promise.all([
        fetchContributionCalendar(username),
        fetchUserEvents(username)
      ])
      if (cRes.data) setContributions(cRes.data)
      if (eRes.data) setEvents(eRes.data)
      
      // Done loading
      setTimeout(() => setLoadingStage(4), 500)
    }

    if (username) {
      loadData()
    }
  }, [username])

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <Navbar />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 p-8 shadow-2xl backdrop-blur-md">
          <h2 className="mb-4 text-2xl font-bold text-red-400">Error Loading Profile</h2>
          <p className="mb-8 text-slate-300">{error}</p>
          <button onClick={() => router.push("/")} className="rounded-full bg-[#39d353] px-6 py-2 font-medium text-black transition-transform hover:scale-105">
            Search Again
          </button>
        </motion.div>
      </div>
    )
  }

  if (loadingStage < 4) {
    return <LoadingScreen stage={loadingStage} />
  }

  return (
    <div className="relative min-h-screen pb-20 pt-24">
      <Navbar />
      
      <main className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          className="flex flex-col gap-12"
        >
          {/* Header Card */}
          <ProfileHeader profile={profile} orgs={orgs} followers={followers} />

          {/* AI Developer Summary */}
          {profile && repos.length >= 0 && (
            <AISummaryCard 
              profileData={{
                profile,
                topRepos: repos.slice(0, 10),
                languages: repos.reduce((acc, r) => {
                  if (r.language) acc[r.language] = (acc[r.language] || 0) + 1;
                  return acc;
                }, {} as any),
                totalStars: repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
              }} 
            />
          )}

          {/* Pinned Repos (if any via GraphQL) */}
          {contributions?.user?.pinnedItems?.nodes?.length > 0 && (
            <PinnedRepos pinnedItems={contributions.user.pinnedItems.nodes} username={username} />
          )}

          {/* Activity Heatmap */}
          {contributions?.user && (
             <ContributionHeatmap data={contributions.user.contributionsCollection} />
          )}

          {/* Repo Explorer Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-8">
              <LanguageDistribution repos={repos} />
              <RepoGrid repos={repos} username={username} />
            </div>
            <div className="lg:col-span-1">
              <ActivityFeed events={events} />
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  )
}
