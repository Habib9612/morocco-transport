# Use Node.js LTS as the base image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]n# Version control
.git
.gitignore

# Dependencies
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build output
.next
out

# Testing
coverage
.nyc_output

# Environment
.env*
!.env.example

# Editor & OS files
.DS_Store
*.swp
*.swo
.idea
.vscode
*.sublime-*

# Logs
logs
*.log

# Docker
Dockerfile
.dockerignore
docker-compose*

# Miscellaneous
README.md
LICENSE
.github
docs.dockerignorenname: MarocTransit Frontend CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x, 18.x]

    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Lint check
      run: npm run lint
      
    - name: Run tests
      run: npm test
      
    - name: Build
      run: npm run build

  build-and-push-docker:
    needs: build-and-test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
      
    - name: Login to DockerHub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKERHUB_USERNAME }}
        password: ${{ secrets.DOCKERHUB_TOKEN }}
        
    - name: Build and push
      uses: docker/build-push-action@v3
      with:
        context: .
        push: true
        tags: |
          yourusername/maroctransit-frontend:latest
          yourusername/maroctransit-frontend:${{ github.sha }}
        cache-from: type=registry,ref=yourusername/maroctransit-frontend:latest
        cache-to: type=inline

  deploy:
    needs: build-and-push-docker
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
    - name: Deploy to production
      # Add your deployment step here, e.g. using SSH to connect to your server
      # or using a cloud provider's deployment action
      run: |
      echo "Deploying to production environment"
      docker-compose -f docker-compose.yml up -d --build      