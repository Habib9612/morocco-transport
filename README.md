# 🚛 MarocTransit - Morocco's Premier Transport Platform

A comprehensive logistics and transportation management platform built with Next.js, TypeScript, and Spring Boot.

## 🎯 Features

- **🔐 Real Authentication** - JWT-based authentication with user management
- **📊 Live Dashboard** - Real-time analytics and shipment tracking
- **🚚 Fleet Management** - Complete truck and driver management system
- **📦 Shipment Tracking** - End-to-end shipment lifecycle management
- **🤖 AI Integration** - Route optimization and intelligent matching
- **📱 Responsive Design** - Modern UI with mobile-first approach
- **🌍 Multi-language** - Internationalization support
- **🔔 Real-time Notifications** - Instant updates and alerts

## 🏗️ Architecture

### Frontend (Next.js 14 + TypeScript)
```
morocco-transport-2/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── shipments/            # Shipment management
│   │   ├── trucks/               # Fleet management
│   │   ├── analytics/            # Business analytics
│   │   ├── notifications/        # Real-time notifications
│   │   └── users/                # User management
│   ├── actions/                  # Server Actions
│   │   ├── auth.ts               # Authentication logic
│   │   ├── shipments.ts          # Shipment operations
│   │   ├── trucks.ts             # Fleet operations
│   │   └── analytics.ts          # Analytics processing
│   ├── dashboard/                # Protected dashboard pages
│   │   ├── analytics/            # Analytics dashboard
│   │   ├── shipments/            # Shipment management
│   │   ├── trucks/               # Fleet management
│   │   └── messages/             # Communication center
│   ├── login/                    # Authentication pages
│   ├── signup/                   # User registration
│   └── layout.tsx                # Root layout with AuthProvider
├── components/                   # Reusable UI components
│   ├── ui/                       # Base UI components (shadcn/ui)
│   ├── dashboard/                # Dashboard-specific components
│   └── admin/                    # Admin panel components
├── lib/                          # Core libraries and utilities
│   ├── api-client.ts             # API client for backend communication
│   ├── auth-context.tsx          # Authentication context provider
│   ├── hooks/                    # Custom React hooks
│   │   └── use-dashboard-data.ts # Data fetching hooks
│   └── utils.ts                  # Utility functions
├── prisma/                       # Database schema and migrations
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
└── scripts/                      # Database setup scripts
    ├── 01-create-tables.sql      # Schema creation
    └── 02-seed-data.sql          # Initial data seeding
```

### Backend (Spring Boot + Java)
```
backend/
├── src/main/java/com/marocotransport/
│   ├── controller/               # REST API controllers
│   │   ├── AuthController.java   # Authentication endpoints
│   │   ├── UserController.java   # User management
│   │   ├── ShipmentController.java # Shipment operations
│   │   └── TruckController.java  # Fleet management
│   ├── service/                  # Business logic layer
│   │   ├── UserService.java      # User operations
│   │   ├── ShipmentService.java  # Shipment logic
│   │   └── TruckService.java     # Fleet operations
│   ├── repository/               # Data access layer
│   │   ├── UserRepository.java   # User data access
│   │   ├── ShipmentRepository.java # Shipment data access
│   │   └── TruckRepository.java  # Fleet data access
│   ├── entity/                   # JPA entities
│   │   ├── User.java             # User entity
│   │   ├── Shipment.java         # Shipment entity
│   │   └── Truck.java            # Truck entity
│   ├── dto/                      # Data Transfer Objects
│   │   ├── ApiResponse.java      # Standard API responses
│   │   └── LoginRequest.java     # Authentication DTOs
│   ├── security/                 # Security configuration
│   │   ├── JwtTokenProvider.java # JWT token management
│   │   └── SecurityConfig.java   # Security configuration
│   └── config/                   # Application configuration
└── pom.xml                       # Maven dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Java 17+ and Maven
- PostgreSQL (or SQLite for development)

### 1. Clone and Setup
```bash
git clone https://github.com/Habib9612/morocco-transport.git
cd morocco-transport
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Set up database
npx prisma generate
npx prisma db push

# Run database scripts
psql -d your_database -f scripts/01-create-tables.sql
psql -d your_database -f scripts/02-seed-data.sql

# Start development server
npm run dev
```

### 3. Backend Setup
```bash
cd backend

# Install dependencies
mvn clean install

# Start Spring Boot server
mvn spring-boot:run
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Database: Configured in `.env.local`

## 🔧 Environment Configuration

Create `.env.local` with the following variables:

```bash
# Database
DATABASE_URL="file:./dev.db"

# Authentication
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# API Configuration
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
NEXT_PUBLIC_WEBSOCKET_URL="ws://localhost:3001"

# External Services
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-key"

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# JWT Secret
JWT_SECRET="your-jwt-secret-key"
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Shipments
- `GET /api/shipments` - List all shipments
- `POST /api/shipments` - Create new shipment
- `GET /api/shipments/:id` - Get shipment details
- `PUT /api/shipments/:id` - Update shipment
- `DELETE /api/shipments/:id` - Delete shipment
- `GET /api/shipments/:id/tracking` - Get tracking info

### Analytics
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/shipments` - Shipment analytics
- `GET /api/analytics/revenue` - Revenue analytics

### Notifications
- `GET /api/notifications` - List notifications
- `PUT /api/notifications/:id` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read

## 🧪 Testing

```bash
# Frontend tests
npm test

# Backend tests
cd backend
mvn test

# E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Backend (Docker)
```bash
cd backend
docker build -t marocotransport-backend .
docker run -p 8080:8080 marocotransport-backend
```

## 📝 Development

### Code Structure
- **Frontend**: Next.js with TypeScript, Tailwind CSS, and shadcn/ui
- **Backend**: Spring Boot with JPA, JWT authentication, and REST APIs
- **Database**: Prisma ORM with PostgreSQL/SQLite
- **State Management**: React Context for authentication and global state

### Key Features Implemented
- ✅ Real authentication with JWT tokens
- ✅ Live dashboard with real-time data
- ✅ Complete CRUD operations for all entities
- ✅ Responsive design with modern UI
- ✅ Error handling and loading states
- ✅ Type-safe API communication
- ✅ Database migrations and seeding

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@marocotransport.com or create an issue in this repository.

---

**Built with ❤️ for Morocco's logistics industry**
