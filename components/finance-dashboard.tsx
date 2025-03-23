"use client"

import { useState, useEffect } from "react"
import { MainDashboard } from "@/components/main-dashboard"
import { FinanceSidebar } from "@/components/finance-sidebar"
import { RightSidebar } from "@/components/right-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AIAssistant } from "@/components/ai-assistant"
import { cn } from "@/lib/utils"

export function FinanceDashboard() {
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-background to-background/80 transition-colors duration-300">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 transition-all duration-300">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-playfair font-bold tracking-tight text-primary transition-colors duration-300">
            AI Financial Assistant
          </h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <ModeToggle />
          <UserNav />
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <FinanceSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main
          className={cn(
            "flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300",
            sidebarOpen ? "md:ml-0" : "md:ml-0",
            rightSidebarOpen ? "md:mr-0" : "md:mr-0",
          )}
        >
          <MainDashboard />
        </main>
        <RightSidebar isOpen={rightSidebarOpen} onToggle={() => setRightSidebarOpen(!rightSidebarOpen)} />
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 hover:shadow-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
          onClick={() => setShowAIAssistant(!showAIAssistant)}
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Open AI Assistant</span>
        </Button>
      </div>
      {showAIAssistant && <AIAssistant onClose={() => setShowAIAssistant(false)} />}
    </div>
  )
}

