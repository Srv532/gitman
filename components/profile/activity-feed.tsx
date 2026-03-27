"use client"

import { motion } from "framer-motion"
import { Code2, GitMerge, CircleDot, Star, GitCommit } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function ActivityFeed({ events }: { events: any[] }) {
  if (!events || events.length === 0) return null

  const getEventDetails = (event: any) => {
    switch (event.type) {
      case "PushEvent":
        return {
          icon: Code2,
          text: `Pushed ${event.payload.size} commit(s) to`,
          repo: event.repo.name,
          color: "text-[#39d353]",
          bg: "bg-[#39d353]/10"
        }
      case "PullRequestEvent":
        return {
          icon: GitMerge,
          text: `${event.payload.action === 'opened' ? 'Opened' : 'Merged/Closed'} PR in`,
          repo: event.repo.name,
          color: "text-[#8b5cf6]",
          bg: "bg-[#8b5cf6]/10"
        }
      case "IssuesEvent":
        return {
          icon: CircleDot,
          text: `${event.payload.action} issue in`,
          repo: event.repo.name,
          color: "text-red-400",
          bg: "bg-red-400/10"
        }
      case "WatchEvent":
        return {
          icon: Star,
          text: "Starred",
          repo: event.repo.name,
          color: "text-yellow-400",
          bg: "bg-yellow-400/10"
        }
      case "CreateEvent":
        return {
          icon: GitCommit,
          text: `Created ${event.payload.ref_type} in`,
          repo: event.repo.name,
          color: "text-blue-400",
          bg: "bg-blue-400/10"
        }
      default:
        return null
    }
  }

  const validEvents = events
    .map((e) => ({ ...e, details: getEventDetails(e) }))
    .filter((e) => e.details !== null)
    .slice(0, 20)

  if (validEvents.length === 0) return null

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-black/40 p-6 shadow-lg backdrop-blur-md">
      <h2 className="text-xl font-bold text-white">Recent Activity</h2>

      <div className="relative pl-4">
        {/* Vertical line running down */}
        <div className="absolute left-[27px] top-4 h-[calc(100%-2rem)] w-[2px] bg-white/5" />

        <div className="flex flex-col gap-6">
          {validEvents.map((event, i) => {
            const Icon = event.details.icon
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="relative flex items-start gap-4"
                data-cursor="hover"
              >
                {/* Dot marker */}
                <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black ${event.details.bg} ${event.details.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                
                <div className="flex flex-col pt-2">
                  <p className="text-sm font-medium text-slate-300">
                    {event.details.text}{' '}
                    <a href={`https://github.com/${event.details.repo}`} target="_blank" rel="noreferrer" className="font-bold text-white transition-colors hover:text-[#39d353]">
                      {event.details.repo}
                    </a>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
