"use client"

import { useEffect, useRef, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Fuel, Activity } from "lucide-react"

interface PerformanceChartProps {
  isFleetView?: boolean
}

export default function PerformanceChart({ isFleetView = false }: PerformanceChartProps) {
  const [activeTab, setActiveTab] = useState("deliveries")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Set dimensions
    const width = canvasRef.current.width
    const height = canvasRef.current.height
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#2d3748"
    ctx.lineWidth = 1
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Generate data based on active tab
    let data: number[] = []
    let aiData: number[] = []

    if (activeTab === "deliveries") {
      data = isFleetView
        ? [124, 135, 128, 142, 148, 137, 152, 158, 162, 175, 169, 184, 198, 192]
        : [65, 72, 68, 75, 82, 78, 85, 88, 92, 95, 89, 94, 98, 92]
      aiData = isFleetView
        ? [128, 142, 136, 150, 157, 147, 163, 170, 174, 190, 185, 200, 215, 210]
        : [70, 79, 75, 82, 89, 85, 93, 97, 100, 103, 97, 103, 108, 104]
    } else if (activeTab === "costs") {
      data = isFleetView
        ? [14.8, 14.7, 14.9, 14.6, 14.5, 14.3, 14.4, 14.2, 14.3, 14.1, 14.2, 14.0, 14.1, 14.2]
        : [4.8, 4.7, 4.9, 4.6, 4.5, 4.3, 4.4, 4.2, 4.3, 4.1, 4.2, 4.0, 4.1, 4.2]
      aiData = isFleetView
        ? [13.5, 13.4, 13.6, 13.2, 13.0, 12.8, 12.9, 12.7, 12.8, 12.6, 12.7, 12.5, 12.6, 12.7]
        : [4.2, 4.1, 4.3, 4.0, 3.9, 3.7, 3.8, 3.6, 3.7, 3.5, 3.6, 3.4, 3.5, 3.6]
    } else if (activeTab === "efficiency") {
      data = isFleetView
        ? [82, 84, 81, 85, 88, 90, 92, 89, 93, 96, 94, 97, 89, 91]
        : [72, 74, 71, 75, 78, 80, 82, 85, 83, 86, 88, 87, 89, 91]
      aiData = isFleetView
        ? [90, 92, 89, 94, 96, 97, 99, 97, 100, 102, 100, 103, 97, 99]
        : [82, 84, 81, 85, 88, 90, 92, 95, 93, 96, 98, 97, 99, 100]
    }

    // Calculate scales
    const maxValue = Math.max(...[...data, ...aiData]) * 1.1
    const minValue = activeTab === "costs" ? Math.min(...[...data, ...aiData]) * 0.9 : 0
    const valueRange = maxValue - minValue

    // Draw grid lines and labels
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"
    ctx.font = "10px sans-serif"
    ctx.fillStyle = "#64748b"

    const gridLines = 5
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (chartHeight - i * (chartHeight / gridLines))
      const value = minValue + i * (valueRange / gridLines)

      // Grid line
      ctx.beginPath()
      ctx.strokeStyle = "#1e293b"
      ctx.lineWidth = 0.5
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()

      // Label
      ctx.fillText(activeTab === "costs" ? `$${value.toFixed(1)}` : Math.round(value).toString(), padding - 5, y)
    }

    // X-axis labels (days)
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    const days = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"]
    const barWidth = chartWidth / days.length

    days.forEach((day, i) => {
      const x = padding + i * barWidth + barWidth / 2
      ctx.fillText(day, x, height - padding + 5)
    })

    // Draw data
    if (activeTab === "deliveries" || activeTab === "efficiency") {
      // Standard data line
      ctx.beginPath()
      ctx.strokeStyle = "#2563eb" // Blue
      ctx.lineWidth = 2
      ctx.lineJoin = "round"

      data.forEach((value, i) => {
        const x = padding + i * barWidth + barWidth / 2
        const y = height - padding - ((value - minValue) / valueRange) * chartHeight

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Add standard data points
      data.forEach((value, i) => {
        const x = padding + i * barWidth + barWidth / 2
        const y = height - padding - ((value - minValue) / valueRange) * chartHeight

        ctx.beginPath()
        ctx.fillStyle = "#1e293b"
        ctx.strokeStyle = "#2563eb" // Blue
        ctx.lineWidth = 2
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      })

      // Add gradient area under the standard line
      const gradient = ctx.createLinearGradient(0, padding, 0, height - padding)
      gradient.addColorStop(0, "rgba(37, 99, 235, 0.2)")
      gradient.addColorStop(1, "rgba(37, 99, 235, 0)")

      ctx.beginPath()
      ctx.fillStyle = gradient

      data.forEach((value, i) => {
        const x = padding + i * barWidth + barWidth / 2
        const y = height - padding - ((value - minValue) / valueRange) * chartHeight

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.lineTo(padding + chartWidth, height - padding)
      ctx.lineTo(padding, height - padding)
      ctx.closePath()
      ctx.fill()

      // AI-optimized data line
      ctx.beginPath()
      ctx.strokeStyle = "#8b5cf6" // Purple for AI
      ctx.lineWidth = 2
      ctx.lineJoin = "round"
      ctx.setLineDash([5, 3]) // Dashed line for AI prediction

      aiData.forEach((value, i) => {
        const x = padding + i * barWidth + barWidth / 2
        const y = height - padding - ((value - minValue) / valueRange) * chartHeight

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()
      ctx.setLineDash([]) // Reset to solid line

      // Add AI data points
      aiData.forEach((value, i) => {
        const x = padding + i * barWidth + barWidth / 2
        const y = height - padding - ((value - minValue) / valueRange) * chartHeight

        ctx.beginPath()
        ctx.fillStyle = "#1e293b"
        ctx.strokeStyle = "#8b5cf6" // Purple
        ctx.lineWidth = 2
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      })

      // Add label for AI line
      ctx.fillStyle = "#8b5cf6"
      ctx.textAlign = "right"
      ctx.font = "bold 10px sans-serif"
      ctx.fillText("AI Optimized", width - padding, padding + 15)

      // Add label for standard line
      ctx.fillStyle = "#2563eb"
      ctx.fillText("Standard", width - padding, padding + 30)
    } else if (activeTab === "costs") {
      // Bar chart for costs - Standard
      data.forEach((value, i) => {
        const x = padding + i * barWidth + barWidth * 0.1
        const barW = barWidth * 0.35
        const y = height - padding - ((value - minValue) / valueRange) * chartHeight

        // Draw standard bar
        ctx.beginPath()
        ctx.fillStyle = "#2563eb" // Blue
        ctx.fillRect(x, y, barW, height - padding - y)
      })

      // Bar chart for costs - AI Optimized
      aiData.forEach((value, i) => {
        const x = padding + i * barWidth + barWidth * 0.5
        const barW = barWidth * 0.35
        const y = height - padding - ((value - minValue) / valueRange) * chartHeight

        // Draw AI bar
        ctx.beginPath()
        ctx.fillStyle = "#8b5cf6" // Purple
        ctx.fillRect(x, y, barW, height - padding - y)
      })

      // Add legend
      ctx.fillStyle = "#8b5cf6" // Purple
      ctx.textAlign = "right"
      ctx.font = "bold 10px sans-serif"
      ctx.fillText("AI Optimized", width - padding, padding + 15)

      ctx.fillStyle = "#2563eb" // Blue
      ctx.fillText("Standard", width - padding, padding + 30)
    }
  }, [activeTab, isFleetView])

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="deliveries" className="flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            {isFleetView ? "Total Deliveries" : "Deliveries"}
          </TabsTrigger>
          <TabsTrigger value="costs" className="flex items-center">
            <Fuel className="h-4 w-4 mr-2" />
            {isFleetView ? "Operating Costs" : "Costs"}
          </TabsTrigger>
          <TabsTrigger value="efficiency" className="flex items-center">
            <Brain className="h-4 w-4 mr-2" />
            {isFleetView ? "AI Optimization" : "Efficiency"}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="deliveries" className="space-y-4">
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
            <Brain className="h-4 w-4 mr-2 text-purple-500" />
            {isFleetView
              ? "AI-optimized delivery routes increased delivery rate by 8.5% across all carriers"
              : "AI-optimized delivery performance increased on-time deliveries by 9.2%"}
          </div>
        </TabsContent>
        <TabsContent value="costs" className="space-y-4">
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
            <Brain className="h-4 w-4 mr-2 text-purple-500" />
            {isFleetView
              ? "AI route optimization reduced operating costs by $1.50 per mile (11%)"
              : "AI route optimization reduced cost per mile by 13.5% over standard routes"}
          </div>
        </TabsContent>
        <TabsContent value="efficiency" className="space-y-4">
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
            <Brain className="h-4 w-4 mr-2 text-purple-500" />
            {isFleetView
              ? "AI boosted fleet utilization by 9.8% through predictive maintenance and route optimization"
              : "AI improved efficiency by 13.2% through optimized scheduling and resource allocation"}
          </div>
        </TabsContent>
      </Tabs>

      <div className="h-[240px] w-full">
        <canvas ref={canvasRef} width={500} height={240} className="w-full h-full" />
      </div>
    </div>
  )
}
