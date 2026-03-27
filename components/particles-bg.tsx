"use client"

import { useEffect, useState } from "react"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"

export default function ParticlesBg() {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  if (!init) return null

  return (
    <Particles
      id="tsparticles"
      className="absolute inset-0 z-[-1]"
      options={{
        background: { color: { value: "transparent" } },
        fpsLimit: 120,
        interactivity: { events: { resize: { enable: true } } },
        particles: {
          color: { value: "#39d353" },
          links: { color: "#39d353", distance: 150, enable: true, opacity: 0.1, width: 1 },
          move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 0.5, straight: false },
          number: { density: { enable: true, width: 800, height: 800 }, value: 40 },
          opacity: { value: 0.2 },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 2 } },
        },
        detectRetina: true,
      }}
    />
  )
}
