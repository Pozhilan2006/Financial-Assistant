"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ArrowUpRight, ArrowDownRight, Target, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function RightSidebar({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const transactions = [
    {
      name: "Amazon",
      amount: "-₹42.50",
      date: "Today",
      type: "expense",
    },
    {
      name: "Salary Deposit",
      amount: "+₹2,450.00",
      date: "Yesterday",
      type: "income",
    },
    {
      name: "Starbucks",
      amount: "-₹5.75",
      date: "Yesterday",
      type: "expense",
    },
    {
      name: "Transfer to Savings",
      amount: "-₹500.00",
      date: "Mar 20",
      type: "transfer",
    },
  ]

  const savingsGoals = [
    {
      name: "Vacation Fund",
      current: 2500,
      target: 5000,
      percentage: 50,
    },
    {
      name: "Emergency Fund",
      current: 8000,
      target: 10000,
      percentage: 80,
    },
    {
      name: "New Car",
      current: 12000,
      target: 30000,
      percentage: 40,
    },
  ]

  return (
    <div
      className={cn(
        "border-l bg-background/80 backdrop-blur-sm transition-all duration-300 ease-in-out relative",
        isOpen ? "w-80" : "w-0",
        "hidden lg:block overflow-hidden",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -left-3 top-3 z-10 h-6 w-6 rounded-full border bg-background shadow-md"
        onClick={onToggle}
      >
        {isOpen ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>
      <div className="flex h-full flex-col gap-4 p-4 w-80">
        <Card className="transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              {transactions.map((transaction, i) => (
                <div key={i} className="flex items-center gap-4 px-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      transaction.type === "income"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : transaction.type === "expense"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    } transition-colors duration-200`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{transaction.name}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      transaction.type === "income"
                        ? "text-green-600 dark:text-green-400"
                        : transaction.type === "expense"
                          ? "text-red-600 dark:text-red-400"
                          : ""
                    }`}
                  >
                    {transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Savings Goals</CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              {savingsGoals.map((goal, i) => (
                <div key={i} className="space-y-2 px-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{goal.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                    ₹{goal.current.toLocaleString()} / ₹{goal.target.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={goal.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-4 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500">
                <div
                  className="relative h-full w-1 rounded-full bg-background transition-all duration-500"
                  style={{ left: "40%" }}
                ></div>
              </div>
              <div className="flex justify-between text-xs">
                <span>Conservative</span>
                <span>Moderate</span>
                <span>Aggressive</span>
              </div>
              <Separator />
              <div className="text-xs text-muted-foreground">
                <p>
                  Your current risk profile is <strong>Moderate</strong>
                </p>
                <p className="mt-1">Based on your age, income, and investment goals, this risk level is appropriate.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

