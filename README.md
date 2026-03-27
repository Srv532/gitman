<div align="center">

<img src="https://github-production-user-asset-6210df.s3.amazonaws.com/1/263544521-7b0f6e6d-5a8d-4a1d-8f3e-5d1d6e1f1a1d.png" width="120" />

# ✦ GitMan ✦
### The Next-Gen GitHub Intelligence Explorer
**AI-Powered • Client-Side • Ultra-Premium UI**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer-Motion-0055FF?style=for-the-badge&logo=framer)](https://framer.com/motion)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini-8E75C2?style=for-the-badge&logo=google-gemini)](https://deepmind.google/technologies/gemini/)

[Explore the App](#-quick-start) • [Features](#-features) • [Deploy](#-deploy-to-vercel)

</div>

---

## ✦ Intelligence Beyond Static Data

GitMan isn't just a GitHub viewer; it's an **Intelligence Engine**. By integrating **Google Gemini 1.5 Flash**, we transform raw GitHub JSON into meaningful, human-readable insights in real-time.

### 🤖 AI-Powered Features
- **✦ Profile Intelligence**: A 3-sentence objective summary of a developer's career, specialization, and impact across all their projects.
- **✦ Tech Personality**: A creative "personality badge" derived from language distribution (e.g., *"A TypeScript purist with a Python side quest"*).
- **✦ Lazy Repository Insights**: Real-time, strictly factual one-liners for every repo, generated only as you scroll to save API credits.
- **✦ Work Pattern Analysis**: Objective descriptions of recent contribution rhythms and community engagement.

---

## ✨ Core Features

- 🔍 **Global Search** — Instant access to any user or repository on GitHub.
- 👤 **Supercharged Profiles** — Animated avatars, bio, location, orgs, and hireable status.
- 📦 **Deep Repo Analytics** — Stars, forks, issues, contributors, commits, and full README rendering.
- 📊 **Contribution Heatmap** — 52-week activity calendar with interactive daily stats.
- 🌐 **Skill Mapping** — Animated language distribution bars and skill pills.
- ⚡ **Activity Timeline** — Real-time parsed public events feed with event-specific icons.
- 📌 **3D Pinned Items** — High-performance 3D hover tilt cards for pinned repositories.
- 🆚 **Compare Mode** — Side-by-side technical comparison between two developers.
- 🎨 **Premium Aesthetics** — Dark mode by default, mesh gradients, particles, and glassmorphism.

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Srv532/gitman.git

# 2. Install dependencies
cd gitman
npm install

# 3. Configure Environment
cp .env.local.example .env.local 
# Add your NEXT_PUBLIC_GITHUB_TOKEN and NEXT_PUBLIC_GEMINI_API_KEY
```

---

## 🔑 Required API Keys

To unlock the full potential of GitMan, you need two keys:

| Key | Purpose | Required? |
|---|---|---|
| `NEXT_PUBLIC_GITHUB_TOKEN` | Higher rate limits (5k/hr) & GraphQL Access | **Highly Recommended** |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Powers AI Summaries & Insights | **Required for AI features** |

---

## 🌐 Deploy to Vercel

The easiest way to deploy your own instance:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSrv532%2Fgitman)

**Important**: Ensure you add the environment variables in the Vercel Dashboard after deployment.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **AI**: [Google Gemini 1.5 Flash](https://ai.google.com/build/generative-ai)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **3D/Graphics**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [tsParticles](https://particles.js.org/)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)
- **Data**: [GitHub REST](https://docs.github.com/en/rest) & [GraphQL API](https://docs.github.com/en/graphql)

---

<div align="center">
Built with ❤️ for the Open Source Community.
</div>
