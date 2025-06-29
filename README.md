# 🚛 MarocTransit - Morocco's Premier Transport Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.0-green?style=flat-square&logo=spring)](https://spring.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org/)

<div align="center">
  <h3>🚛 Built with ❤️ for Morocco's Transport Industry</h3>
  <p>Connect Shippers with Carriers Instantly</p>
</div>

## 🌟 Overview

MarocTransit is a comprehensive logistics and transportation management platform designed specifically for Morocco's transport industry. Our platform leverages advanced AI algorithms to intelligently match carriers with shippers, optimizing transportation efficiency and reducing costs across the supply chain.

### 🎯 Key Features

- **🤖 AI-Powered Matching** - Intelligent carrier-shipper pairing based on multiple factors
- **📊 Real-time Analytics** - Live dashboard with performance metrics and insights
- **🚚 Fleet Management** - Complete truck and driver management system
- **📦 Shipment Tracking** - End-to-end shipment lifecycle management
- **🔐 Secure Authentication** - JWT-based authentication with role-based access
- **📱 Responsive Design** - Modern UI optimized for all devices
- **🌍 Multi-language** - Support for Arabic, French, and English
- **🔔 Real-time Notifications** - Instant updates and alerts

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 18+ (`node --version`)
- npm (`npm --version`)
- Java 17+ (`java --version`)
- Maven (`mvn --version`)

### Automated Deployment
```bash
# Clone the repository
git clone https://github.com/Habib9612/morocco-transport.git
cd morocco-transport
git checkout production-ready

# Run automated setup
chmod +x scripts/deploy-local.sh
./scripts/deploy-local.sh

# Start the application
npm run dev
```

### Manual Deployment
```bash
# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local

# Setup database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

### Access Your Platform
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080

## 🔧 Troubleshooting

### Quick Fix Script
```bash
# Run automated error fixing
./scripts/fix-errors.sh

# Or fix specific issues
./scripts/fix-errors.sh --ports    # Fix port conflicts
./scripts/fix-errors.sh --node     # Fix Node.js issues
./scripts/fix-errors.sh --prisma   # Fix database issues
```

### Common Issues
- **Port conflicts**: `lsof -ti:3000 | xargs kill -9`
- **Database issues**: `npx prisma db push --force-reset`
- **Build errors**: `npm run build`

For detailed troubleshooting, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 🏗️ Architecture

### Frontend Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (100% type coverage)
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API
- **Authentication**: JWT-based with custom context
- **Real-time**: WebSocket integration for live updates

### Backend Stack
- **Framework**: Spring Boot (Java 17)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with Spring Security
- **API**: RESTful endpoints with proper error handling
- **Documentation**: OpenAPI/Swagger integration

## 📁 Project Structure

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
│   ├── landing/                  # Landing page components
│   ├── dashboard/                # Dashboard-specific components
│   ├── forms/                    # Form components
│   ├── tables/                   # Data table components
│   ├── charts/                   # Chart and visualization components
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
├── backend/                      # Spring Boot backend
│   ├── src/main/java/com/marocotransport/
│   │   ├── controller/           # REST API controllers
│   │   ├── service/              # Business logic layer
│   │   ├── repository/           # Data access layer
│   │   ├── entity/               # JPA entities
│   │   ├── dto/                  # Data Transfer Objects
│   │   ├── security/             # Security configuration
│   │   └── config/               # Application configuration
│   └── pom.xml                   # Maven dependencies
└── scripts/                      # Database setup scripts
    ├── 01-create-tables.sql      # Schema creation
    └── 02-seed-data.sql          # Initial data seeding
```

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

## 📚 Documentation

- **[Quick Start Guide](QUICK_START.md)** - Get started in 5 minutes
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Detailed deployment instructions
- **[API Documentation](API_DOCUMENTATION.md)** - Complete API reference
- **[Project Summary](PROJECT_SUMMARY.md)** - Technical overview

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
