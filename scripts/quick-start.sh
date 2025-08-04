#!/bin/bash

# Secure Banking System - Quick Start Script
# This script sets up and runs the application for 100+ users

set -e

echo "🚀 Secure Banking System - Quick Start"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Load environment variables
load_env() {
    # Get the directory where the script is located
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
    
    # Look for .env file in project root
    if [ -f "$PROJECT_ROOT/.env" ]; then
        print_status "Loading environment variables from .env file..."
        export $(cat "$PROJECT_ROOT/.env" | grep -v '^#' | xargs)
    else
        print_warning ".env file not found in project root. Please create one from env.example"
        print_warning "cd $PROJECT_ROOT && cp env.example .env"
        print_warning "Then edit .env with your actual values"
        exit 1
    fi
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Java
    if ! command -v java &> /dev/null; then
        print_error "Java is not installed. Please install Java 17 or higher."
        exit 1
    fi
    
    java_version=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
    if [ "$java_version" -lt 17 ]; then
        print_error "Java version $java_version is too old. Please install Java 17 or higher."
        exit 1
    fi
    print_status "Java version: $(java -version 2>&1 | head -n 1)"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi
    print_status "Node.js version: $(node --version)"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed."
        exit 1
    fi
    print_status "npm version: $(npm --version)"
    
    # Check PostgreSQL
    if ! command -v psql &> /dev/null; then
        print_warning "PostgreSQL is not installed. Please install PostgreSQL first."
        print_warning "On macOS: brew install postgresql"
        print_warning "On Ubuntu: sudo apt-get install postgresql postgresql-contrib"
        exit 1
    fi
    print_status "PostgreSQL found"
}

# Check if services are running
check_services() {
    print_status "Checking if required services are running..."
    
    # Check PostgreSQL
    if pg_isready -h "${DB_HOST:-localhost}" -p "${DB_PORT:-5432}" > /dev/null 2>&1; then
        print_status "PostgreSQL is running"
    else
        print_error "PostgreSQL is not running. Please start PostgreSQL first."
        print_warning "On macOS: brew services start postgresql"
        print_warning "On Ubuntu: sudo systemctl start postgresql"
        exit 1
    fi
    
    # Check Redis (optional)
    if command -v redis-cli &> /dev/null; then
        if redis-cli ping > /dev/null 2>&1; then
            print_status "Redis is running"
        else
            print_warning "Redis is not running. OTP will be stored in memory."
        fi
    else
        print_warning "Redis not found. OTP will be stored in memory."
    fi
    
    # Check Kafka (optional)
    KAFKA_TOPICS_SCRIPT="/opt/homebrew/Cellar/kafka/4.0.0/libexec/bin/kafka-topics.sh"
    if [ -f "$KAFKA_TOPICS_SCRIPT" ]; then
        if $KAFKA_TOPICS_SCRIPT --list --bootstrap-server localhost:9092 > /dev/null 2>&1; then
            print_status "Kafka is running"
        else
            print_warning "Kafka is not running. Async processing will be disabled."
        fi
    else
        print_warning "Kafka not found. Async processing will be disabled."
    fi
}

# Setup database using environment variables
setup_database() {
    print_status "Setting up database using environment variables..."
    
    # Set PostgreSQL password environment variable
    export PGPASSWORD="${DB_PASSWORD}"
    
    # Create database if it doesn't exist
    if ! psql -h "${DB_HOST:-localhost}" -p "${DB_PORT:-5432}" -U "${DB_USER:-postgres}" -lqt | cut -d \| -f 1 | grep -qw "${DB_NAME:-secureBanking}"; then
        print_status "Creating database '${DB_NAME:-secureBanking}'..."
        psql -h "${DB_HOST:-localhost}" -p "${DB_PORT:-5432}" -U "${DB_USER:-postgres}" -c "CREATE DATABASE \"${DB_NAME:-secureBanking}\";"
        print_status "Database created successfully"
    else
        print_status "Database '${DB_NAME:-secureBanking}' already exists"
    fi
    
    # Clear password from environment
    unset PGPASSWORD
}

# Build and start backend
start_backend() {
    print_status "Building and starting backend..."
    
    cd "$PROJECT_ROOT/SBS_Backend/sbs"
    
    # Clean and build
    print_status "Building Spring Boot application..."
    ./mvnw clean install -DskipTests
    
    # Start backend in background
    print_status "Starting backend on port 8081..."
    nohup ./mvnw spring-boot:run > backend.log 2>&1 &
    BACKEND_PID=$!
    
    # Wait for backend to start
    print_status "Waiting for backend to start..."
    for i in {1..30}; do
        if curl -s http://localhost:8081/actuator/health > /dev/null 2>&1; then
            print_status "Backend is running on http://localhost:8081"
            break
        fi
        if [ $i -eq 30 ]; then
            print_error "Backend failed to start within 30 seconds"
            exit 1
        fi
        sleep 1
    done
    
    cd "$PROJECT_ROOT"
}

# Setup and start frontend
start_frontend() {
    print_status "Setting up and starting frontend..."
    
    cd "$PROJECT_ROOT/SBS_Frontend"
    
    # Install dependencies
    print_status "Installing npm dependencies..."
    npm install
    
    # Start frontend in background
    print_status "Starting frontend on port 4200..."
    nohup ng serve > frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    # Wait for frontend to start
    print_status "Waiting for frontend to start..."
    for i in {1..30}; do
        if curl -s http://localhost:4200 > /dev/null 2>&1; then
            print_status "Frontend is running on http://localhost:4200"
            break
        fi
        if [ $i -eq 30 ]; then
            print_error "Frontend failed to start within 30 seconds"
            exit 1
        fi
        sleep 1
    done
    
    cd "$PROJECT_ROOT"
}

# Run load test
run_load_test() {
    print_status "Running load test..."
    
    # Install axios if not present
    if ! npm list axios > /dev/null 2>&1; then
        print_status "Installing axios for load testing..."
        npm install axios
    fi
    
    # Run load test
    print_status "Starting load test with 100 concurrent users..."
    node "$PROJECT_ROOT/tests/load/load-test.js"
}

# Cleanup function
cleanup() {
    print_status "Cleaning up..."
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        print_status "Backend stopped"
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        print_status "Frontend stopped"
    fi
}

# Trap to cleanup on exit
trap cleanup EXIT

# Main execution
main() {
    echo "Starting Secure Banking System setup..."
    echo ""
    
    load_env
    check_prerequisites
    check_services
    setup_database
    start_backend
    start_frontend
    
    echo ""
    echo "🎉 Setup complete!"
    echo "=================="
    echo "Backend:  http://localhost:8081"
    echo "Frontend: http://localhost:4200"
    echo "Health:   http://localhost:8081/actuator/health"
    echo ""
    echo "Press Ctrl+C to stop all services"
    echo ""
    
    # Keep script running
    while true; do
        sleep 1
    done
}

# Handle command line arguments
case "${1:-}" in
    "test")
        load_env
        check_prerequisites
        check_services
        setup_database
        start_backend
        start_frontend
        sleep 5
        run_load_test
        ;;
    "stop")
        cleanup
        ;;
    "setup-db")
        load_env
        setup_database
        ;;
    *)
        main
        ;;
esac 