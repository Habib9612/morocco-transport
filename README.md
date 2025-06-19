# 🚛 MarocTransit - Morocco Transport Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?style=flat-square&logo=prisma)]

[![Build Status](https://img.shields.io/github/workflow/status/Habib9612/morocco-transport/CI?style=flat-square&logo=github)](https://github.com/Habib9612/morocco-transport/actions)
[![Code Coverage](https://img.shields.io/codecov/c/github/Habib9612/morocco-transport?style=flat-square&logo=codecov)](https://codecov.io/gh/Habib9612/morocco-transport)
[![Version](https://img.shields.io/github/package-json/v/Habib9612/morocco-transport?style=flat-square&logo=npm)](https://github.com/Habib9612/morocco-transport/releases)
[![License](https://img.shields.io/github/license/Habib9612/morocco-transport?style=flat-square)](https://github.com/Habib9612/morocco-transport/blob/main/LICENSE)
[![Contributors](https://img.shields.io/github/contributors/Habib9612/morocco-transport?style=flat-square&logo=github)](https://github.com/Habib9612/morocco-transport/graphs/contributors)
[![Stars](https://img.shields.io/github/stars/Habib9612/morocco-transport?style=flat-square&logo=github)](https://github.com/Habib9612/morocco-transport/stargazers)
[![Forks](https://img.shields.io/github/forks/Habib9612/morocco-transport?style=flat-square&logo=github)](https://github.com/Habib9612/morocco-transport/network/members)
[![Issues](https://img.shields.io/github/issues/Habib9612/morocco-transport?style=flat-square&logo=github)](https://github.com/Habib9612/morocco-transport/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/Habib9612/morocco-transport?style=flat-square&logo=github)](https://github.com/Habib9612/morocco-transport/pulls)
[![Last Commit](https://img.shields.io/github/last-commit/Habib9612/morocco-transport?style=flat-square&logo=github)](https://github.com/Habib9612/morocco-transport/commits/main)(https://www.prisma.io/)

<div align="center">
  <h3> Built with ❤️ for Morocco's Transport Industry </h3>
  <p>Connect Shippers with Carriers Instantly</p>
</div>

## 🌟 Overview

MarocTransit is a cutting-edge transport platform designed specifically for Morocco's logistics and transportation needs. Our platform streamlines the connection between shippers and carriers, providing an efficient, secure, and user-friendly solution for managing transportation services across Morocco.

## ✨ Platform Features

### 🔐 **Authentication & Security**
- **Secure User Registration** - Multi-step signup process with email verification
- **Advanced Login System** - Protected access with session management
- **Password Recovery** - Secure password reset functionality
- **Role-Based Access Control** - Different permissions for shippers, carriers, and admins

### 📊 **Comprehensive Dashboard**
- **Real-time Analytics** - Track shipments, revenue, and performance metrics
- **Interactive Maps** - Live tracking of vehicles and shipments
- **Custom Settings** - Personalized user preferences and configurations
- **Notification Center** - Real-time alerts and updates

### 🚚 **Shipment Management**
- **Smart Shipment Creation** - Intuitive interface for booking transport services
- **Live Tracking** - Real-time GPS tracking of all shipments
- **Status Updates** - Automatic notifications at every stage
- **Digital Documentation** - Paperless receipt and delivery confirmations
- **Route Optimization** - AI-powered route planning for efficiency

### 👥 **Driver & Carrier Management**
- **Driver Profiles** - Comprehensive driver information and ratings
- **Vehicle Management** - Fleet tracking and maintenance schedules
- **Performance Analytics** - Driver performance metrics and insights
- **Document Management** - Digital storage of licenses and certifications

### 💬 **Communication Hub**
- **In-app Messaging** - Direct communication between all parties
- **Push Notifications** - Instant alerts for important updates
- **Customer Support** - 24/7 integrated support system
- **Multilingual Support** - Arabic, French, and English interfaces

### 📍 **Location Services**
- **Morocco-Wide Coverage** - Services across all major Moroccan cities
- **Smart Routing** - Optimal route calculations considering traffic and road conditions
- **Geofencing** - Location-based alerts and automated status updates
- **Nearby Services** - Find carriers and services in your area

### 💰 **Financial Management**
- **Transparent Pricing** - Clear, upfront pricing with no hidden fees
- **Multiple Payment Options** - Cash, card, and digital wallet support
- **Invoicing System** - Automated invoice generation and management
- **Financial Reports** - Detailed earning and expense tracking

### 📱 **Mobile-First Design**
- **Responsive Interface** - Optimized for desktop, tablet, and mobile
- **Progressive Web App** - App-like experience on any device
- **Offline Capabilities** - Key features work without internet connection
- **Touch-Optimized** - Intuitive touch interfaces for mobile users

## 🛠 Technical Stack

- **Frontend**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for modern, responsive design
- **Database**: Prisma ORM with PostgreSQL
- **Authentication**: NextAuth.js with JWT tokens
- **Testing**: Jest with comprehensive test coverage
- **Code Quality**: ESLint and Prettier for consistent code
- **Deployment**: Vercel with automatic CI/CD

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Habib9612/morocco-transport.git
   cd morocco-transport
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables:
   ```
   DATABASE_URL="your-postgresql-connection-string"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
morocco-transport/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── shipments/          # Shipment management APIs
│   │   └── drivers/            # Driver management APIs
│   ├── dashboard/              # Dashboard pages
│   │   ├── settings/           # User settings
│   │   ├── shipments/          # Shipment management
│   │   ├── messages/           # Communication center
│   │   └── locations/          # Location services
│   ├── auth/                   # Authentication pages
│   └── components/             # Reusable UI components
├── lib/                        # Utility functions
├── models/                     # Database models
├── middleware.ts               # Next.js middleware
├── prisma/                     # Database schema
└── public/                     # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

## 🌍 Supported Regions

MarocTransit currently serves major Moroccan cities including:
- **Casablanca** - Economic capital and port city
- **Rabat** - National capital
- **Marrakech** - Tourist and cultural hub
- **Fez** - Historical and cultural center
- **Tangier** - Northern gateway to Europe
- **Agadir** - Atlantic coast and agriculture
- **Meknes** - Central Morocco
- **Oujda** - Eastern border region

## 📞 Support & Contact

- **Website**: [maroctransit.com](https://maroctransit.com)
- **Documentation**: [docs.maroctransit.com](https://docs.maroctransit.com)
- **API Reference**: [api.maroctransit.com](https://api.maroctransit.com)
- **Email**: support@maroctransit.com
- **Slack Channel**: Join our community for real-time support

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Prisma Team** - For the excellent database toolkit
- **Tailwind CSS** - For the utility-first CSS framework
- **Vercel** - For seamless deployment and hosting
- **Morocco's Transport Community** - For inspiration and feedback

## 🔮 Roadmap

- [ ] **Mobile Apps** - Native iOS and Android applications
- [ ] **AI-Powered Matching** - Smart carrier-shipper pairing
- [ ] **IoT Integration** - Real-time vehicle telemetry
- [ ] **Blockchain Integration** - Transparent and secure transactions
- [ ] **Multi-Country Expansion** - Extend to other North African countries
- [ ] **Advanced Analytics** 

## 📸 Screenshots

*Coming Soon! We're preparing beautiful screenshots to showcase the MarocTransit platform.*

### Dashboard Overview
![Dashboard Screenshot](docs/images/dashboard-preview.png)
*Main dashboard showing real-time analytics and shipment overview*

### Shipment Tracking
![Tracking Screenshot](docs/images/tracking-preview.png)
*Live shipment tracking with interactive map and status updates*

### User Management
![User Management Screenshot](docs/images/users-preview.png)
*Comprehensive user management interface for admins*

---

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Go to your Vercel dashboard
   - Navigate to Project Settings > Environment Variables
   - Add all variables from your `.env.example` file

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm run start
   ```

### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t maroctransit .
   ```

2. **Run container**
   ```bash
   docker run -p 3000:3000 --env-file .env.local maroctransit
   ```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production database
- [ ] Set up SSL certificates
- [ ] Configure CDN for static assets
- [ ] Set up monitoring and logging
- [ ] Configure backup strategies

---

## 📚 API Documentation

### Authentication Endpoints

```http
POST /api/auth/signin
POST /api/auth/signup
POST /api/auth/signout
GET  /api/auth/session
```

### Shipment Management

```http
GET    /api/shipments              # Get all shipments
POST   /api/shipments              # Create new shipment
GET    /api/shipments/:id          # Get shipment by ID
PUT    /api/shipments/:id          # Update shipment
DELETE /api/shipments/:id          # Delete shipment
GET    /api/shipments/:id/tracking # Get tracking info
```

### User Management

```http
GET    /api/users                  # Get all users (admin only)
GET    /api/users/:id              # Get user by ID
PUT    /api/users/:id              # Update user profile
DELETE /api/users/:id              # Delete user (admin only)
```

### Company Management

```http
GET    /api/companies              # Get all companies
POST   /api/companies              # Create new company
GET    /api/companies/:id          # Get company by ID
PUT    /api/companies/:id          # Update company
DELETE /api/companies/:id          # Delete company
```

### Response Format

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Error Handling

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": []
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**📖 Full API documentation is available at:** [api.maroctransit.com](https://api.maroctransit.com)

---

## ❓ Troubleshooting & FAQ

### Common Issues

#### "Database connection failed"
**Solution:** 
1. Check your `DATABASE_URL` in `.env.local`
2. Ensure PostgreSQL is running
3. Verify database credentials
4. Run `npx prisma db push` to sync schema

#### "NextAuth configuration error"
**Solution:**
1. Verify `NEXTAUTH_SECRET` is set
2. Check `NEXTAUTH_URL` matches your domain
3. Ensure OAuth provider credentials are correct

#### "Build fails with TypeScript errors"
**Solution:**
1. Run `npm run type-check` to identify issues
2. Update TypeScript with `npm install typescript@latest`
3. Clear `.next` folder and rebuild

#### "Slow page loading"
**Solution:**
1. Enable Redis caching in production
2. Optimize database queries
3. Use CDN for static assets
4. Enable compression middleware

### Frequently Asked Questions

**Q: How do I add a new transport company?**
A: Navigate to Admin Panel > Companies > Add New Company. Fill in the required details and verify the company information.

**Q: Can I customize the platform for different regions?**
A: Yes! The platform supports multi-language and multi-currency configurations. Check the environment variables section.

**Q: How do I enable real-time tracking?**
A: Set `ENABLE_REAL_TIME_TRACKING=true` in your environment variables and configure the Maps API keys.

**Q: What payment methods are supported?**
A: We support Stripe, PayPal, and local Moroccan payment methods (CMI). Configure the respective API keys in your environment.

**Q: How do I backup my data?**
A: Use the built-in backup scripts: `npm run backup:db` for database backup and configure automated backups in your hosting environment.

### Performance Tips

- ⚡ Use Redis for session storage in production
- 🗺️ Enable map tile caching for better performance
- 📊 Implement database indexing for frequently queried fields
- 🎦 Use Next.js Image optimization for faster loading
- 🔎 Set up monitoring with Sentry for error tracking

### Getting Help

- 📜 Check our [Documentation](https://docs.maroctransit.com)
- 👪 Join our [Community Discord](https://discord.gg/maroctransit)
- 📧 Email support: [support@maroctransit.com](mailto:support@maroctransit.com)
- 🐛 Report bugs: [GitHub Issues](https://github.com/Habib9612/morocco-transport/issues)

---- Machine learning insights and predictions

---

<div align="center">
  <p>Made with ❤️ in Morocco 🇲🇦</p>
  <p>© 2024 MarocTransit. All rights reserved.</p>
</div> 🚛 MarocTransit - Morocco Transport Platform

<div align="center">

![MarocTransit Logo](https://img.shields.io/badge/MarocTransit-Transport%20Platform-blue?style=for-the-badge&logo=truck)

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-89.4%25-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?style=flat-square&logo=prisma)](https://prisma.io/)

**Connect Shippers with Carriers Instantly**

</div>

## 🌟 Overview

MarocTransit is a cutting-edge transport platform designed specifically for Morocco's logistics landscape. Our platform leverages advanced machine learning algorithms to intelligently match carriers with shippers, optimizing transportation efficiency and reducing costs across the supply chain.

The platform implements sophisticated matching algorithms that consider multiple factors including load size compatibility, route preferences, historical reliability metrics, and cost efficiency to predict successful transport partnerships.

## 🎯 Key Features

### 🤖 Intelligent Matching Algorithms
- **Multi-factor Analysis**: Matches carriers and shippers based on:
  - Load size compatibility
  - Route/location preferences
  - Historical reliability metrics
  - Cost efficiency optimization

### 🔧 Technical Capabilities
- **RESTful API Interfaces**: Seamless integration with frontend and backend services
- **Batch Processing**: Support for bulk matching operations
- **Real-time Updates**: Model retraining capability as new data becomes available
- **Advanced Analytics**: Comprehensive reporting and insights dashboard

### 🌐 Modern Web Application
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Communication**: WebSocket integration for live updates
- **User Authentication**: Secure login and user management system
- **Interactive Dashboard**: Comprehensive control panel for carriers and shippers

## 🏗 Architecture

### Frontend
- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Context API with custom hooks
- **Real-time Features**: WebSocket integration for live notifications

### Backend
- **API**: RESTful services with Next.js API routes
- **Database**: Prisma ORM for database management
- **Authentication**: JWT-based secure authentication
- **File Processing**: Support for various document formats

### Machine Learning
- **Algorithm**: Gradient boosting implementation
- **Data Processing**: Multi-criteria decision analysis
- **Performance Tracking**: Success rate optimization
- **Continuous Learning**: Model updates based on new transport data

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Habib9612/morocco-transport.git
cd morocco-transport
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment Setup**
```bash
cp .env.example .env.local
# Configure your environment variables

   > **Important:** Make sure to update the `.env.local` file with your actual values. See the `.env.example` file for all required variables.

   **Required Environment Variables:**
   ```env
   # Database (Required)
   DATABASE_URL=postgresql://username:password@localhost:5432/maroc_transit
   
   # Authentication (Required)
   NEXTAUTH_SECRET=your-super-secret-32-character-string
   NEXTAUTH_URL=http://localhost:3000
   
   # JWT (Required)
   JWT_SECRET=another-secret-for-jwt-tokens
   ```

   **Optional Environment Variables:**
   ```env
   # OAuth Providers (Optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Email Service (Optional)
   EMAIL_SERVER=smtp://user:pass@mail.example.com:587
   EMAIL_FROM=noreply@maroctransit.com
   
   # Third-party Services (Optional)
   MAPS_API_KEY=your-google-maps-api-key
   SENTRY_DSN=your-sentry-dsn-for-error-tracking
   ```

```

4. **Database Setup**
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
morocco-transport/
├── 📱 app/                 # Next.js 14 App Router
├── 🧩 components/          # Reusable React components
├── 🎣 hooks/              # Custom React hooks
├── 📚 lib/                # Utility functions and configurations
├── 🗄️ models/             # Database models and schemas
├── 📄 pages/              # Additional pages and API routes
├── 🗃️ prisma/             # Database schema and migrations
├── 🎨 styles/             # Global styles and Tailwind config
├── 🧪 __tests__/          # Test files and test utilities
├── 📋 jest.config.js      # Jest testing configuration
├── 📝 tsconfig.json       # TypeScript configuration
└── 📦 package.json        # Dependencies and scripts
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci

# Run tests in watch mode
npm run test:watch
```

### Test Coverage
The project maintains comprehensive test coverage including:
- Unit tests for utilities and components
- Integration tests for API endpoints
- End-to-end tests for critical user journeys

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests
- `npm run test:coverage` - Run tests with coverage report

## 📊 Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | Next.js 14, React 18, TypeScript | Modern web application framework |
| **Styling** | Tailwind CSS, PostCSS | Responsive and utility-first CSS |
| **Database** | Prisma, PostgreSQL | Type-safe database access |
| **Testing** | Jest, React Testing Library | Comprehensive testing suite |
| **DevOps** | Docker, ESLint, Prettier | Development and deployment tools |
| **Authentication** | JWT, NextAuth.js | Secure user authentication |
| **Real-time** | WebSocket, Socket.io | Live updates and notifications |

## 🤝 Contributing

We welcome contributions to MarocTransit! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests for new features
- Ensure code passes all linting checks
- Update documentation for significant changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



## 📸 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Shipment Tracking
![Shipment Tracking](screenshots/shipment-tracking.png)

### User Management
![User Management](screenshots/user-management.png)

> **Note:** Screenshots will be added in future updates. For now, please refer to the live demo.

---

## 🚀 Deployment

### Deploying to Vercel

1. **Fork this repository**

2. **Connect to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Import your forked repository
   - Configure environment variables

3. **Environment Variables Required:**
   ```
   DATABASE_URL=your_postgresql_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   JWT_SECRET=your_jwt_secret
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live!

### Manual Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

### Docker Deployment

1. **Build the Docker image:**
   ```bash
   docker build -t maroc-transit .
   ```

2. **Run the container:**
   ```bash
   docker run -p 3000:3000 --env-file .env.local maroc-transit
   ```

---

## 📚 API Documentation

### Quick API Reference

The application provides several API endpoints for managing transport operations:

#### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `POST /api/auth/signup` - User registration

#### Shipments
- `GET /api/shipments` - List all shipments
- `POST /api/shipments` - Create new shipment
- `GET /api/shipments/[id]` - Get shipment details
- `PUT /api/shipments/[id]` - Update shipment
- `DELETE /api/shipments/[id]` - Delete shipment

#### Users
- `GET /api/users` - List users (admin only)
- `POST /api/users` - Create user (admin only)
- `PUT /api/users/[id]` - Update user

#### Companies
- `GET /api/companies` - List companies
- `POST /api/companies` - Create company
- `PUT /api/companies/[id]` - Update company

> **📖 Full Documentation:** Visit [docs.maroctransit.com](https://docs.maroctransit.com) for complete API documentation.

---

## ❓ Troubleshooting & FAQ

### Common Issues

**Q: I'm getting a database connection error**
A: Ensure your `DATABASE_URL` is correctly formatted and the database is accessible. Check that your PostgreSQL server is running.

**Q: NextAuth is not working**
A: Verify that `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set correctly in your environment variables.

**Q: The application won't start**
A: 
1. Make sure you've copied `.env.example` to `.env.local`
2. Fill in all required environment variables
3. Run `npm install` to ensure all dependencies are installed
4. Check that your Node.js version is 18 or higher

**Q: Prisma migrations are failing**
A: 
1. Ensure your database is accessible
2. Run `npx prisma generate` to generate the Prisma client
3. Run `npx prisma db push` to sync your schema

### Getting Help

- **Issues:** Report bugs or request features on [GitHub Issues](https://github.com/Habib9612/morocco-transport/issues)
- **Discussions:** Join community discussions on [GitHub Discussions](https://github.com/Habib9612/morocco-transport/discussions)
- **Email:** Contact us at support@maroctransit.com

### Performance Tips

- Use connection pooling for database connections in production
- Enable caching for static assets
- Consider using a CDN for image assets
- Monitor your application with tools like Sentry or LogRocket

---

## 🏷️ Project Status & Badges

![Build Status](https://img.shields.io/github/workflow/status/Habib9612/morocco-transport/CI)
![Coverage](https://img.shields.io/codecov/c/github/Habib9612/morocco-transport)
![Version](https://img.shields.io/github/package-json/v/Habib9612/morocco-transport)
![License](https://img.shields.io/github/license/Habib9612/morocco-transport)
![Contributors](https://img.shields.io/github/contributors/Habib9612/morocco-transport)


For support, email support@maroctransit.com or join our Slack channel.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Prisma](https://prisma.io/) - Next-generation Node.js and TypeScript ORM
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Vercel](https://vercel.com/) - Platform for frontend frameworks and static sites

---

<div align="center">

**Built with ❤️ for Morocco's Transport Industry**

[Website](https://maroctransit.com) • [Documentation](https://docs.maroctransit.com) • [API Reference](https://api.maroctransit.com)

</div>
