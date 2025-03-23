"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StockPerformance } from "@/components/stock-performance"
import { CryptoWatchlist } from "@/components/crypto-watchlist"
import { SpendingBreakdown } from "@/components/spending-breakdown"
import { SkeletonCard } from "@/components/ui/skeleton-card"
import { ArrowUp, ArrowDown, Sparkles, TrendingUp, Wallet, PieChart, LineChart, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { listContainer, listItem } from "@/lib/advanced-animations"

export function MainDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [showInsights, setShowInsights] = useState(false)

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      variants={listContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div
        variants={listItem}
        className="flex flex-col space-y-2"
      >
        <motion.h2
          className="text-3xl font-bold tracking-tight text-gradient"
          style={{ backgroundSize: "200% 200%" }}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          Financial Dashboard
        </motion.h2>
        <p className="text-muted-foreground">
          Your personalized financial overview and market insights.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <SkeletonCard className="animate-shimmer" />
          <SkeletonCard className="animate-shimmer" />
          <SkeletonCard className="animate-shimmer" />
          <SkeletonCard className="animate-shimmer" />
        </div>
      ) : (
        <motion.div
          variants={listContainer}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={listItem}>
            <Card
              animated
              index={0}
              glowEffect
              className="overflow-hidden bg-gradient-to-br from-background to-background/80 border-primary/10"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Wallet className="h-4 w-4 mr-2 text-primary" />
                  Total Balance
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.3 }}
                    className="ml-2"
                  >
                    <Sparkles className="h-3 w-3 text-primary animate-pulse-subtle" />
                  </motion.div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-2xl font-bold"
                >
                  ₹24,563.82
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex items-center text-xs text-green-600 dark:text-green-400"
                >
                  <ArrowUp className="mr-1 h-3 w-3" />
                  <span>2.5% from last month</span>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={listItem}>
            <Card
              animated
              index={1}
              className="overflow-hidden bg-gradient-to-br from-background to-background/80 border-primary/10"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                  Monthly Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-2xl font-bold"
                >
                  ₹8,942.00
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="flex items-center text-xs text-green-600 dark:text-green-400"
                >
                  <ArrowUp className="mr-1 h-3 w-3" />
                  <span>5.2% from last month</span>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={listItem}>
            <Card
              animated
              index={2}
              className="overflow-hidden bg-gradient-to-br from-background to-background/80 border-primary/10"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <PieChart className="h-4 w-4 mr-2 text-primary" />
                  Monthly Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-2xl font-bold"
                >
                  ₹5,427.35
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex items-center text-xs text-red-600 dark:text-red-400"
                >
                  <ArrowDown className="mr-1 h-3 w-3" />
                  <span>3.1% from last month</span>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={listItem}>
            <Card
              animated
              index={3}
              className="overflow-hidden bg-gradient-to-br from-background to-background/80 border-primary/10"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <LineChart className="h-4 w-4 mr-2 text-primary" />
                  Investments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-2xl font-bold"
                >
                  ₹12,680.00
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex items-center text-xs text-green-600 dark:text-green-400"
                >
                  <ArrowUp className="mr-1 h-3 w-3" />
                  <span>8.2% overall return</span>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      <motion.div
        variants={listItem}
        className="mt-4"
      >
        <Tabs
          defaultValue="overview"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-4 h-12 bg-background/50 backdrop-blur-sm rounded-lg border border-muted/30">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary/10 transition-all duration-200 data-[state=active]:text-primary rounded-md"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="stocks"
              className="data-[state=active]:bg-primary/10 transition-all duration-200 data-[state=active]:text-primary rounded-md"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Stocks
            </TabsTrigger>
            <TabsTrigger
              value="crypto"
              className="data-[state=active]:bg-primary/10 transition-all duration-200 data-[state=active]:text-primary rounded-md"
            >
              <LineChart className="h-4 w-4 mr-2" />
              Crypto
            </TabsTrigger>
            <TabsTrigger
              value="spending"
              className="data-[state=active]:bg-primary/10 transition-all duration-200 data-[state=active]:text-primary rounded-md"
            >
              <PieChart className="h-4 w-4 mr-2" />
              Spending
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <TabsContent value="overview" className="space-y-4">
                {isLoading ? (
                  <SkeletonCard variant="chart" />
                ) : (
                  <Card animated className="p-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-xl flex items-center">
                        Financial Overview
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto"
                          animated
                          onClick={() => setShowInsights(!showInsights)}
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          {showInsights ? "Hide Insights" : "Show Insights"}
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Monthly Cash Flow</h3>
                          <div className="h-[200px] bg-muted/20 rounded-md flex items-center justify-center">
                            [Cash Flow Chart]
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-2">Asset Allocation</h3>
                          <div className="h-[200px] bg-muted/20 rounded-md flex items-center justify-center">
                            [Asset Allocation Chart]
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {showInsights && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10"
                          >
                            <h3 className="text-sm font-medium flex items-center mb-2">
                              <Sparkles className="h-4 w-4 mr-2 text-primary" />
                              AI Financial Insights
                            </h3>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start">
                                <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                                  <ArrowUp className="h-3 w-3" />
                                </span>
                                <span>Your savings rate has increased by 4.2% compared to last quarter.</span>
                              </li>
                              <li className="flex items-start">
                                <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                                  <ArrowDown className="h-3 w-3" />
                                </span>
                                <span>Your dining expenses have decreased by 12% this month.</span>
                              </li>
                              <li className="flex items-start">
                                <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                                  <TrendingUp className="h-3 w-3" />
                                </span>
                                <span>Based on your current savings rate, you're on track to meet your retirement goal by 2045.</span>
                              </li>
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="stocks" className="space-y-4">
                {isLoading ? (
                  <SkeletonCard variant="chart" />
                ) : (
                  <StockPerformance />
                )}
              </TabsContent>

              <TabsContent value="crypto" className="space-y-4">
                {isLoading ? (
                  <SkeletonCard variant="chart" />
                ) : (
                  <CryptoWatchlist />
                )}
              </TabsContent>

              <TabsContent value="spending" className="space-y-4">
                {isLoading ? (
                  <SkeletonCard variant="chart" />
                ) : (
                  <SpendingBreakdown />
                )}
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}

