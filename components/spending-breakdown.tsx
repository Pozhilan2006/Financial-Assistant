"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartPie, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const spendingData = [
  { name: "Housing", value: 1800, color: "#3b82f6", percent: 33 },
  { name: "Food", value: 850, color: "#10b981", percent: 16 },
  { name: "Transportation", value: 450, color: "#f59e0b", percent: 8 },
  { name: "Utilities", value: 350, color: "#6366f1", percent: 6 },
  { name: "Entertainment", value: 400, color: "#ec4899", percent: 7 },
  { name: "Healthcare", value: 300, color: "#ef4444", percent: 6 },
  { name: "Shopping", value: 500, color: "#8b5cf6", percent: 9 },
  { name: "Other", value: 800, color: "#94a3b8", percent: 15 },
]

const chartData = spendingData.map((item) => ({
  name: item.name,
  value: item.value,
  color: item.color,
}))

export function SpendingBreakdown() {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)

  const handleMouseEnter = (index: number) => {
    setActiveIndex(index)
  }

  const handleMouseLeave = () => {
    setActiveIndex(undefined)
  }

  // Custom pie chart with hover interaction
  const CustomPieChart = () => {
    return (
      <ChartPie
        dataKey="value"
        nameKey="name"
        innerRadius={50}
        outerRadius={80}
        paddingAngle={2}
        cornerRadius={4}
        animate
        activeIndex={activeIndex}
        data={chartData.map((item, index) => ({
          ...item,
          // Add event handlers to each pie slice
          onMouseEnter: () => handleMouseEnter(index),
          onMouseLeave: handleMouseLeave
        }))}
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] bg-gradient-to-br from-background to-background/80">
        <CardHeader>
          <CardTitle>Monthly Spending Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer
              config={{
                value: {
                  label: "Amount",
                  colors: [
                    "hsl(var(--chart-1))",
                    "hsl(var(--chart-2))",
                    "hsl(var(--chart-3))",
                    "hsl(var(--chart-4))",
                    "hsl(var(--chart-5))",
                    "hsl(var(--chart-6))",
                    "hsl(var(--chart-7))",
                    "hsl(var(--chart-8))",
                  ],
                },
              }}
              data={chartData}
              className="h-full"
            >
              <CustomPieChart />
              <ChartTooltip content={<ChartTooltipContent />} />
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] bg-gradient-to-br from-background to-background/80">
        <CardHeader>
          <CardTitle>Spending Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">% of Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spendingData.map((category, index) => (
                <TableRow
                  key={category.name}
                  className={`transition-colors duration-200 hover:bg-muted/50 ${activeIndex === index ? "bg-muted/30" : ""}`}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full transition-transform duration-200"
                        style={{
                          backgroundColor: category.color,
                          transform: activeIndex === index ? "scale(1.2)" : "scale(1)",
                        }}
                      ></div>
                      {category.name}
                    </div>
                  </TableCell>
                  <TableCell>₹{category.value}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="transition-all duration-200 hover:bg-primary/10">
                      {category.percent}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

