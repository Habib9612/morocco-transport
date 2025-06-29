"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PeriodSelectorProps {
  onPeriodChange: (period: string) => void
  className?: string
}

export function PeriodSelector({ onPeriodChange, className }: PeriodSelectorProps) {
  const [activePeriod, setActivePeriod] = useState("month")

  const handlePeriodChange = (period: string) => {
    setActivePeriod(period)
    onPeriodChange(period)
  }

  return (
    <div className={cn("flex space-x-1 rounded-md border p-1", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handlePeriodChange("day")}
        className={cn("rounded-sm", activePeriod === "day" ? "bg-muted text-foreground" : "text-muted-foreground")}
      >
        Day
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handlePeriodChange("week")}
        className={cn("rounded-sm", activePeriod === "week" ? "bg-muted text-foreground" : "text-muted-foreground")}
      >
        Week
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handlePeriodChange("month")}
        className={cn("rounded-sm", activePeriod === "month" ? "bg-muted text-foreground" : "text-muted-foreground")}
      >
        Month
      </Button>
    </div>
  )
}
