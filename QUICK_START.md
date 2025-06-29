# ⚡ MarocTransit Platform - Quick Start Guide

## 🚀 Deploy in 5 Minutes

### Prerequisites Check
Make sure you have:
- Node.js 18+ (`node --version`)
- npm (`npm --version`)
- Java 17+ (`java --version`)
- Maven (`mvn --version`)

### 1. Clone and Setup
```bash
git clone https://github.com/Habib9612/morocco-transport.git
cd morocco-transport
git checkout production-ready
```

### 2. Run Automated Setup
```bash
# Make script executable (if needed)
chmod +x scripts/deploy-local.sh

# Run automated deployment
./scripts/deploy-local.sh
```

### 3. Start the Application
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend (if backend exists)
cd backend && mvn spring-boot:run
```

### 4. Access Your Platform
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080

## 🎯 What You Get

✅ **Professional Landing Page** with modern UI
✅ **Complete Authentication System** (signup/login)
✅ **Dashboard** with real-time data
✅ **Shipment Management** system
✅ **Fleet Management** tools
✅ **Analytics** and reporting
✅ **Responsive Design** for all devices

## 🚨 Quick Troubleshooting

### Port Already in Use?
```bash
# Kill processes on ports
lsof -ti:3000 | xargs kill -9
lsof -ti:8080 | xargs kill -9
```

### Database Issues?
```bash
# Reset database
npx prisma db push --force-reset
```

### Build Errors?
```bash
# Clean and rebuild
npm run build
```

## 📚 Need More Help?

- **Detailed Guide**: See `DEPLOYMENT_GUIDE.md`
- **Common Issues**: See troubleshooting section in deployment guide
- **Support**: Create an issue in the GitHub repository

---

**Your MarocTransit platform is ready! 🚛✨** 