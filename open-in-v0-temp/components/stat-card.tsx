import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  value: string
  label: string
}

export default function StatCard({ value, label }: StatCardProps) {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-6 text-center">
        <div className="text-3xl font-bold text-green-500 mb-1">{value}</div>
        <div className="text-sm text-gray-600">{label}</div>
      </CardContent>
    </Card>
  )
}
