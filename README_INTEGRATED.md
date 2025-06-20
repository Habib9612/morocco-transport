# MarocTransit - Complete Morocco Transport Platform

## Overview

MarocTransit is a comprehensive transport platform for Morocco that provides real-time information about buses, trains, and other transportation services. The platform features a modern UI with full functionality for both users and administrators.

## Features

### Core Features
- **Real-time Transport Information**: Live updates on bus and train schedules
- **Route Planning**: Intelligent route suggestions and planning
- **Multi-modal Transport**: Support for buses, trains, and other transport modes
- **User Authentication**: Secure login and registration system
- **Admin Dashboard**: Comprehensive administrative interface
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Advanced Features
- **Real-time GPS Tracking**: Live vehicle location tracking
- **Payment Integration**: Secure online payment processing
- **Notifications**: Push notifications for schedule changes and updates
- **Multi-language Support**: Available in multiple languages
- **Offline Mode**: Basic functionality available without internet
- **Analytics Dashboard**: Detailed usage and performance analytics

## Technology Stack

### Frontend
- **React.js**: Modern JavaScript library for building user interfaces
- **Next.js**: React framework for production-ready applications
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for smooth interactions

### Backend
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Web application framework for Node.js
- **PostgreSQL**: Robust relational database system
- **Redis**: In-memory data structure store for caching
- **JWT**: JSON Web Tokens for secure authentication

### DevOps & Tools
- **Docker**: Containerization platform
- **Docker Compose**: Multi-container Docker applications
- **Git**: Version control system
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js 18+** and npm/yarn/pnpm
- **PostgreSQL 12+**
- **Redis 6+**
- **Docker & Docker Compose** (optional but recommended)
- **Git**

## Quick Start

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/Habib9612/morocco-transport.git
cd morocco-transport
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/morocco_transport
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# API Configuration
API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# External Services
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
PAYMENT_GATEWAY_KEY=your-payment-gateway-key
```

### 3. Database Setup

```bash
# Start PostgreSQL and Redis (if using Docker)
docker-compose up -d postgres redis

# Run database migrations
npm run db:migrate

# Seed the database with initial data
npm run db:seed
```

### 4. Start Development Server

```bash
# Start the development server
npm run dev

# Or start with Docker
docker-compose up
```

The application will be available at `http://localhost:3000`

## Project Structure

```
morocco-transport/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # Reusable React components
│   ├── pages/            # Application pages
│   └── styles/           # Global styles
├── backend/               # Backend server code
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── utils/            # Utility functions
├── components/            # Shared UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── models/               # Data models
├── pages/                # Next.js pages
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── styles/               # CSS and styling files
├── __tests__/            # Test files
├── e2e/                  # End-to-end tests
├── docker-compose.yml    # Docker configuration
├── Dockerfile           # Docker image configuration
├── package.json         # Project dependencies
└── README.md            # Project documentation
```

## Development Setup

### Database Configuration

1. **PostgreSQL Setup**:
   ```bash
   # Create database
   createdb morocco_transport
   
   # Run migrations
   npx prisma migrate dev
   
   # Generate Prisma client
   npx prisma generate
   ```

2. **Redis Setup**:
   ```bash
   # Start Redis server
   redis-server
   
   # Or using Docker
   docker run -d -p 6379:6379 redis:alpine
   ```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:reset     # Reset database

# Testing
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run test:watch   # Run tests in watch mode

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier

# Docker
npm run docker:build # Build Docker image
npm run docker:up    # Start with Docker Compose
npm run docker:down  # Stop Docker containers
```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+212600000000"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "jwt-token"
}
```

#### POST /api/auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Transport Endpoints

#### GET /api/routes
Get all available transport routes.

**Query Parameters:**
- `from` (string): Origin city
- `to` (string): Destination city
- `date` (string): Travel date (YYYY-MM-DD)
- `type` (string): Transport type (bus, train, etc.)

#### GET /api/schedules
Get transport schedules for specific routes.

#### POST /api/bookings
Create a new booking.

**Request Body:**
```json
{
  "routeId": "route-id",
  "scheduleId": "schedule-id",
  "passengers": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "age": 30
    }
  ],
  "paymentMethod": "card"
}
```

## Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.js
```

### End-to-End Tests

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests in headed mode
npm run test:e2e:headed
```

## Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build Docker image
docker build -t morocco-transport .

# Run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL=your-production-database-url
REDIS_URL=your-production-redis-url
JWT_SECRET=your-production-jwt-secret
GOOGLE_MAPS_API_KEY=your-production-maps-key
```

## Contributing

We welcome contributions to MarocTransit! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and add tests
4. **Run tests** to ensure everything works:
   ```bash
   npm test
   npm run test:e2e
   ```
5. **Commit your changes**:
   ```bash
   git commit -m "Add: your feature description"
   ```
6. **Push to your fork** and create a pull request

### Code Style

- Follow the existing code style
- Use TypeScript for type safety
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

### Pull Request Process

1. Ensure your code passes all tests
2. Update the README if needed
3. Add a clear description of your changes
4. Link any related issues
5. Request review from maintainers

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

- **GitHub Issues**: [Create an issue](https://github.com/Habib9612/morocco-transport/issues)
- **Email**: support@maroctransit.com
- **Documentation**: [Full documentation](https://docs.maroctransit.com)

## Acknowledgments

- Thanks to all contributors who have helped build this platform
- Special thanks to the Morocco transport authorities for their support
- Built with ❤️ for the Morocco transport community

---

**MarocTransit** - Making transportation in Morocco more accessible and efficient.      
