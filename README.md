# 🚛 MarocTransit - Morocco Transport Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?style=flat-square&logo=prisma)](https://www.prisma.io/)

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
- [ ] **Advanced Analytics** - Machine learning insights and predictions

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

## 🆘 Support

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
