# 🚀 MarocTransit Platform - Local Deployment Guide

## 📋 Prerequisites

Before starting, ensure you have the following installed:

### Required Software
- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **Java** (v17 or higher)
- **Maven** (v3.6 or higher)
- **PostgreSQL** (v13 or higher) - or SQLite for development
- **Git**

### Verify Installations
```bash
# Check Node.js
node --version
npm --version

# Check Java
java --version
mvn --version

# Check Git
git --version

# Check PostgreSQL (if using)
psql --version
```

## 🛠️ Step-by-Step Local Deployment

### 1. Clone and Setup Repository

```bash
# Clone the repository
git clone https://github.com/Habib9612/morocco-transport.git
cd morocco-transport

# Checkout the production-ready branch
git checkout production-ready
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Edit environment variables (see Environment Configuration section)
nano .env.local
```

### 3. Database Setup

#### Option A: SQLite (Development - Recommended for quick start)
```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Run database scripts
npm run db:seed
```

#### Option B: PostgreSQL (Production)
```bash
# Create database
createdb marocotransport

# Update DATABASE_URL in .env.local
DATABASE_URL="postgresql://username:password@localhost:5432/marocotransport"

# Generate and push schema
npx prisma generate
npx prisma db push

# Run database scripts
psql -d marocotransport -f scripts/01-create-tables.sql
psql -d marocotransport -f scripts/02-seed-data.sql
```

### 4. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Maven dependencies
mvn clean install

# Start Spring Boot server
mvn spring-boot:run
```

### 5. Start Frontend Development Server

```bash
# In a new terminal, from project root
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: Configured in `.env.local`

## 🔧 Environment Configuration

Create `.env.local` with the following configuration:

```bash
# ========================================
# MarocTransit Environment Configuration
# ========================================

# Database Configuration
DATABASE_URL="file:./dev.db"
# For PostgreSQL: "postgresql://username:password@localhost:5432/marocotransport"

# Authentication & Security
NEXTAUTH_SECRET="your-super-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="your-jwt-secret-key-change-in-production"

# API Configuration
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
NEXT_PUBLIC_WEBSOCKET_URL="ws://localhost:3001"

# External Services (Optional for local development)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"

# Email Configuration (Optional for local development)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Development Settings
NODE_ENV="development"
NEXT_PUBLIC_DEBUG="true"
NEXT_PUBLIC_LOG_LEVEL="debug"

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_MATCHING="true"
NEXT_PUBLIC_ENABLE_REAL_TIME_TRACKING="true"

# Regional Settings
NEXT_PUBLIC_DEFAULT_LOCALE="en"
NEXT_PUBLIC_SUPPORTED_LOCALES="en,ar,fr"
NEXT_PUBLIC_DEFAULT_CURRENCY="MAD"
NEXT_PUBLIC_TIMEZONE="Africa/Casablanca"
```

## 🚨 Common Issues and Solutions

### Issue 1: Node.js Version Error
```bash
# Error: Node.js version not supported
# Solution: Update Node.js
nvm install 18
nvm use 18
```

### Issue 2: Port Already in Use
```bash
# Error: Port 3000 or 8080 already in use
# Solution: Kill processes or use different ports

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 8080
lsof -ti:8080 | xargs kill -9

# Or use different ports
npm run dev -- -p 3001
```

### Issue 3: Database Connection Error
```bash
# Error: Database connection failed
# Solution: Check database configuration

# For SQLite
npx prisma db push --force-reset

# For PostgreSQL
# Check if PostgreSQL is running
brew services start postgresql  # macOS
sudo systemctl start postgresql  # Linux
```

### Issue 4: Maven Dependencies Error
```bash
# Error: Maven dependencies not found
# Solution: Clean and reinstall
cd backend
mvn clean
mvn install -DskipTests
```

### Issue 5: Prisma Client Error
```bash
# Error: Prisma client not generated
# Solution: Regenerate client
npx prisma generate
npx prisma db push
```

### Issue 6: TypeScript Compilation Error
```bash
# Error: TypeScript compilation failed
# Solution: Check types and rebuild
npm run build
npm run dev
```

### Issue 7: Authentication Error
```bash
# Error: JWT token issues
# Solution: Check environment variables
# Ensure NEXTAUTH_SECRET and JWT_SECRET are set
echo $NEXTAUTH_SECRET
echo $JWT_SECRET
```

## 🧪 Testing the Deployment

### 1. Frontend Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### 2. Backend Tests
```bash
cd backend
mvn test
```

### 3. E2E Tests
```bash
npm run test:e2e
```

### 4. Manual Testing Checklist

- [ ] **Landing Page**: http://localhost:3000 loads correctly
- [ ] **Authentication**: Sign up and login work
- [ ] **Dashboard**: Dashboard loads with data
- [ ] **API Endpoints**: Backend responds correctly
- [ ] **Database**: Data is saved and retrieved
- [ ] **Responsive Design**: Works on mobile and desktop

## 📊 Monitoring and Debugging

### Frontend Debugging
```bash
# Check for build errors
npm run build

# Check for linting errors
npm run lint

# Check bundle size
npm run analyze
```

### Backend Debugging
```bash
cd backend
# Check application logs
tail -f logs/application.log

# Check database connection
mvn spring-boot:run -Dspring.profiles.active=dev
```

### Database Debugging
```bash
# Open Prisma Studio
npx prisma studio

# Check database schema
npx prisma db pull

# Reset database (WARNING: Deletes all data)
npx prisma db push --force-reset
```

## 🚀 Production Deployment

### Frontend (Vercel)
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

### Backend (Docker)
```bash
cd backend
# Build Docker image
docker build -t marocotransport-backend .

# Run container
docker run -p 8080:8080 marocotransport-backend
```

### Database (Production)
```bash
# Use PostgreSQL in production
DATABASE_URL="postgresql://username:password@host:5432/marocotransport"

# Run migrations
npx prisma migrate deploy
```

## 📞 Support

If you encounter any issues:

1. **Check the logs** for error messages
2. **Verify environment variables** are set correctly
3. **Ensure all prerequisites** are installed
4. **Check network connectivity** for external services
5. **Create an issue** in the GitHub repository

### Common Support Commands
```bash
# Check system resources
top
df -h
free -h

# Check network connectivity
ping google.com
curl http://localhost:3000

# Check process status
ps aux | grep node
ps aux | grep java
```

---

**Happy Deploying! 🚛✨** 