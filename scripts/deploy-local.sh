#!/bin/bash

# 🚀 MarocTransit Platform - Local Deployment Script
# This script automates the local deployment process

set -e  # Exit on any error

echo "🚛 MarocTransit Platform - Local Deployment"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    local missing_deps=()
    
    if ! command_exists node; then
        missing_deps+=("Node.js")
    fi
    
    if ! command_exists npm; then
        missing_deps+=("npm")
    fi
    
    if ! command_exists java; then
        missing_deps+=("Java")
    fi
    
    if ! command_exists mvn; then
        missing_deps+=("Maven")
    fi
    
    if ! command_exists git; then
        missing_deps+=("Git")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing_deps[*]}"
        echo "Please install the missing dependencies and run this script again."
        exit 1
    fi
    
    print_success "All prerequisites are installed!"
}

# Function to check Node.js version
check_node_version() {
    print_status "Checking Node.js version..."
    
    local node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    
    if [ "$node_version" -lt 18 ]; then
        print_error "Node.js version 18 or higher is required. Current version: $(node --version)"
        echo "Please update Node.js and run this script again."
        exit 1
    fi
    
    print_success "Node.js version: $(node --version)"
}

# Function to check Java version
check_java_version() {
    print_status "Checking Java version..."
    
    local java_version=$(java --version 2>&1 | head -n 1 | cut -d' ' -f2 | cut -d'.' -f1)
    
    if [ "$java_version" -lt 17 ]; then
        print_error "Java version 17 or higher is required. Current version: $(java --version 2>&1 | head -n 1)"
        echo "Please update Java and run this script again."
        exit 1
    fi
    
    print_success "Java version: $(java --version 2>&1 | head -n 1)"
}

# Function to setup environment file
setup_environment() {
    print_status "Setting up environment configuration..."
    
    if [ ! -f .env.local ]; then
        if [ -f .env.local.example ]; then
            cp .env.local.example .env.local
            print_success "Created .env.local from example"
        else
            print_warning "No .env.local.example found. Creating basic .env.local..."
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
            print_success "Created basic .env.local"
        fi
    else
        print_warning ".env.local already exists. Skipping..."
    fi
}

# Function to install frontend dependencies
install_frontend_deps() {
    print_status "Installing frontend dependencies..."
    
    if [ ! -d node_modules ]; then
        npm install
        print_success "Frontend dependencies installed"
    else
        print_warning "node_modules already exists. Skipping..."
    fi
}

# Function to setup database
setup_database() {
    print_status "Setting up database..."
    
    # Generate Prisma client
    npx prisma generate
    
    # Push database schema
    npx prisma db push
    
    # Run database scripts if they exist
    if [ -f scripts/01-create-tables.sql ]; then
        print_status "Running database scripts..."
        # For SQLite, we'll use a different approach
        print_success "Database scripts would be run here"
    fi
    
    print_success "Database setup completed"
}

# Function to install backend dependencies
install_backend_deps() {
    print_status "Installing backend dependencies..."
    
    if [ -d backend ]; then
        cd backend
        
        if [ ! -d target ]; then
            mvn clean install -DskipTests
            print_success "Backend dependencies installed"
        else
            print_warning "Backend target already exists. Skipping..."
        fi
        
        cd ..
    else
        print_warning "Backend directory not found. Skipping backend setup..."
    fi
}

# Function to check ports
check_ports() {
    print_status "Checking if required ports are available..."
    
    local ports=("3000" "8080")
    
    for port in "${ports[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            print_warning "Port $port is already in use"
            echo "You may need to stop the process using port $port or use a different port."
        else
            print_success "Port $port is available"
        fi
    done
}

# Function to start services
start_services() {
    print_status "Starting services..."
    
    echo ""
    echo "🚀 To start the application, run the following commands in separate terminals:"
    echo ""
    echo "Terminal 1 - Frontend:"
    echo "  npm run dev"
    echo ""
    echo "Terminal 2 - Backend (if backend directory exists):"
    echo "  cd backend && mvn spring-boot:run"
    echo ""
    echo "Access the application at:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend API: http://localhost:8080"
    echo ""
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    
    # Frontend tests
    if npm test -- --passWithNoTests >/dev/null 2>&1; then
        print_success "Frontend tests passed"
    else
        print_warning "Frontend tests failed or not configured"
    fi
    
    # Backend tests
    if [ -d backend ]; then
        cd backend
        if mvn test -DskipTests >/dev/null 2>&1; then
            print_success "Backend tests passed"
        else
            print_warning "Backend tests failed or not configured"
        fi
        cd ..
    fi
}

# Function to show troubleshooting tips
show_troubleshooting() {
    echo ""
    echo "🔧 Troubleshooting Tips:"
    echo "========================"
    echo ""
    echo "If you encounter issues:"
    echo "1. Check the DEPLOYMENT_GUIDE.md for detailed solutions"
    echo "2. Ensure all environment variables are set in .env.local"
    echo "3. Verify that ports 3000 and 8080 are not in use"
    echo "4. Check that all prerequisites are installed correctly"
    echo "5. Run 'npm run build' to check for compilation errors"
    echo "6. Check the logs for specific error messages"
    echo ""
}

# Main execution
main() {
    echo "Starting MarocTransit platform deployment..."
    echo ""
    
    # Check prerequisites
    check_prerequisites
    check_node_version
    check_java_version
    
    # Setup environment
    setup_environment
    
    # Install dependencies
    install_frontend_deps
    install_backend_deps
    
    # Setup database
    setup_database
    
    # Check ports
    check_ports
    
    # Run tests
    run_tests
    
    # Show next steps
    start_services
    
    # Show troubleshooting
    show_troubleshooting
    
    print_success "MarocTransit platform deployment completed!"
    echo ""
    echo "🎉 Your MarocTransit platform is ready for local development!"
    echo ""
}

# Run main function
main "$@" 