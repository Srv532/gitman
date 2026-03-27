"use client"

import { motion } from "framer-motion"
import { AnimatedCounter } from "../ui/counter"
import { GitCommit, GitPullRequest, CircleDot, BookOpen } from "lucide-react"

export function ContributionHeatmap({ data }: { data: any }) {
  if (!data || !data.contributionCalendar) return null

  const { weeks, totalContributions } = data.contributionCalendar

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
      },
    },
  }

  const columnVariant = {
    hidden: { opacity: 0, scale: 0 },
    show: { opacity: 1, scale: 1 },
  }

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-black/40 p-6 shadow-lg backdrop-blur-md lg:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Contribution Activity</h2>
        <div className="text-sm font-medium text-slate-400">
          <span className="text-[#39d353] font-bold"><AnimatedCounter value={totalContributions} /></span> contributions in the last year
        </div>
      </div>

      <div className="w-full overflow-x-auto scrollbar-hide">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="flex min-w-max gap-1 py-2"
        >
          {weeks.map((week: any, wIndex: number) => (
            <motion.div key={wIndex} variants={columnVariant} className="flex flex-col gap-1">
              {week.contributionDays.map((day: any, dIndex: number) => (
                <div
                  key={day.date}
                  className="group relative h-3 w-3 rounded-[2px]"
                  style={{ backgroundColor: day.contributionCount === 0 ? "#161b22" : day.color }}
                  data-cursor="hover"
                >
                  <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-max -translate-x-1/2 scale-0 rounded-md bg-slate-800 px-2 py-1 text-xs text-white opacity-0 shadow-xl transition-all group-hover:scale-100 group-hover:opacity-100 z-50">
                    <span className="text-[#39d353] font-bold">{day.contributionCount}</span> contributions on {day.date}
                    <div className="absolute left-1/2 top-full -mt-[1px] -translate-x-1/2 border-[4px] border-transparent border-t-slate-800"></div>
                  </div>
                </div>
              ))}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Four stat pills below the calendar: Total Commits, Total PRs, Total Issues, Active Repositories this year */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mt-2">
        <StatPill icon={GitCommit} label="Commits" value={data.totalCommitContributions} />
        <StatPill icon={GitPullRequest} label="PRs" value={data.totalPullRequestContributions} />
        <StatPill icon={CircleDot} label="Issues" value={data.totalIssueContributions} color="text-red-400" bgColor="bg-red-400/10" />
        <StatPill icon={BookOpen} label="Repos" value={data.totalRepositoriesWithContributedCommits} color="text-[#8b5cf6]" bgColor="bg-[#8b5cf6]/10" />
      </div>
    </div>
  )
}

function StatPill({ icon: Icon, label, value, color = "text-[#39d353]", bgColor = "bg-[#39d353]/10" }: any) {
  return (
    <div className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 rounded-lg border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10`} data-cursor="hover">
      <div className={`p-2 rounded-lg ${bgColor} ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex flex-col text-center sm:text-left">
        <span className="text-xl font-bold leading-none text-white"><AnimatedCounter value={value} /></span>
        <span className="text-xs font-medium uppercase text-slate-500">{label}</span>
      </div>
    </div>
  )
}
