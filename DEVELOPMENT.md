# Morocco Transport Platform - Development Setup

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL 12+
- Redis 6+
- Docker & Docker Compose (optional)
- Git

## Quick Start

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/Habib9612/morocco-transport.git
cd morocco-transport
npm install
```

### 2. Environment Setup

```bash
# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your actual values
nano .env.local
```

### 3. Database Setup

```bash
# Start PostgreSQL and Redis (if using Docker)
docker-compose up postgres redis -d

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Docker Development

For a complete Docker setup:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Testing

### Unit Tests
```bash
npm run test           # Run once
npm run test:watch     # Watch mode
npm run test:coverage  # With coverage
```

### E2E Tests
```bash
npm run test:e2e       # Run E2E tests
npm run test:e2e:ui    # Run with UI
```

## Database Commands

```bash
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema changes
npm run db:migrate     # Create and run migration
npm run db:reset       # Reset database
npm run db:seed        # Seed with sample data
```

## Project Structure

```
morocco-transport/
├── app/                    # Next.js 13+ App Router
│   ├── api/               # API routes
│   ├── (auth)/            # Auth pages
│   ├── dashboard/         # Dashboard pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
├── lib/                   # Utility functions
├── prisma/               # Database schema & migrations
├── __tests__/            # Unit tests
├── e2e/                  # E2E tests
├── public/               # Static assets
└── styles/               # Additional styles
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

### Transport
- `GET /api/transport/trucks` - List trucks
- `POST /api/transport/trucks` - Create truck
- `GET /api/transport/shipments` - List shipments
- `POST /api/transport/shipments` - Create shipment

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for formatting
- Write tests for new features

### Database
- Use Prisma for database operations
- Create migrations for schema changes
- Use transactions for multi-step operations

### Security
- Validate all inputs
- Use JWT for authentication
- Sanitize user data
- Implement rate limiting

### Performance
- Use React.memo for expensive components
- Implement proper loading states
- Use React Query for data fetching
- Optimize images and assets

## Troubleshooting

### Common Issues

1. **Database connection failed**
   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env.local
   - Ensure database exists

2. **Prisma client errors**
   - Run `npm run db:generate`
   - Check schema.prisma syntax

3. **Authentication errors**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure user exists and is active

4. **API errors**
   - Check server logs
   - Verify request format
   - Check middleware configuration

### Debugging

```bash
# Database queries
DEBUG="prisma:query" npm run dev

# All debug info
DEBUG="*" npm run dev

# Docker logs
docker-compose logs -f [service-name]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## Support

For issues and questions:
- Check existing GitHub issues
- Create a new issue with details
- Follow the issue template
