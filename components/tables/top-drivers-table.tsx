import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Driver {
  id: string
  name: string
  shipment_count: number
  on_time_deliveries: number
  on_time_percentage: number
  avg_delivery_hours: number
}

interface TopDriversTableProps {
  drivers: Driver[]
}

export function TopDriversTable({ drivers }: TopDriversTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Drivers</CardTitle>
        <CardDescription>Drivers with the best on-time delivery rates</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Driver</TableHead>
              <TableHead>Shipments</TableHead>
              <TableHead>On-Time</TableHead>
              <TableHead>On-Time %</TableHead>
              <TableHead>Avg. Delivery Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              drivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="font-medium">{driver.name}</TableCell>
                  <TableCell>{driver.shipment_count}</TableCell>
                  <TableCell>{driver.on_time_deliveries}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        driver.on_time_percentage >= 90
                          ? "bg-green-500"
                          : driver.on_time_percentage >= 75
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }
                    >
                      {driver.on_time_percentage}%
                    </Badge>
                  </TableCell>
                  <TableCell>{driver.avg_delivery_hours} hours</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
