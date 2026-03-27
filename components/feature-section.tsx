"use client"

import { motion } from "framer-motion"
import { Search, FolderGit2, BarChart2 } from "lucide-react"

const FEATURES = [
  {
    icon: Search,
    title: "Full Profile Intelligence",
    description: "Every public detail of any GitHub user. Avatar, bio, location, company, followers, following, join date, website, social links, hireable status, organizations, and their entire public repository catalog."
  },
  {
    icon: FolderGit2,
    title: "Deep Repository Explorer",
    description: "Paste any repo URL and get the full breakdown. Stars, forks, watchers, issues, pull requests, primary language, all contributors, recent commits, README preview, topics, license, and release history."
  },
  {
    icon: BarChart2,
    title: "Living Stats & Visualizations",
    description: "Contribution heatmaps, language distribution charts, commit frequency graphs, star growth over time, and repository activity timelines — all animated and interactive."
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

export function FeatureSection() {
  return (
    <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid gap-8"
        >
          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="group flex flex-col sm:flex-row gap-6 rounded-2xl border border-white/10 bg-black/40 p-8 shadow-lg backdrop-blur-md transition-all hover:bg-black/60 hover:border-[#39d353]/30 hover:shadow-[0_0_30px_rgba(57,211,83,0.1)] hover:-translate-y-1"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#39d353]/10 text-[#39d353] transition-colors group-hover:bg-[#39d353] group-hover:text-white">
                <feature.icon className="h-8 w-8" />
              </div>
              <div className="flex flex-col flex-1 justify-center">
                <h3 className="mb-2 text-2xl font-bold text-slate-100 group-hover:text-[#39d353] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
