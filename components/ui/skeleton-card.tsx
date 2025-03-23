"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface SkeletonCardProps {
  className?: string
  variant?: "default" | "chart" | "table"
}

export function SkeletonCard({ className, variant = "default" }: SkeletonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("w-full", className)}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/4 mt-1" />
        </CardHeader>
        <CardContent>
          {variant === "chart" && (
            <div className="space-y-2">
              <Skeleton className="h-[200px] w-full" />
              <div className="flex justify-between mt-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          )}
          
          {variant === "table" && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center py-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/5" />
                </div>
              ))}
            </div>
          )}
          
          {variant === "default" && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}