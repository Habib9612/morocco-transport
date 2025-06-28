"use client"

import { useShipments } from '@/lib/hooks/use-dashboard-data'
import ShipmentTable from '@/components/shipment-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'

export default function ShipmentsPage() {
  const { shipments, loading, error, refetch } = useShipments()
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Loading shipments...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
        <Button onClick={refetch} className="ml-4">Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <ShipmentTable 
            shipments={shipments} 
            onSelectOrder={setSelectedOrder}
            selectedOrder={selectedOrder}
          />
        </CardContent>
      </Card>
    </div>
  )
}
