"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function AnimationTest() {
  const [isAnimating, setIsAnimating] = useState(false)
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-4">
      <h1 className="text-3xl font-bold">Animation Test</h1>
      
      <Button 
        onClick={() => setIsAnimating(!isAnimating)}
        className="mb-8"
      >
        {isAnimating ? "Stop Animation" : "Start Animation"}
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Test 1: Basic Motion */}
        <div className="flex flex-col items-center gap-4 p-6 border rounded-lg">
          <h2 className="text-xl font-semibold">Basic Motion</h2>
          <motion.div
            animate={{
              scale: isAnimating ? [1, 1.5, 1] : 1,
              rotate: isAnimating ? [0, 180, 0] : 0,
              borderRadius: isAnimating ? ["0%", "50%", "0%"] : "0%"
            }}
            transition={{ 
              duration: 2,
              repeat: isAnimating ? Infinity : 0,
              repeatType: "loop"
            }}
            className="w-32 h-32 bg-primary/50"
          />
        </div>
        
        {/* Test 2: Staggered Children */}
        <div className="flex flex-col items-center gap-4 p-6 border rounded-lg">
          <h2 className="text-xl font-semibold">Staggered Motion</h2>
          <motion.div
            className="flex gap-2"
            initial="hidden"
            animate={isAnimating ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 1 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.3
                }
              }
            }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-8 h-8 bg-primary"
                variants={{
                  hidden: { y: 0, opacity: 0.2 },
                  visible: {
                    y: [-20, 0, -20],
                    opacity: 1,
                    transition: {
                      repeat: Infinity,
                      duration: 1
                    }
                  }
                }}
              />
            ))}
          </motion.div>
        </div>
        
        {/* Test 3: Hover Effects */}
        <div className="flex flex-col items-center gap-4 p-6 border rounded-lg">
          <h2 className="text-xl font-semibold">Hover Effects</h2>
          <motion.div
            className="w-32 h-32 bg-primary/50 flex items-center justify-center"
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.2)",
              backgroundColor: "rgba(59, 130, 246, 0.8)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white font-bold">Hover Me</span>
          </motion.div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p>If you can see animations when clicking the button, Framer Motion is working correctly.</p>
        <p className="text-muted-foreground mt-2">
          If not, there might be an issue with the installation or imports.
        </p>
      </div>
    </div>
  )
}