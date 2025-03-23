"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartGrid, ChartLine, ChartTooltip, ChartTooltipContent, LineChartComponent, ChartLegend } from "@/components/ui/chart"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

const stockData = [
  { name: "AAPL", price: 182.52, change: 1.25, changePercent: 0.69 },
  { name: "MSFT", price: 417.88, change: 2.34, changePercent: 0.56 },
  { name: "GOOGL", price: 152.19, change: -0.87, changePercent: -0.57 },
  { name: "AMZN", price: 178.75, change: 1.92, changePercent: 1.08 },
  { name: "TSLA", price: 175.34, change: -3.21, changePercent: -1.8 },
]

const chartData = [
  { date: "Jan", AAPL: 150, MSFT: 380, GOOGL: 140, AMZN: 160, TSLA: 190 },
  { date: "Feb", AAPL: 155, MSFT: 390, GOOGL: 145, AMZN: 165, TSLA: 180 },
  { date: "Mar", AAPL: 160, MSFT: 400, GOOGL: 150, AMZN: 170, TSLA: 170 },
  { date: "Apr", AAPL: 165, MSFT: 405, GOOGL: 148, AMZN: 175, TSLA: 165 },
  { date: "May", AAPL: 170, MSFT: 410, GOOGL: 145, AMZN: 172, TSLA: 160 },
  { date: "Jun", AAPL: 175, MSFT: 415, GOOGL: 150, AMZN: 175, TSLA: 170 },
  { date: "Jul", AAPL: 182, MSFT: 417, GOOGL: 152, AMZN: 178, TSLA: 175 },
]

export function StockPerformance() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-2 transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] bg-gradient-to-br from-background to-background/80">
        <CardHeader>
          <CardTitle>Stock Performance (6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer
              config={{
                AAPL: {
                  label: "Apple",
                  color: "hsl(var(--chart-1))",
                },
                MSFT: {
                  label: "Microsoft",
                  color: "hsl(var(--chart-2))",
                },
                GOOGL: {
                  label: "Google",
                  color: "hsl(var(--chart-3))",
                },
                AMZN: {
                  label: "Amazon",
                  color: "hsl(var(--chart-4))",
                },
                TSLA: {
                  label: "Tesla",
                  color: "hsl(var(--chart-5))",
                },
              }}
              data={chartData}
              className="h-full"
            >
              <LineChartComponent>
                <ChartGrid />
                <ChartLine dataKey="AAPL" />
                <ChartLine dataKey="MSFT" />
                <ChartLine dataKey="GOOGL" />
                <ChartLine dataKey="AMZN" />
                <ChartLine dataKey="TSLA" />
                <ChartLegend />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChartComponent>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-2 transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] bg-gradient-to-br from-background to-background/80">
        <CardHeader>
          <CardTitle>Watchlist</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Change</TableHead>
                <TableHead className="text-right">Change %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockData.map((stock) => (
                <TableRow key={stock.name} className="transition-colors duration-200 hover:bg-muted/50">
                  <TableCell className="font-medium">{stock.name}</TableCell>
                  <TableCell>₹{stock.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {stock.change > 0 ? (
                        <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                      )}
                      ₹{Math.abs(stock.change).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell
                    className={`text-right ${
                      stock.changePercent > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {stock.changePercent > 0 ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%
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

