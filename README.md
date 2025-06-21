# 🚛 MarocTransit - Morocco Transport Platform

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38bdf8?style=flat-square&logo=tailwind-css) ![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)

<div align="center">
  <h3>Built with ❤️ for Morocco's Transport Industry</h3>
  <p>Connect Shippers with Carriers Instantly</p>
</div>

## ⭐ Overview

MarocTransit is a cutting-edge transport platform designed specifically for Morocco's logistics and transportation needs. Our platform streamlines the connection between shippers and carriers, providing an efficient, secure, and user-friendly solution for managing transportation services across Morocco.

The platform implements sophisticated matching algorithms that consider multiple factors including load size compatibility, route preferences, historical reliability metrics, and cost efficiency to predict successful transport partnerships and optimize transportation efficiency across the supply chain.

## 🚀 Key Features

### 🔐 **Authentication & Security**
- **Secure User Registration** - Multi-step signup process with email verification
- **Advanced Login System** - Protected access with session management
- **Password Recovery** - Secure password reset functionality
- **Role-Based Access Control** - Different permissions for shippers, carriers, and admins
- **JWT-based Authentication** - Secure user authentication

### 📊 **Comprehensive Dashboard**
- **Real-time Analytics** - Live tracking of shipments and performance metrics
- **Interactive Maps** - Visual route planning and tracking
- **Performance Metrics** - Detailed insights and reporting
- **Custom Notifications** - Personalized alerts and updates

### 🚚 **Smart Matching System**
- **AI-Powered Matching** - Intelligent carrier-shipper pairing
- **Route Optimization** - Efficient path planning and cost reduction
- **Load Compatibility** - Automatic matching based on cargo requirements
- **Historical Analysis** - Data-driven decision making

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

### 🔧 **Technical Features**
- **Styling** - Tailwind CSS for responsive design
- **State Management** - React Context API with custom hooks
- **Real-time Features** - WebSocket integration for live notifications
- **Backend** - RESTful services with Next.js API routes
- **Database** - Prisma ORM for database management
- **File Processing** - Support for various document formats

### 🤖 **Machine Learning**
- **Algorithm** - Gradient boosting implementation
- **Data Processing** - Multi-criteria decision analysis
- **Performance Tracking** - Success rate optimization
- **Continuous Learning** - Model updates based on new transport data

### 🚛 **Fleet Management**
- **Vehicle Management** - Fleet tracking and maintenance schedules
- **Performance Analytics** - Driver performance metrics and insights
- **Document Management** - Digital storage of licenses and certifications

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

## 📊 Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| Frontend | Next.js 14, React 18, TypeScript | Modern web application framework |
| Styling | Tailwind CSS, PostCSS | Responsive and utility-first CSS |
| Database | Prisma, PostgreSQL | Type-safe database access |
| Testing | Jest, React Testing Library | Comprehensive testing suite |
| DevOps | Docker, ESLint, Prettier | Development and deployment tools |
| Authentication | JWT, NextAuth.js | Secure user authentication |
| Real-time | WebSocket, Socket.io | Live updates and notifications |

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

## 🆘 Support & Contact

- **Website:** [maroctransit.com](https://maroctransit.com)
- **Documentation:** [docs.maroctransit.com](https://docs.maroctransit.com)
- **API Reference:** [api.maroctransit.com](https://api.maroctransit.com)
- **Email:** [support@maroctransit.com](mailto:support@maroctransit.com)
- **Slack Channel:** Join our community for real-time support

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests for new features
- Ensure code passes all linting checks
- Update documentation for significant changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Prisma Team** - For the excellent database toolkit
- **Tailwind CSS** - For the utility-first CSS framework
- **Vercel** - For seamless deployment and hosting
- **Morocco Transport Community** - For inspiration and feedback

## 🗺️ Roadmap

- [ ] **Mobile Apps** - Native iOS and Android applications
- [ ] **AI-Powered Matching** - Smart carrier-shipper pairing
- [ ] **IoT Integration** - Real-time vehicle telemetry
- [ ] **Blockchain Integration** - Transparent and secure transactions
- [ ] **Multi-Country Expansion** - Extend to other North African countries
- [ ] **Advanced Analytics** - Machine learning insights and predictions

---

<div align="center">
  <p><strong>Built with ❤️ for Morocco's Transport Industry</strong></p>
  <p><strong>Made with ❤️ in Morocco 🇲🇦</strong></p>
  <p>© 2024 MarocTransit. All rights reserved.</p>
</div>

---

**Website** • [Documentation](https://docs.maroctransit.com) • [API Reference](https://api.maroctransit.com)      
