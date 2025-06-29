# 🚀 MarocTransit Deployment Guide

This guide provides comprehensive instructions for deploying the Morocco Transport application.

## 🎯 Quick Start (All-in-One Deployment)

### Option 1: Using the Deployment Script

**Copy and paste this single command to deploy everything:**

```bash
curl -sSL https://raw.githubusercontent.com/Habib9612/morocco-transport/production-ready/deploy-all.sh | bash
```

**Or download and run locally:**

```bash
wget https://raw.githubusercontent.com/Habib9612/morocco-transport/production-ready/deploy-all.sh
chmod +x deploy-all.sh
./deploy-all.sh
```

### Option 2: Manual Step-by-Step

```bash
# 1. Clone the repository and switch to the production-ready branch
git clone https://github.com/Habib9612/morocco-transport.git
cd morocco-transport
git checkout production-ready

# 2. Install dependencies
npm install

# 3. Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
  echo "Creating .env.local with default values..."
  cat <<EOF > .env.local
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
EOF
fi

# 4. Generate Prisma client and push schema
npx prisma generate
npx prisma db push

# 5. Seed the database with test users
if [ -f prisma/seed.ts ]; then
  npx tsx prisma/seed.ts
else
  echo "No seed script found. Skipping seeding."
fi

# 6. Build the Next.js app
npm run build

# 7. Start the app in production mode
npm start
```

## 🌐 Access Your Application

After successful deployment:

- **URL:** http://localhost:3000
- **Admin Email:** admin@maroctransit.ma
- **Admin Password:** admin123

## 📋 What the Deployment Does

1. **Repository Setup:** Clones the repo and checks out the production-ready branch
2. **Dependencies:** Installs all required npm packages
3. **Environment:** Sets up `.env.local` with default production values
4. **Database:** Generates Prisma client and creates database schema
5. **Seeding:** Populates database with initial admin user and test data
6. **Build:** Compiles the Next.js application for production
7. **Launch:** Starts the server in production mode

## 🔧 Environment Configuration

The deployment script creates a `.env.local` file with these default values:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
```

### For Production Servers

Update these values for production deployment:

```env
# Use a stronger JWT secret
JWT_SECRET="your-very-secure-random-string-here"

# For PostgreSQL (recommended for production)
DATABASE_URL="postgresql://username:password@localhost:5432/maroctransit"

# Update API URL for your domain
NEXT_PUBLIC_API_BASE_URL="https://yourdomain.com/api"
```

## 🐳 Docker Deployment

The project includes Docker support:

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🔒 Security Notes

- **Change the JWT_SECRET** in production
- **Use PostgreSQL** instead of SQLite for production
- **Set up HTTPS** for production deployments
- **Configure firewall** rules appropriately

## 🛠️ Troubleshooting

### Common Issues

1. **Port 3000 already in use:**
   ```bash
   # Kill process using port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **Permission denied on deploy-all.sh:**
   ```bash
   chmod +x deploy-all.sh
   ```

3. **Database connection issues:**
   - Check DATABASE_URL in .env.local
   - Ensure database directory is writable

4. **Build failures:**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

### Getting Help

- Check the [GitHub Issues](https://github.com/Habib9612/morocco-transport/issues)
- Review application logs in the terminal
- Ensure all prerequisites are installed (Node.js 18+, npm)

## 📊 System Requirements

- **Node.js:** 18.0.0 or higher
- **npm:** 8.0.0 or higher
- **Memory:** 2GB RAM minimum
- **Storage:** 1GB free space
- **OS:** Linux, macOS, or Windows

## 🔄 Updates

To update to the latest version:

```bash
cd morocco-transport
git pull origin production-ready
npm install
npm run build
npm start
```

---

**Happy Deploying! 🚀**
