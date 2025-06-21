# 🚛 MarocTransit - Morocco Transport Platform

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

**Built with ❤️ for Morocco's Transport Industry**

**Connect Shippers with Carriers Instantly**

## 🌟 Overview

MarocTransit is a cutting-edge transport platform designed specifically for Morocco's logistics and transportation needs. Our platform streamlines the connection between shippers and carriers, providing an efficient, secure, and user-friendly solution for managing transportation services across Morocco.

## ✨ Platform Features

### 🔐 Authentication & Security
- **Secure User Registration** - Multi-step signup process with email verification
- **Advanced Login System** - Protected access with session management
- **Password Recovery** - Secure password reset functionality
- **Role-Based Access Control** - Different permissions for shippers, carriers, and admins

### 📊 Comprehensive Dashboard
- **Real-time Analytics** - Track shipments, revenue, and performance metrics
- **Interactive Maps** - Live tracking of vehicles and shipments
- **Custom Settings** - Personalized user preferences and configurations
- **Notification Center** - Real-time alerts and updates

### 🚛 Shipment Management
- **Smart Shipment Creation** - Intuitive interface for booking transport services
- **Live Tracking** - Real-time GPS tracking of all shipments
- **Status Updates** - Automatic notifications at every stage
- **Digital Documentation** - Paperless receipt and delivery confirmations
- **Route Optimization** - AI-powered route planning for efficiency

### 👥 Driver & Carrier Management
- **Driver Profiles** - Comprehensive driver information and ratings
- **Vehicle Management** - Fleet tracking and maintenance schedules
- **Performance Analytics** - Driver performance metrics and insights
- **Document Management** - Digital storage of licenses and certifications

### 💬 Communication Hub
- **In-app Messaging** - Direct communication between all parties
- **Push Notifications** - Instant alerts for important updates
- **Customer Support** - 24/7 integrated support system
- **Multilingual Support** - Arabic, French, and English interfaces

### 📍 Location Services
- **Morocco-Wide Coverage** - Services across all major Moroccan cities
- **Smart Routing** - Optimal route calculations considering traffic and road conditions
- **Geofencing** - Location-based alerts and automated status updates
- **Nearby Services** - Find carriers and services in your area

### 💰 Financial Management
- **Transparent Pricing** - Clear, upfront pricing with no hidden fees
- **Multiple Payment Options** - Cash, card, and digital wallet support
- **Invoicing System** - Automated invoice generation and management
- **Financial Reports** - Detailed earning and expense tracking

### 📱 Mobile-First Design
- **Responsive Interface** - Optimized for desktop, tablet, and mobile
- **Progressive Web App** - App-like experience on any device
- **Offline Capabilities** - Key features work without internet connection
- **Touch-Optimized** - Intuitive touch interfaces for mobile users

## 🛠 Technical Stack

- **Frontend:** Next.js 14 with App Router
- **Language:** TypeScript for type safety
- **Styling:** Tailwind CSS for modern, responsive design
- **Database:** Prisma ORM with PostgreSQL
- **Authentication:** NextAuth.js with JWT tokens
- **Testing:** Jest with comprehensive test coverage
- **Code Quality:** ESLint and Prettier for consistent code
- **Deployment:** Vercel with automatic CI/CD

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
```env
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
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication endpoints
│   ├── shipments/         # Shipment management APIs
│   ├── drivers/           # Driver management APIs
│   ├── dashboard/         # Dashboard pages
│   ├── settings/          # User settings
│   ├── shipments/         # Shipment management
│   ├── messages/          # Communication center
│   ├── locations/         # Location services
│   └── auth/              # Authentication pages
├── components/            # Reusable UI components
├── lib/                   # Utility functions
├── models/                # Database models
├── middleware.ts          # Next.js middleware
├── prisma/                # Database schema
└── public/                # Static assets
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

- **Casablanca** - Economic capital and largest city
- **Rabat** - Capital city and administrative center
- **Marrakech** - Tourism and cultural hub
- **Fez** - Historical and cultural center
- **Tangier** - Northern gateway to Europe
- **Agadir** - Atlantic coast and agriculture
- **Meknes** - Central Morocco
- **Oujda** - Eastern border region

## 📞 Support & Contact

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Prisma Team** - For the excellent database toolkit
- **Tailwind CSS** - For the utility-first CSS framework
- **Vercel** - For seamless deployment and hosting
- **Morocco's Transport Community** - For inspiration and feedback

## 🗺 Roadmap

- ☐ **Mobile Apps** - Native iOS and Android applications
- ☐ **AI-Powered Matching** - Smart carrier-shipper pairing
- ☐ **IoT Integration** - Real-time vehicle telemetry
- ☐ **Blockchain Integration** - Transparent and secure transactions
- ☐ **Multi-Country Expansion** - Extend to other North African countries
- ☐ **Advanced Analytics** - Machine learning insights and predictions

---

**Made with ❤️ in Morocco 🇲🇦**

© 2024 MarocTransit. All rights reserved.    
