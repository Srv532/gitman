"use client"

import { useRef, useState } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"
import { Pin, Star, GitFork } from "lucide-react"
import Link from "next/link"

function TiltCard({ children, href }: { children: React.ReactNode; href: string }) {
  const ref = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 })

  const rotateX = useMotionTemplate`${mouseYSpring}deg`
  const rotateY = useMotionTemplate`${mouseXSpring}deg`

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = (mouseX / width - 0.5) * 15 // tilt range
    const yPct = (mouseY / height - 0.5) * -15 // invert Y

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <Link href={href} className="block w-full sm:w-[320px] shrink-0 outline-none" data-cursor="hover">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformPerspective: 800 }}
        className="group relative flex h-full min-h-[160px] flex-col justify-between rounded-xl border border-white/10 bg-black/40 p-5 backdrop-blur-md transition-shadow hover:shadow-[0_0_20px_rgba(57,211,83,0.15)]"
      >
        <div className="pointer-events-none absolute inset-0 rounded-xl transition-colors group-hover:bg-white/[0.02]" />
        {children}
      </motion.div>
    </Link>
  )
}

export function PinnedRepos({ pinnedItems, username }: { pinnedItems: any[], username: string }) {
  if (!pinnedItems || pinnedItems.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-sm font-semibold tracking-wider text-slate-400 uppercase ml-1">
        <Pin className="h-4 w-4 text-[#39d353]" />
        Pinned
      </div>
      
      <div className="flex w-full gap-5 overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
        {pinnedItems.map((repo, i) => (
          <TiltCard key={repo.name} href={`/r/${username}/${repo.name}`}>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-[#39d353] group-hover:underline underline-offset-4 decoration-white/20 truncate">
                {repo.name}
              </h3>
              <p className="text-sm text-slate-400 line-clamp-2">
                {repo.description || "No description provided."}
              </p>
            </div>
            
            <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-500">
              <div className="flex items-center gap-1.5">
                {repo.primaryLanguage && (
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className="h-2.5 w-2.5 rounded-full block"
                      style={{ backgroundColor: repo.primaryLanguage.color }}
                    />
                    {repo.primaryLanguage.name}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 group-hover:text-slate-300 transition-colors">
                  <Star className="h-3.5 w-3.5" />
                  <span>{repo.stargazerCount}</span>
                </div>
                <div className="flex items-center gap-1 group-hover:text-slate-300 transition-colors">
                  <GitFork className="h-3.5 w-3.5" />
                  <span>{repo.forkCount}</span>
                </div>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </div>
  )
}
