#!/bin/bash
set -e

echo "🚀 MarocTransit Full Integration & Deployment"

# 1. Install dependencies
npm install

# 2. Ensure .env.local exists and is correct
if [ ! -f .env.local ]; then
  echo "Creating .env.local..."
  cat <<EOF > .env.local
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
EOF
fi

# 3. Generate Prisma client and push schema
npx prisma generate
npx prisma db push

# 4. Seed the database
if [ -f prisma/seed.ts ]; then
  npx tsx prisma/seed.ts
else
  echo "No seed script found. Skipping seeding."
fi

# 5. Build the Next.js app
npm run build

# 6. Start the app in production mode
npm start

echo ""
echo "✅ MarocTransit deployed! Visit: http://localhost:3000"
echo "Test login: admin@maroctransit.com / password123" 