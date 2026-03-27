"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { 
  fetchRepoDetails, fetchRepoContributors, 
  fetchRepoCommits, fetchRepoLanguages, fetchRepoReadme 
} from "@/lib/github"

import { RepoHeader } from "@/components/repo/repo-header"
import { RepoLanguages } from "@/components/repo/repo-languages"
import { RepoContributors } from "@/components/repo/repo-contributors"
import { RepoCommits } from "@/components/repo/repo-commits"
import { RepoReadme } from "@/components/repo/repo-readme"
import { RepoSidebar } from "@/components/repo/repo-sidebar"
import { LoadingScreen } from "@/components/loading-screen"

export default function RepoPage() {
  const params = useParams()
  const router = useRouter()
  const owner = params.owner as string
  const repoName = params.repo as string

  const [loadingStage, setLoadingStage] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  const [details, setDetails] = useState<any>(null)
  const [contributors, setContributors] = useState<any[]>([])
  const [commits, setCommits] = useState<any[]>([])
  const [languages, setLanguages] = useState<any>(null)
  const [readme, setReadme] = useState<string | null>(null)

  useEffect(() => {
    async function loadRepoData() {
      setLoadingStage(1) // basic repo details
      const rRes = await fetchRepoDetails(owner, repoName)
      if (rRes.error) {
        setError(rRes.error)
        return
      }
      setDetails(rRes.data)

      setLoadingStage(2) // contributors and commits
      const [cRes, cmRes] = await Promise.all([
        fetchRepoContributors(owner, repoName),
        fetchRepoCommits(owner, repoName)
      ])
      if (cRes.data) setContributors(cRes.data)
      if (cmRes.data) setCommits(cmRes.data)

      setLoadingStage(3) // languages and readme
      const [lRes, rmRes] = await Promise.all([
        fetchRepoLanguages(owner, repoName),
        fetchRepoReadme(owner, repoName)
      ])
      if (lRes.data) setLanguages(lRes.data)
      
      // Decode Base64 Readme
      if (rmRes.data?.content) {
        try {
          // GitHub base64 can contain newlines
          const decoded = atob(rmRes.data.content.replace(/\n/g, ''))
          setReadme(decoded)
        } catch (e) {
          console.error("Failed to decode readme", e)
        }
      }
      
      setTimeout(() => setLoadingStage(4), 500)
    }

    if (owner && repoName) {
      loadRepoData()
    }
  }, [owner, repoName])

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <Navbar />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 p-8 shadow-2xl backdrop-blur-md">
          <h2 className="mb-4 text-2xl font-bold text-red-400">Error Loading Repository</h2>
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
      
      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          className="flex flex-col gap-10"
        >
          {/* Header */}
          <RepoHeader details={details} />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 flex flex-col gap-8">
              {/* Language Breakdown */}
              <RepoLanguages languages={languages} />

              {/* Contributors horizontally */}
              <RepoContributors contributors={contributors} />

              {/* Readme Card */}
              {readme && <RepoReadme readme={readme} htmlUrl={details.html_url} />}
            </div>

            <div className="lg:col-span-1 flex flex-col gap-8">
              {/* Sidebar Metadata */}
              <RepoSidebar details={details} />

              {/* Commits timeline */}
              <RepoCommits commits={commits} />
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  )
}
