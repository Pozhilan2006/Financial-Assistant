"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartGrid, ChartLine, ChartTooltip, ChartTooltipContent, LineChartComponent, ChartLegend } from "@/components/ui/chart"
import { ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

const cryptoData = [
  { name: "Bitcoin", symbol: "BTC", price: 65432.18, change: 2.34, marketCap: "1.28T" },
  { name: "Ethereum", symbol: "ETH", price: 3521.45, change: 1.87, marketCap: "422.5B" },
  { name: "Solana", symbol: "SOL", price: 142.76, change: -3.21, marketCap: "62.3B" },
  { name: "Cardano", symbol: "ADA", price: 0.45, change: -0.87, marketCap: "15.9B" },
  { name: "Dogecoin", symbol: "DOGE", price: 0.12, change: 5.43, marketCap: "17.2B" },
]

const chartData = [
  { date: "Jan", BTC: 42000, ETH: 3000, SOL: 100, ADA: 0.35, DOGE: 0.08 },
  { date: "Feb", BTC: 44000, ETH: 3100, SOL: 110, ADA: 0.38, DOGE: 0.09 },
  { date: "Mar", BTC: 48000, ETH: 3200, SOL: 120, ADA: 0.4, DOGE: 0.1 },
  { date: "Apr", BTC: 52000, ETH: 3300, SOL: 130, ADA: 0.42, DOGE: 0.11 },
  { date: "May", BTC: 58000, ETH: 3400, SOL: 135, ADA: 0.44, DOGE: 0.1 },
  { date: "Jun", BTC: 62000, ETH: 3450, SOL: 140, ADA: 0.45, DOGE: 0.11 },
  { date: "Jul", BTC: 65000, ETH: 3500, SOL: 142, ADA: 0.45, DOGE: 0.12 },
]

export function CryptoWatchlist() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-2 transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] bg-gradient-to-br from-background to-background/80">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Crypto Market (6 Months)</CardTitle>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full transition-all duration-200 hover:bg-primary/10"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer
              config={{
                BTC: {
                  label: "Bitcoin",
                  color: "hsl(var(--chart-6))",
                },
                ETH: {
                  label: "Ethereum",
                  color: "hsl(var(--chart-7))",
                },
                SOL: {
                  label: "Solana",
                  color: "hsl(var(--chart-8))",
                },
              }}
              data={chartData}
              className="h-full"
            >
              <LineChartComponent>
                <ChartGrid />
                <ChartLine dataKey="BTC" />
                <ChartLine dataKey="ETH" />
                <ChartLine dataKey="SOL" />
                <ChartLegend />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChartComponent>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-2 transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] bg-gradient-to-br from-background to-background/80">
        <CardHeader>
          <CardTitle>Crypto Watchlist</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>24h Change</TableHead>
                <TableHead className="text-right">Market Cap</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cryptoData.map((crypto) => (
                <TableRow key={crypto.symbol} className="transition-colors duration-200 hover:bg-muted/50">
                  <TableCell>
                    <div className="font-medium">{crypto.name}</div>
                    <div className="text-xs text-muted-foreground">{crypto.symbol}</div>
                  </TableCell>
                  <TableCell>₹{crypto.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <div
                      className={`flex items-center ${
                        crypto.change > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {crypto.change > 0 ? (
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-4 w-4" />
                      )}
                      {crypto.change > 0 ? "+" : ""}
                      {crypto.change}%
                    </div>
                  </TableCell>
                  <TableCell className="text-right">₹{crypto.marketCap}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

