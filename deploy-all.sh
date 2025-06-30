#!/bin/bash

# MarocTransit All-in-One Deployment Script
# This script will deploy the Morocco Transport application locally or on a server

set -e  # Exit on any error

echo "🚀 Starting MarocTransit All-in-One Deployment..."
echo ""

# 1. Clone the repository and switch to the production-ready branch
echo "📦 Step 1: Cloning repository and switching to production-ready branch..."
if [ ! -d "morocco-transport" ]; then
  git clone https://github.com/Habib9612/morocco-transport.git
  cd morocco-transport
else
  echo "Repository already exists, updating..."
  cd morocco-transport
  git fetch origin
fi

git checkout production-ready
git pull origin production-ready
echo "✅ Repository ready!"
echo ""

# 2. Install dependencies
echo "📚 Step 2: Installing dependencies..."
npm install
echo "✅ Dependencies installed!"
echo ""

# 3. Create .env.local if it doesn't exist
echo "⚙️  Step 3: Setting up environment configuration..."
if [ ! -f .env.local ]; then
  echo "Creating .env.local with default values..."
  cat <<EOF > .env.local
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
EOF
  echo "✅ .env.local created with default values!"
else
  echo "✅ .env.local already exists!"
fi
echo ""

# 4. Generate Prisma client and push schema
echo "🗄️  Step 4: Setting up database..."
npx prisma generate
npx prisma db push
echo "✅ Database schema ready!"
echo ""

# 5. Seed the database with test users
echo "🌱 Step 5: Seeding database with initial data..."
if [ -f prisma/seed.ts ]; then
  npx tsx prisma/seed.ts
  echo "✅ Database seeded successfully!"
else
  echo "⚠️  No seed script found. Skipping seeding."
fi
echo ""

# 6. Build the Next.js app
echo "🏗️  Step 6: Building the Next.js application..."
npm run build
echo "✅ Application built successfully!"
echo ""

# 7. Start the app in production mode
echo "🚀 Step 7: Starting the application in production mode..."
echo ""
echo "🎉 MarocTransit deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "   • Repository: https://github.com/Habib9612/morocco-transport.git"
echo "   • Branch: production-ready"
echo "   • Database: SQLite (file:./dev.db)"
echo "   • Environment: Production"
echo ""
echo "🌐 Application will be available at: http://localhost:3000"
echo ""
echo "👤 Test Login Credentials:"
echo "   Email: admin@maroctransit.ma"
echo "   Password: admin123"
echo ""
echo "🚀 Starting the server now..."
echo "   (Press Ctrl+C to stop the server)"
echo ""

npm start
