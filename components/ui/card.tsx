"use client"

import * as React from "react"
import { motion, MotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import { cardEntrance } from "@/lib/advanced-animations"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  animated?: boolean
  index?: number
  hoverEffect?: boolean
  glowEffect?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, animated = false, index = 0, hoverEffect = true, glowEffect = false, ...props }, ref) => {
    const Component = animated ? motion.div : "div"

    const motionProps: MotionProps = animated ? {
      variants: cardEntrance,
      initial: "hidden",
      animate: "visible",
      custom: index,
      whileHover: hoverEffect ? {
        scale: 1.02,
        boxShadow: "0 10px 30px -15px var(--shadow-color)",
        ...(glowEffect && {
          boxShadow: "0 0 15px 2px var(--primary-rgb-15)",
        })
      } : undefined,
      whileTap: { scale: 0.98 }
    } : {}

    return (
      <Component
        ref={ref}
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md",
          glowEffect && "hover:border-primary/50",
          className
        )}
        {...motionProps}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
