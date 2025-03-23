"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MainDashboard } from "@/components/main-dashboard"
import { FinanceSidebar } from "@/components/finance-sidebar"
import { RightSidebar } from "@/components/right-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AIAssistant } from "@/components/ai-assistant"
import { ParticlesBackground } from "@/components/ui/particles-background"
import { cn } from "@/lib/utils"

export function FinanceDashboard() {
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)

    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-background to-background/80 transition-colors duration-300 overflow-hidden">
      {/* Particles background */}
      <div className="absolute inset-0 z-0 opacity-50">
        <ParticlesBackground variant="minimal" />
      </div>

      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 transition-all duration-300">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <h1 className="text-2xl font-playfair font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70 transition-colors duration-300">
            AI Financial Assistant
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="ml-auto flex items-center gap-4"
        >
          <ModeToggle />
          <UserNav />
        </motion.div>
      </header>

      <div className="flex flex-1 overflow-hidden relative z-10">
        <AnimatePresence>
          <FinanceSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        </AnimatePresence>

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={cn(
            "flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300",
            sidebarOpen ? "md:ml-0" : "md:ml-0",
            rightSidebarOpen ? "md:mr-0" : "md:mr-0",
          )}
        >
          <MainDashboard />
        </motion.main>

        <AnimatePresence>
          <RightSidebar isOpen={rightSidebarOpen} onToggle={() => setRightSidebarOpen(!rightSidebarOpen)} />
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.5
        }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 hover:shadow-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
          onClick={() => setShowAIAssistant(!showAIAssistant)}
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Open AI Assistant</span>
        </Button>
      </motion.div>

      <AnimatePresence>
        {showAIAssistant && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <AIAssistant onClose={() => setShowAIAssistant(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

