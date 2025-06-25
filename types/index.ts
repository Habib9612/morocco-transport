// Database types based on Prisma schema
export interface User {
  id: string
  userId?: string // For compatibility
  email: string
  firstName: string
  lastName: string
  name?: string // For compatibility
  phone?: string
  role: 'USER' | 'DRIVER' | 'ADMIN' | 'COMPANY'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Truck {
  id: string
  licensePlate: string
  model: string
  make?: string
  year: number
  capacity: number
  fuelType: 'DIESEL' | 'GASOLINE' | 'ELECTRIC' | 'HYBRID'
  status: 'AVAILABLE' | 'IN_TRANSIT' | 'MAINTENANCE' | 'OUT_OF_SERVICE'
  currentLocation?: string
  lastMaintenance?: Date
  nextMaintenance?: Date
  mileage?: number
  driverId?: string
  companyId?: string
  currentShipmentId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Shipment {
  id: string
  trackingNumber: string
  status: 'PENDING' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'
  pickupAddress: string
  pickupCity: string
  pickupPostal?: string
  pickupDate?: Date
  pickupContact?: string
  pickupPhone?: string
  deliveryAddress: string
  deliveryCity: string
  deliveryPostal?: string
  deliveryDate?: Date
  deliveryContact?: string
  deliveryPhone?: string
  weight?: number
  dimensions?: string
  description?: string
  specialInstructions?: string
  price?: number
  currency: string
  isPaid: boolean
  estimatedArrival?: Date
  actualPickup?: Date
  actualDelivery?: Date
  senderId: string
  receiverId: string
  truckId?: string
  companyId?: string
  createdAt: Date
  updatedAt: Date
}

export interface RouteData {
  id: string
  name: string
  origin: string
  destination: string
  distance?: number
  estimatedTime?: number
  tollCost?: number
  fuelCost?: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Extended types for API responses
export interface RouteWithDetails extends RouteData {
  shipment?: Shipment
  truck?: Truck
  driver?: User
}

export interface ShipmentWithDetails extends Shipment {
  sender: User
  receiver: User
  truck?: Truck
  trackingEvents?: TrackingEvent[]
}

export interface TruckWithDetails extends Truck {
  driver?: User
  company?: Company
  currentShipment?: Shipment
}

export interface TrackingEvent {
  id: string
  shipmentId: string
  event: string
  location?: string
  description?: string
  timestamp: Date
}

export interface Company {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  country: string
  taxId?: string
  isVerified: boolean
  isActive: boolean
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

// API Request/Response types
export interface CreateRouteRequest {
  name: string
  origin: string
  destination: string
  distance?: number
  estimatedTime?: number
  tollCost?: number
  fuelCost?: number
}

export interface CreateShipmentRequest {
  pickupAddress: string
  pickupCity: string
  pickupPostal?: string
  pickupDate?: string
  pickupContact?: string
  pickupPhone?: string
  deliveryAddress: string
  deliveryCity: string
  deliveryPostal?: string
  deliveryDate?: string
  deliveryContact?: string
  deliveryPhone?: string
  weight?: number
  dimensions?: string
  description?: string
  specialInstructions?: string
  price?: number
  receiverId: string
}

export interface CreateTruckRequest {
  licensePlate: string
  model: string
  make?: string
  year: number
  capacity: number
  fuelType?: 'DIESEL' | 'GASOLINE' | 'ELECTRIC' | 'HYBRID'
  currentLocation?: string
  driverId?: string
  companyId?: string
}

// Auth types
export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  role?: 'USER' | 'DRIVER' | 'COMPANY'
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
