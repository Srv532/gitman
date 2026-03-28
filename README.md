# ✦ GitMan ✦

### The Ultimate GitHub Intelligence Explorer
**AI-Augmented • Zero-Backend • 100% Client-Side • Ultra-Premium UI**

GitMan is a high-performance GitHub intelligence engine built with the speed of **Next.js 14**, the design precision of **Stripe & Linear**, and the analytical power of **Google Gemini AI**. Explore any GitHub profile or repository with deep metrics, animated visualizations, and AI-generated technical audits.

---

## ⚡ Key Intelligence Features

- 🤖 **AI Technical Auditor** — Real-time project analysis and developer summaries powered by Gemini 1.5 Flash.
- 👤 **Supercharged Profiles** — Deep-dive into any user with animated avatars, bio intelligence, and org tracking.
- 📦 **Deep Repo Analytics** — Live-fetched stars, forks, contributors, commit timelines, and full README rendering.
- 📊 **Activity Visualizer** — 52-week interactive contribution heatmaps and automated language distribution mapping.
- 📌 **3D Hover States** — Premium 3D tilt effects for pinned repositories and high-impact data cards.
- 🆚 **Side-by-Side Comparison** — Full technical VS mode to compare developers across all public metrics.
- 🎨 **Visual Excellence** — Responsive dark-theme, moving mesh gradients, particle fields, and Geist typography.

---

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/Srv532/gitman.git
   cd gitman
   npm install
   ```

2. **Configure Environment**
   Create a `.env.local` file in the root:
   ```env
   NEXT_PUBLIC_GITHUB_TOKEN=your_github_pat_here
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *Note: Without a GitHub token, you will be limited to 60 requests per hour. A PAT increases this to 5,000.*

3. **Run Dev Server**
   ```bash
   npm run dev
   ```

---

## 🌐 Deploy to Vercel

Build and deploy your own instance of GitMan in under a minute:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSrv532%2Fgitman)

**Important**: Ensure you add `NEXT_PUBLIC_GITHUB_TOKEN` and `NEXT_PUBLIC_GEMINI_API_KEY` in the Vercel Dashboard -> Settings -> Environment Variables.

---

## 🛠️ Performance Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router & TS)
- **Design**: [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://framer.com/motion)
- **3D**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [Three.js](https://threejs.org/)
- **Visuals**: [tsParticles](https://particles.js.org/) (Neural Background)
- **AI**: [Google Gemini 1.5 Flash](https://ai.google.com/build/generative-ai)
- **Charts**: [Recharts](https://recharts.org/) & [Nivo](https://nivo.rocks/)
- **Data**: [GitHub REST v3](https://docs.github.com/en/rest) & [GraphQL v4](https://docs.github.com/en/graphql)

---

Built for developers who value performance and aesthetics. No database, no tracking, just pure GitHub intelligence.
