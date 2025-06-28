"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Package, Clock } from "lucide-react"
import { ShipmentMap } from "@/components/shipment-map"

type NearbyItem = {
  id: string;
  name: string;
  type: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  distance: string;
  shipmentType: string;
  weight: string;
  dimensions: string;
  deadline: string;
  price: string;
};

export default function NearbyPage() {
  const { user } = useAuth();
  const [nearby] = useState<NearbyItem[]>([])
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [requestSent, setRequestSent] = useState<Record<string, boolean>>({})

  if (!user) {
    return null
  }

  const isCarrier = typeof user === 'object' && user !== null && 'userType' in user && user.userType === 'carrier';
  const title = isCarrier ? "Nearby Shipments" : "Nearby Carriers"

  const handleSendRequest = (id: string) => {
    setRequestSent((prev) => ({ ...prev, [id]: true }))
    // In a real app, this would send a request to the API
  }

  type Marker = {
    id: string;
    position: { lat: number; lng: number };
    title: string;
    isSelected: boolean;
    isCurrent?: boolean;
  };
  const mapMarkers: Marker[] = nearby.map((item) => ({
    id: item.id,
    position: { lat: item.location.lat, lng: item.location.lng },
    title: item.name,
    isSelected: selectedItem === item.id,
  }))

  if (typeof user === 'object' && user !== null && 'location' in user && user.location && typeof user.location === 'object' && 'lat' in user.location && 'lng' in user.location) {
    mapMarkers.push({
      id: "current",
      position: { lat: (user.location as { lat: number; lng: number }).lat, lng: (user.location as { lat: number; lng: number }).lng },
      title: "Your Location",
      isSelected: false,
      isCurrent: true,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">
          {isCarrier
            ? "Find shipments near your location that need transportation."
            : "Find carriers near your location that can transport your goods."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="h-[500px]">
            <CardHeader className="p-4">
              <CardTitle>Location Map</CardTitle>
              <CardDescription>
                {isCarrier ? "Shipments near your current location" : "Carriers near your current location"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ShipmentMap
                markers={mapMarkers}
                onMarkerClick={(id) => setSelectedItem(id)}
                className="h-[420px] w-full rounded-b-lg"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {nearby.map((item) => (
            <Card
              key={item.id}
              className={`transition-all ${selectedItem === item.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedItem(item.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <Badge variant="outline">{item.distance}</Badge>
                </div>
                <CardDescription className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {item.location.address}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                    {item.shipmentType}
                  </div>
                  <div>Weight: {item.weight}</div>
                  <div>Size: {item.dimensions}</div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    {item.deadline}
                  </div>
                </div>
                <div className="mt-2 font-medium text-right">{item.price}</div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleSendRequest(item.id)} disabled={requestSent[item.id]}>
                  {requestSent[item.id] ? "Request Sent" : isCarrier ? "Request to Transport" : "Request Carrier"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
