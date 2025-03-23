"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, Send, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function AIAssistant({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (!input.trim()) return
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className="fixed bottom-24 right-6 w-80 md:w-96 shadow-xl animate-in slide-in-from-bottom-10 duration-300 z-50">
      <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-transparent">
        <CardTitle className="text-lg font-playfair">Financial Assistant</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="transition-transform duration-200 hover:rotate-90"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <ScrollArea className="h-80" ref={scrollAreaRef}>
        <CardContent className="p-4">
          <div className="space-y-4">
            <p className="text-muted-foreground">Chat functionality has been removed.</p>
          </div>
        </CardContent>
      </ScrollArea>
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <div className="flex w-full items-center space-x-2">
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
            <Mic className="h-4 w-4" />
          </Button>
          <Input
            ref={inputRef}
            placeholder="Input disabled..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled
          />
          <Button size="icon" onClick={handleSend} disabled>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
