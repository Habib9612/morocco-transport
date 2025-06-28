import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Route {
  route: string
  shipment_count: number
  average_price: number
  avg_delivery_hours: number
  on_time: number
  on_time_percentage: number
}

interface RoutePerformanceTableProps {
  routes: Route[]
}

export function RoutePerformanceTable({ routes }: RoutePerformanceTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Routes</CardTitle>
        <CardDescription>Most frequent shipping routes and their performance</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Route</TableHead>
              <TableHead>Shipments</TableHead>
              <TableHead>Avg. Price</TableHead>
              <TableHead>Delivery Time</TableHead>
              <TableHead>On-Time %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              routes.map((route, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{route.route}</TableCell>
                  <TableCell>{route.shipment_count}</TableCell>
                  <TableCell>{formatCurrency(route.average_price)}</TableCell>
                  <TableCell>{route.avg_delivery_hours} hours</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        route.on_time_percentage >= 90
                          ? "bg-green-500"
                          : route.on_time_percentage >= 75
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }
                    >
                      {route.on_time_percentage}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
