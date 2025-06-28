"use client"

import {
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

interface DataPoint {
  name: string
  value: number
}

interface LineChartProps {
  data: DataPoint[]
  className?: string
}

export function LineChartComponent({ data, className }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsLineChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          padding={{ left: 10, right: 10 }}
          tick={{ fontSize: 12 }}
        />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
          labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 4, strokeWidth: 2 }}
          activeDot={{ r: 6, strokeWidth: 2 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}
