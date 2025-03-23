"use client"

import type React from "react"
import { createContext, useContext } from 'react'
import {
  ResponsiveContainer,
  Line,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  XAxis,
  YAxis,
  Legend,
  type TooltipProps
} from "recharts"

export const Chart = () => {
  return null
}

// Create a context to share data and config with chart components

interface ChartContextType {
  data: any[]
  config?: Record<string, { label: string; color: string; colors?: string[] }>
}

const ChartContext = createContext<ChartContextType>({ data: [] })

export const useChartContext = () => useContext(ChartContext)

export const ChartContainer = ({
  data,
  config,
  children,
  className,
}: {
  data: any[]
  config?: Record<string, { label: string; color: string; colors?: string[] }>
  children: React.ReactNode
  className?: string
}) => {
  return (
    <ChartContext.Provider value={{ data, config }}>
      <ResponsiveContainer width="100%" height="100%" className={className}>
        {children}
      </ResponsiveContainer>
    </ChartContext.Provider>
  )
}

export const ChartGrid = () => {
  return <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
}

export const ChartLine = ({ dataKey }: { dataKey: string }) => {
  const { config } = useChartContext();

  return (
    <Line
      type="monotone"
      dataKey={dataKey}
      stroke={config?.[dataKey]?.color || `hsl(var(--chart-1))`}
      strokeWidth={2}
      dot={{ r: 3 }}
      activeDot={{ r: 5, strokeWidth: 0 }}
    />
  )
}

// Create a LineChartComponent that wraps multiple lines
export const LineChartComponent = ({ children }: { children: React.ReactNode }) => {
  const { data } = useChartContext();

  return (
    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
      <XAxis dataKey="date" />
      <YAxis />
      {children}
    </LineChart>
  )
}

export const ChartTooltip = ({ content }: { content?: React.ReactNode }) => {
  return <Tooltip content={content} />
}

export const ChartLegend = () => {
  return <Legend />
}

export const ChartTooltipContent = ({ active, payload, label }: TooltipProps<any, any>) => {
  const { config } = useChartContext();

  if (!active || !payload || !payload.length) {
    return null
  }

  return (
    <div className="rounded-md border bg-background p-2 shadow-md">
      <div className="mb-2 font-medium">{label}</div>
      <div className="flex flex-col gap-1">
        {payload.map((entry: any, index: number) => {
          const dataKey = entry.dataKey;
          // For pie charts, the entry itself might have a color property
          const entryData = entry.payload || entry;
          const color = entryData.color || config?.[dataKey]?.color || entry.color || `hsl(var(--chart-${index + 1}))`;

          return (
            <div key={`item-${index}`} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-muted-foreground">
                {config?.[dataKey]?.label || entry.name}:
              </span>
              <span className="text-xs font-medium">{typeof entry.value === 'number' ? `₹${entry.value.toLocaleString()}` : entry.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export const ChartPie = ({
  dataKey,
  nameKey,
  innerRadius = 0,
  outerRadius = 80,
  paddingAngle = 0,
  cornerRadius = 0,
  animate = false,
  data: propData,
  activeIndex,
}: {
  dataKey: string
  nameKey: string
  innerRadius?: number
  outerRadius?: number
  paddingAngle?: number
  cornerRadius?: number
  animate?: boolean
  data?: any[]
  activeIndex?: number
}) => {
  const context = useChartContext();
  // Use prop data if provided, otherwise use context data
  const data = propData || context.data || [];
  const config = context.config;

  return (
    <PieChart>
      <Pie
        dataKey={dataKey}
        nameKey={nameKey}
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        paddingAngle={paddingAngle}
        cornerRadius={cornerRadius}
        isAnimationActive={animate}
      >
        {data.map((entry: any, index: number) => {
          const isActive = activeIndex === index;
          return (
            <Cell
              key={`cell-${index}`}
              fill={entry.color || config?.[dataKey]?.colors?.[index] || `hsl(var(--chart-${index + 1}))`}
              onMouseEnter={entry.onMouseEnter}
              onMouseLeave={entry.onMouseLeave}
              // Scale up the active slice
              strokeWidth={isActive ? 2 : 0}
              stroke={isActive ? "#fff" : undefined}
            />
          );
        })}
      </Pie>
    </PieChart>
  )
}

