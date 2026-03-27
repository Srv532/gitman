"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GitBranch } from "lucide-react"
import { Progress } from "./ui/progress"
import dynamic from "next/dynamic"

const Hero3D = dynamic(() => import("./hero-3d"), { ssr: false })

export function LoadingScreen({ stage }: { stage: number }) {
  const [text, setText] = useState("")
  const targetText = "Fetching GitHub data..."

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i <= targetText.length) {
        setText(targetText.slice(0, i))
        i++
      } else {
        clearInterval(interval)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d1117] px-4">
      {/* Background 3D octocat corner */}
      <div className="absolute -bottom-20 -right-20 scale-50 opacity-30 blur-sm mix-blend-screen pointer-events-none hidden sm:block">
        <Hero3D />
      </div>

      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="mb-8 relative flex h-24 w-24 items-center justify-center rounded-2xl bg-[#39d353]/10 text-[#39d353] shadow-[0_0_40px_rgba(57,211,83,0.2)]"
      >
        <GitBranch className="h-12 w-12" />
        <div className="absolute inset-0 rounded-2xl border-2 border-[#39d353]/50 animate-ping"></div>
      </motion.div>

      <h2 className="mb-8 font-mono text-xl text-[#39d353] h-8">{text}</h2>

      <div className="w-full max-w-md">
        <div className="mb-2 flex justify-between text-xs font-medium text-slate-400">
          <span className={stage >= 1 ? "text-white" : ""}>Profile</span>
          <span className={stage >= 2 ? "text-white" : ""}>Repositories</span>
          <span className={stage >= 3 ? "text-white" : ""}>Contributions</span>
        </div>
        <Progress value={stage * 33.33} className="h-2 bg-slate-800" />
      </div>
    </div>
  )
}
