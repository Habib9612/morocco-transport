# Morocco Transport Platform - API Documentation

## Base URL
- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Authentication Endpoints

#### POST `/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  },
  "token": "jwt_token_here"
}
```

#### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "USER"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "email": "newuser@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "token": "jwt_token_here"
}
```

## Transport Endpoints

### Trucks

#### GET `/transport/trucks`
Get list of trucks with pagination and filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by truck status
- `location` (string): Filter by current location

**Response:**
```json
{
  "trucks": [
    {
      "id": "truck_id",
      "licensePlate": "A-12345-20",
      "model": "Mercedes Actros",
      "year": 2020,
      "capacity": 25.0,
      "status": "AVAILABLE",
      "currentLocation": "Casablanca",
      "driver": {
        "id": "driver_id",
        "firstName": "Ahmed",
        "lastName": "Benali",
        "phone": "+212612345678"
      },
      "currentShipment": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### POST `/transport/trucks`
Create a new truck (Admin only).

**Request Body:**
```json
{
  "licensePlate": "A-67890-21",
  "model": "Volvo FH16",
  "year": 2021,
  "capacity": 30.0,
  "fuelType": "DIESEL",
  "driverId": "driver_id"
}
```

### Shipments

#### GET `/transport/shipments`
Get list of shipments.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by shipment status
- `trackingNumber` (string): Search by tracking number

#### POST `/transport/shipments`
Create a new shipment.

**Request Body:**
```json
{
  "pickupAddress": "123 Pickup Street",
  "pickupCity": "Casablanca",
  "pickupPostal": "20000",
  "pickupContact": "Mohammed Benali",
  "pickupPhone": "+212522111222",
  "deliveryAddress": "789 Delivery Road",
  "deliveryCity": "Rabat",
  "deliveryPostal": "10000",
  "deliveryContact": "Aicha Fassi",
  "deliveryPhone": "+212537333444",
  "weight": 1500.0,
  "description": "Electronics and appliances",
  "receiverId": "receiver_user_id"
}
```

#### GET `/transport/shipments/track/{trackingNumber}`
Track a shipment by tracking number.

**Response:**
```json
{
  "shipment": {
    "id": "shipment_id",
    "trackingNumber": "MT-2024-001",
    "status": "IN_TRANSIT",
    "estimatedArrival": "2024-01-15T10:00:00Z",
    "pickupCity": "Casablanca",
    "deliveryCity": "Rabat"
  },
  "trackingEvents": [
    {
      "event": "PICKED_UP",
      "location": "Casablanca",
      "description": "Package picked up successfully",
      "timestamp": "2024-01-13T08:00:00Z"
    },
    {
      "event": "IN_TRANSIT",
      "location": "Highway A1",
      "description": "Package in transit to destination",
      "timestamp": "2024-01-13T14:00:00Z"
    }
  ]
}
```

## User Endpoints

#### GET `/users/profile`
Get current user profile.

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "profile": {
      "address": "123 User Street",
      "city": "Casablanca",
      "postalCode": "20000",
      "country": "Morocco",
      "phone": "+212661234567"
    }
  }
}
```

#### PUT `/users/profile`
Update user profile.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+212661234567",
  "profile": {
    "address": "123 New Address",
    "city": "Rabat",
    "postalCode": "10000"
  }
}
```

## Error Responses

All API endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (resource already exists)
- `500` - Internal Server Error

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute per IP
- **General API endpoints**: 100 requests per minute per user
- **File upload endpoints**: 10 requests per minute per user

## Data Types

### User Roles
- `USER` - Regular customer
- `DRIVER` - Truck driver
- `ADMIN` - System administrator
- `COMPANY` - Company representative

### Truck Status
- `AVAILABLE` - Available for assignment
- `IN_TRANSIT` - Currently on a delivery
- `MAINTENANCE` - Under maintenance
- `OUT_OF_SERVICE` - Not operational

### Shipment Status
- `PENDING` - Waiting for confirmation
- `CONFIRMED` - Confirmed and ready for pickup
- `IN_TRANSIT` - Being transported
- `DELIVERED` - Successfully delivered
- `CANCELLED` - Cancelled by customer or admin

### Fuel Types
- `DIESEL` - Diesel fuel
- `GASOLINE` - Gasoline fuel
- `ELECTRIC` - Electric vehicle
- `HYBRID` - Hybrid vehicle

## Webhooks

The platform supports webhooks for real-time notifications:

### Shipment Status Updates
```json
{
  "event": "shipment.status_changed",
  "data": {
    "shipmentId": "shipment_id",
    "trackingNumber": "MT-2024-001",
    "oldStatus": "IN_TRANSIT",
    "newStatus": "DELIVERED",
    "timestamp": "2024-01-15T10:00:00Z"
  }
}
```

## SDK and Libraries

- **JavaScript/TypeScript**: Coming soon
- **Python**: Coming soon
- **PHP**: Coming soon

## Support

For API support and questions:
- Email: api-support@maroctransit.ma
- Documentation: https://docs.maroctransit.ma
- Status Page: https://status.maroctransit.ma
