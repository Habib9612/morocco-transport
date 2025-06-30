"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DataPoint {
  [key: string]: any
}

interface BarChartProps {
  title: string
  description?: string
  data: DataPoint[]
  categories: {
    name: string
    key: string
    color: string
  }[]
  index: string
  className?: string
  valueFormatter?: (value: number) => string
  showLegend?: boolean
  showGrid?: boolean
  height?: number
  stacked?: boolean
}

export function BarChartComponent({
  title,
  description,
  data,
  categories,
  index,
  className,
  valueFormatter = (value: number) => value.toString(),
  showLegend = true,
  showGrid = true,
  height = 400,
  stacked = false,
}: BarChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div style={{ height: height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
              <XAxis
                dataKey={index}
                tickLine={false}
                axisLine={false}
                padding={{ left: 10, right: 10 }}
                tick={{ fontSize: 12 }}
              />
              <YAxis tickFormatter={valueFormatter} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [valueFormatter(value), ""]}
                labelFormatter={(value) => `${value}`}
                contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              {showLegend && <Legend />}
              {categories.map((category) => (
                <Bar
                  key={category.key}
                  dataKey={category.key}
                  name={category.name}
                  fill={category.color}
                  radius={[4, 4, 0, 0]}
                  stackId={stacked ? "stack" : undefined}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
