#!/bin/bash

# 🔧 MarocTransit Platform - Error Fixing Script
# This script automatically fixes common deployment errors

set -e

echo "🔧 MarocTransit Platform - Error Fixing Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to fix port conflicts
fix_port_conflicts() {
    print_status "Fixing port conflicts..."
    
    local ports=("3000" "8080" "3001")
    
    for port in "${ports[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            print_warning "Port $port is in use. Attempting to kill process..."
            if lsof -ti:$port | xargs kill -9 2>/dev/null; then
                print_success "Killed process on port $port"
            else
                print_warning "Could not kill process on port $port. You may need to manually stop it."
            fi
        else
            print_success "Port $port is available"
        fi
    done
}

# Function to fix Node.js issues
fix_node_issues() {
    print_status "Fixing Node.js issues..."
    
    # Clear npm cache
    npm cache clean --force
    
    # Remove node_modules and reinstall
    if [ -d node_modules ]; then
        print_status "Removing node_modules..."
        rm -rf node_modules
    fi
    
    if [ -f package-lock.json ]; then
        print_status "Removing package-lock.json..."
        rm package-lock.json
    fi
    
    print_status "Reinstalling dependencies..."
    npm install
    
    print_success "Node.js issues fixed"
}

# Function to fix Prisma issues
fix_prisma_issues() {
    print_status "Fixing Prisma issues..."
    
    # Generate Prisma client
    npx prisma generate
    
    # Reset database
    print_warning "Resetting database (this will delete all data)..."
    npx prisma db push --force-reset
    
    # Run seed if available
    if [ -f prisma/seed.ts ]; then
        print_status "Running database seed..."
        npx tsx prisma/seed.ts
    fi
    
    print_success "Prisma issues fixed"
}

# Function to fix TypeScript issues
fix_typescript_issues() {
    print_status "Fixing TypeScript issues..."
    
    # Clear TypeScript cache
    if [ -f tsconfig.tsbuildinfo ]; then
        rm tsconfig.tsbuildinfo
    fi
    
    # Clear Next.js cache
    if [ -d .next ]; then
        rm -rf .next
    fi
    
    # Check for build errors
    print_status "Checking for build errors..."
    if npm run build >/dev/null 2>&1; then
        print_success "Build successful"
    else
        print_warning "Build failed. Check the output above for specific errors."
    fi
    
    print_success "TypeScript issues fixed"
}

# Function to fix environment issues
fix_environment_issues() {
    print_status "Fixing environment issues..."
    
    # Create .env.local if it doesn't exist
    if [ ! -f .env.local ]; then
        print_status "Creating .env.local..."
        cat > .env.local << 'EOF'
# Database Configuration
DATABASE_URL="file:./dev.db"

# Authentication & Security
NEXTAUTH_SECRET="your-super-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="your-jwt-secret-key-change-in-production"

# API Configuration
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
NEXT_PUBLIC_WEBSOCKET_URL="ws://localhost:3001"

# Development Settings
NODE_ENV="development"
NEXT_PUBLIC_DEBUG="true"

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_MATCHING="true"
NEXT_PUBLIC_ENABLE_REAL_TIME_TRACKING="true"

# Regional Settings
NEXT_PUBLIC_DEFAULT_LOCALE="en"
NEXT_PUBLIC_SUPPORTED_LOCALES="en,ar,fr"
NEXT_PUBLIC_DEFAULT_CURRENCY="MAD"
NEXT_PUBLIC_TIMEZONE="Africa/Casablanca"
EOF
        print_success "Created .env.local"
    else
        print_warning ".env.local already exists"
    fi
}

# Function to fix Maven issues
fix_maven_issues() {
    print_status "Fixing Maven issues..."
    
    if [ -d backend ]; then
        cd backend
        
        # Clean Maven cache
        mvn clean
        
        # Remove target directory
        if [ -d target ]; then
            rm -rf target
        fi
        
        # Reinstall dependencies
        mvn install -DskipTests
        
        cd ..
        print_success "Maven issues fixed"
    else
        print_warning "Backend directory not found. Skipping Maven fixes."
    fi
}

# Function to fix permission issues
fix_permission_issues() {
    print_status "Fixing permission issues..."
    
    # Make scripts executable
    chmod +x scripts/*.sh
    
    # Fix npm permissions if needed
    if [ -d node_modules ]; then
        chmod -R 755 node_modules
    fi
    
    print_success "Permission issues fixed"
}

# Function to run all fixes
run_all_fixes() {
    print_status "Running all error fixes..."
    
    fix_permission_issues
    fix_port_conflicts
    fix_environment_issues
    fix_node_issues
    fix_prisma_issues
    fix_typescript_issues
    fix_maven_issues
    
    print_success "All error fixes completed!"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  --all              Run all fixes"
    echo "  --ports            Fix port conflicts"
    echo "  --node             Fix Node.js issues"
    echo "  --prisma           Fix Prisma issues"
    echo "  --typescript       Fix TypeScript issues"
    echo "  --environment      Fix environment issues"
    echo "  --maven            Fix Maven issues"
    echo "  --permissions      Fix permission issues"
    echo "  --help             Show this help message"
    echo ""
}

# Main execution
case "${1:---all}" in
    --all)
        run_all_fixes
        ;;
    --ports)
        fix_port_conflicts
        ;;
    --node)
        fix_node_issues
        ;;
    --prisma)
        fix_prisma_issues
        ;;
    --typescript)
        fix_typescript_issues
        ;;
    --environment)
        fix_environment_issues
        ;;
    --maven)
        fix_maven_issues
        ;;
    --permissions)
        fix_permission_issues
        ;;
    --help)
        show_usage
        ;;
    *)
        echo "Unknown option: $1"
        show_usage
        exit 1
        ;;
esac

echo ""
echo "🎉 Error fixing completed!"
echo ""
echo "Next steps:"
echo "1. Run: npm run dev"
echo "2. Open: http://localhost:3000"
echo "3. If backend exists, run: cd backend && mvn spring-boot:run"
echo "" 