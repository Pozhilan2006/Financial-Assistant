"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StockPerformance } from "@/components/stock-performance"
import { CryptoWatchlist } from "@/components/crypto-watchlist"
import { SpendingBreakdown } from "@/components/spending-breakdown"
import { ArrowUp, ArrowDown } from "lucide-react"

export function MainDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] bg-gradient-to-br from-background to-background/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹24,563.82</div>
            <div className="flex items-center text-xs text-green-600 dark:text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              <span>2.5% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] bg-gradient-to-br from-background to-background/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹8,942.00</div>
            <div className="flex items-center text-xs text-green-600 dark:text-green-400">
              <ArrowUp className="mr-1 h-3 w-3" />
              <span>5.2% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] bg-gradient-to-br from-background to-background/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹5,427.35</div>
            <div className="flex items-center text-xs text-red-600 dark:text-red-400">
              <ArrowDown className="mr-1 h-3 w-3" />
              <span>3.1% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stocks" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="stocks" className="data-[state=active]:bg-primary/10 transition-all duration-200">
            Stock Performance
          </TabsTrigger>
          <TabsTrigger value="crypto" className="data-[state=active]:bg-primary/10 transition-all duration-200">
            Crypto Watchlist
          </TabsTrigger>
          <TabsTrigger value="spending" className="data-[state=active]:bg-primary/10 transition-all duration-200">
            Spending Breakdown
          </TabsTrigger>
        </TabsList>
        <TabsContent value="stocks" className="space-y-4 mt-4 animate-in fade-in-50 duration-300">
          <StockPerformance />
        </TabsContent>
        <TabsContent value="crypto" className="space-y-4 mt-4 animate-in fade-in-50 duration-300">
          <CryptoWatchlist />
        </TabsContent>
        <TabsContent value="spending" className="space-y-4 mt-4 animate-in fade-in-50 duration-300">
          <SpendingBreakdown />
        </TabsContent>
      </Tabs>
    </div>
  )
}

