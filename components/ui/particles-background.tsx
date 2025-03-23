"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ParticlesBackgroundProps {
  className?: string
  variant?: "default" | "finance" | "minimal"
}

export function ParticlesBackground({
  className,
  variant = "finance"
}: ParticlesBackgroundProps) {
  // Generate particles based on variant
  const getParticleCount = () => {
    switch (variant) {
      case "finance": return 40
      case "minimal": return 15
      default: return 30
    }
  }

  const getParticleColor = () => {
    switch (variant) {
      case "finance": return "bg-primary/10"
      case "minimal": return "bg-muted/20"
      default: return "bg-muted/30"
    }
  }

  // Generate random particles
  const particles = Array.from({ length: getParticleCount() }).map((_, i) => {
    const size = Math.random() * 4 + 1
    const duration = Math.random() * 20 + 10
    const delay = Math.random() * 5

    return (
      <motion.div
        key={i}
        className={cn(
          "absolute rounded-full",
          getParticleColor()
        )}
        style={{
          width: size,
          height: size,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, Math.random() * -30 - 10, 0],
          x: [0, Math.random() * 20 - 10, 0],
          opacity: [0.1, 0.5, 0.1]
        }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    )
  })

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      {particles}
    </div>
  )
}