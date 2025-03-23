"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, Send, X, Sparkles, Bot, User, Loader2, ChevronDown, ChevronUp, Maximize2, Minimize2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { notificationAnimation } from "@/lib/advanced-animations"

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export function AIAssistant({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your AI financial assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date()
    }
  ])
  const [isExpanded, setIsExpanded] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [suggestions] = useState([
    "How can I improve my savings?",
    "Analyze my spending patterns",
    "What's my investment allocation?",
    "Create a budget plan"
  ])

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsThinking(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(input.trim()),
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsThinking(false)
    }, 1500)
  }

  // Simple mock AI response function
  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes('savings') || lowerQuery.includes('save')) {
      return "Based on your spending patterns, you could save an additional ₹3,500 per month by reducing discretionary spending on entertainment and dining out. Would you like me to create a savings plan for you?"
    } else if (lowerQuery.includes('spending') || lowerQuery.includes('expenses')) {
      return "Your top spending categories this month are: Housing (35%), Food (20%), Transportation (15%), Entertainment (12%), and Others (18%). Your dining out expenses have increased by 8% compared to last month."
    } else if (lowerQuery.includes('investment') || lowerQuery.includes('invest')) {
      return "Your current investment allocation is: Stocks (45%), Bonds (30%), Real Estate (15%), and Cash (10%). Based on your risk profile, I recommend increasing your stock allocation to 55% to maximize long-term growth."
    } else if (lowerQuery.includes('budget') || lowerQuery.includes('plan')) {
      return "I've analyzed your income and expenses. A recommended monthly budget would be: Housing (30%), Savings (20%), Food (15%), Transportation (10%), Entertainment (10%), Utilities (5%), Insurance (5%), and Miscellaneous (5%)."
    } else {
      return "I understand you're asking about " + query + ". To provide the most accurate financial advice, could you provide more specific details about your question?"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    handleSend()
  }

  return (
    <Card
      className={`fixed right-6 shadow-xl z-50 overflow-hidden border-primary/20 transition-all duration-300 ${
        isExpanded
          ? "bottom-6 top-6 w-[400px] md:w-[450px]"
          : "bottom-24 w-80 md:w-96"
      }`}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 animate-gradient"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-transparent backdrop-blur-sm relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center"
        >
          <Bot className="h-5 w-5 mr-2 text-primary" />
          <CardTitle className="text-lg">AI Financial Assistant</CardTitle>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3, type: "spring" }}
            className="ml-2"
          >
            <Sparkles className="h-4 w-4 text-primary animate-pulse-subtle" />
          </motion.div>
        </motion.div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8"
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="transition-transform duration-200 hover:rotate-90 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <ScrollArea className={`${isExpanded ? 'h-[calc(100%-8rem)]' : 'h-80'} relative z-10`} ref={scrollAreaRef}>
        <CardContent className="p-4">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex max-w-[85%] ${
                      message.role === 'user'
                        ? 'bg-primary/20 rounded-lg rounded-tr-none ml-auto'
                        : 'bg-muted/30 rounded-lg rounded-tl-none'
                    } p-3`}
                  >
                    <div className={`${message.role === 'user' ? 'hidden' : 'mr-2 mt-0.5'}`}>
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className={`${message.role === 'assistant' ? 'hidden' : 'ml-2 mt-0.5'}`}>
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </motion.div>
              ))}

              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex justify-start"
                >
                  <div className="bg-muted/30 rounded-lg rounded-tl-none p-3 flex items-center">
                    <Bot className="h-4 w-4 text-primary mr-2" />
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2 text-sm">Thinking...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </CardContent>
      </ScrollArea>

      {messages.length === 1 && !isThinking && (
        <motion.div
          variants={notificationAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
          className="px-4 pb-2"
        >
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs border-primary/20 hover:bg-primary/10"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </motion.div>
      )}

      <CardFooter className="p-4 border-t bg-background/80 backdrop-blur-sm relative z-10">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your finances..."
            className="flex-1 bg-background/50"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isThinking}
            className="bg-primary/90 text-primary-foreground hover:bg-primary transition-colors"
            animated
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="border-primary/20 text-primary hover:bg-primary/10 transition-colors"
            animated
          >
            <Mic className="h-4 w-4" />
            <span className="sr-only">Voice input</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
