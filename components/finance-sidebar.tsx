"use client"

import type React from "react"

import { useState } from "react"
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Settings,
  ChevronDown,
  LineChart,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarItem {
  title: string
  icon: React.ElementType
  isActive?: boolean
  submenu?: { title: string; href: string }[]
}

export function FinanceSidebar({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    "Investment Insights": true,
  })
  const [activeItem, setActiveItem] = useState("Stock Analysis")

  const sidebarItems: SidebarItem[] = [
    {
      title: "Investment Insights",
      icon: TrendingUp,
      isActive: true,
      submenu: [
        { title: "Stock Analysis", href: "#" },
        { title: "ETF Recommendations", href: "#" },
        { title: "Dividend Stocks", href: "#" },
      ],
    },
    {
      title: "Market Trends",
      icon: LineChart,
      submenu: [
        { title: "Global Markets", href: "#" },
        { title: "Sector Performance", href: "#" },
        { title: "Economic Indicators", href: "#" },
      ],
    },
    {
      title: "Portfolio Analysis",
      icon: PieChart,
      submenu: [
        { title: "Asset Allocation", href: "#" },
        { title: "Performance Metrics", href: "#" },
        { title: "Risk Assessment", href: "#" },
      ],
    },
    {
      title: "Wealth Management",
      icon: Briefcase,
      submenu: [
        { title: "Retirement Planning", href: "#" },
        { title: "Tax Optimization", href: "#" },
        { title: "Estate Planning", href: "#" },
      ],
    },
    {
      title: "Analytics",
      icon: BarChart3,
      submenu: [
        { title: "Spending Patterns", href: "#" },
        { title: "Income Sources", href: "#" },
        { title: "Budget Tracking", href: "#" },
      ],
    },
    {
      title: "Settings",
      icon: Settings,
    },
  ]

  const toggleSubmenu = (title: string) => {
    setExpanded((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const handleItemClick = (title: string) => {
    setActiveItem(title)
  }

  return (
    <div
      className={cn(
        "border-r bg-background/80 backdrop-blur-sm transition-all duration-300 ease-in-out relative",
        isOpen ? "w-64" : "w-16",
        "hidden md:block",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-3 z-10 h-6 w-6 rounded-full border bg-background shadow-md"
        onClick={onToggle}
      >
        {isOpen ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
      </Button>
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {sidebarItems.map((item, index) => (
              <div key={index} className="mb-1 overflow-hidden">
                {isOpen ? (
                  <Button
                    variant={item.isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-2 px-3 transition-all duration-200 hover:bg-accent/50",
                      item.isActive && "font-semibold",
                    )}
                    onClick={() => item.submenu && toggleSubmenu(item.title)}
                  >
                    <item.icon className="h-4 w-4 transition-transform duration-200" />
                    <span className="transition-opacity duration-200">{item.title}</span>
                    {item.submenu && (
                      <ChevronDown
                        className={cn(
                          "ml-auto h-4 w-4 transition-transform duration-200",
                          expanded[item.title] && "rotate-180",
                        )}
                      />
                    )}
                  </Button>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={item.isActive ? "secondary" : "ghost"}
                          size="icon"
                          className="w-full h-10 transition-all duration-200 hover:bg-accent/50"
                        >
                          <item.icon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">{item.title}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {item.submenu && expanded[item.title] && isOpen && (
                  <div className="mt-1 pl-9 text-xs overflow-hidden animate-in slide-in-from-left duration-200">
                    {item.submenu.map((subitem, subindex) => (
                      <Button
                        key={subindex}
                        variant={activeItem === subitem.title ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start py-1 font-normal transition-all duration-200 hover:bg-accent/50",
                          activeItem === subitem.title && "font-medium",
                        )}
                        size="sm"
                        onClick={() => handleItemClick(subitem.title)}
                      >
                        {subitem.title}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}

