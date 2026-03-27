"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Building, Globe, AtSign, Calendar, Clock, Star, Users, Briefcase } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { AnimatedCounter } from "../ui/counter"
import Image from "next/image"

function StatBox({ label, value, href }: { label: string; value: number; href?: string }) {
  const content = (
    <div className="flex w-full flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-[#39d353]/30 hover:shadow-[0_0_15px_rgba(57,211,83,0.1)]">
      <div className="text-2xl font-bold text-white mb-1"><AnimatedCounter value={value} /></div>
      <div className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</div>
    </div>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="block w-full" data-cursor="hover">
        {content}
      </a>
    )
  }

  return content
}

export function ProfileHeader({ profile, orgs, followers }: { profile: any; orgs: any[]; followers: any[] }) {
  const [showAvatar, setShowAvatar] = useState(false)

  if (!profile) return null

  return (
    <>
      <div className="flex flex-col gap-8 rounded-2xl border border-white/10 bg-black/40 p-6 shadow-xl backdrop-blur-md lg:flex-row lg:p-10 z-10 relative">
        {/* Left Avatar */}
        <div className="flex shrink-0 justify-center lg:justify-start">
          <div 
            className="group relative h-32 w-32 cursor-pointer overflow-hidden rounded-full sm:h-48 sm:w-48"
            onClick={() => setShowAvatar(true)}
            data-cursor="hover"
          >
            {/* Spinning gradient ring */}
            <div className="absolute inset-0 z-0 animate-spin-slow rounded-full bg-gradient-to-br from-[#39d353] via-transparent to-[#8b5cf6]"></div>
            <div className="absolute inset-1 z-10 overflow-hidden rounded-full bg-black">
              <Image 
                src={profile.avatar_url} 
                alt={profile.login} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-110" 
                sizes="(max-width: 640px) 128px, 192px" 
                priority 
              />
            </div>
          </div>
        </div>

        {/* Center Details */}
        <div className="flex flex-1 flex-col justify-center text-center lg:text-left">
          <div className="mb-2 flex flex-col items-center justify-center gap-3 lg:flex-row lg:justify-start lg:items-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">{profile.name || profile.login}</h1>
            {profile.name && <span className="font-mono text-lg text-slate-400">@{profile.login}</span>}
            {profile.hireable && (
              <div className="flex items-center gap-2 rounded-full border border-[#39d353]/30 bg-[#39d353]/10 px-3 py-1 text-xs font-medium text-[#39d353]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#39d353] opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#39d353]"></span>
                </span>
                Open to Work
              </div>
            )}
          </div>
          
          <p className="mb-6 text-balance text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0">
            {profile.bio || "No bio available."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-slate-400 max-w-2xl mx-auto lg:mx-0">
            {profile.location && (
              <div className="flex items-center justify-center gap-2 lg:justify-start">
                <MapPin className="h-4 w-4 text-[#39d353]" /> {profile.location}
              </div>
            )}
            {profile.company && (
              <div className="flex items-center justify-center gap-2 lg:justify-start">
                <Building className="h-4 w-4 text-[#39d353]" /> {profile.company}
              </div>
            )}
            {profile.blog && (
              <a href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 lg:justify-start hover:text-[#39d353] transition-colors" data-cursor="hover">
                <Globe className="h-4 w-4 text-[#39d353]" /> {profile.blog.replace(/^(https?:\/\/)?(www\.)?/, '')}
              </a>
            )}
            {profile.twitter_username && (
              <a href={`https://twitter.com/${profile.twitter_username}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 lg:justify-start hover:text-[#39d353] transition-colors" data-cursor="hover">
                <AtSign className="h-4 w-4 text-[#39d353]" /> @{profile.twitter_username}
              </a>
            )}
          </div>

          {/* Organizations Row */}
          {orgs?.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <span className="text-xs font-medium uppercase text-slate-500 mr-2">Orgs</span>
              {orgs.map((org) => (
                <a key={org.login} href={`https://github.com/${org.login}`} target="_blank" rel="noreferrer" title={org.login} className="relative h-8 w-8 overflow-hidden rounded-md border border-white/10 transition-transform hover:scale-110" data-cursor="hover">
                  <Image src={org.avatar_url} alt={org.login} fill sizes="32px" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Right Stats Grid */}
        <div className="flex shrink-0 flex-col items-center justify-center lg:items-end lg:w-48">
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-4">
            <StatBox label="Repos" value={profile.public_repos} href={`https://github.com/${profile.login}?tab=repositories`} />
            <StatBox label="Followers" value={profile.followers} href={`https://github.com/${profile.login}?tab=followers`} />
            <StatBox label="Following" value={profile.following} href={`https://github.com/${profile.login}?tab=following`} />
            <StatBox label="Gists" value={profile.public_gists} href={`https://gist.github.com/${profile.login}`} />
          </div>
          <div className="flex flex-col gap-1 text-xs text-slate-500 w-full max-w-xs text-center lg:text-right">
            <div className="flex items-center justify-center lg:justify-end gap-1.5 whitespace-nowrap">
              <Calendar className="h-3 w-3" /> Member since {profile.created_at ? format(new Date(profile.created_at), "MMM yyyy") : "..."}
            </div>
            <div className="flex items-center justify-center lg:justify-end gap-1.5 whitespace-nowrap">
              <Clock className="h-3 w-3" /> Active {profile.updated_at ? formatDistanceToNow(new Date(profile.updated_at), { addSuffix: true }) : "..."}
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Modal Overlay */}
      <AnimatePresence>
        {showAvatar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAvatar(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 px-4 backdrop-blur-sm cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="relative h-[80vh] max-h-[600px] w-full max-w-[600px] overflow-hidden rounded-2xl border border-white/10 bg-black cursor-auto"
            >
              <Image src={profile.avatar_url} alt={profile.login} fill className="object-cover" sizes="100vw" />
              <button 
                onClick={() => setShowAvatar(false)}
                className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-md transition"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
