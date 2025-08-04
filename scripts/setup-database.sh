#!/bin/bash

# Secure Database Setup Script
# This script sets up the database using environment variables

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

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
    if [ -f .env ]; then
        print_status "Loading environment variables from .env file..."
        export $(cat .env | grep -v '^#' | xargs)
    else
        print_warning ".env file not found. Please create one from env.example"
        print_warning "cp env.example .env"
        print_warning "Then edit .env with your actual values"
        exit 1
    fi
}

# Check if PostgreSQL is running
check_postgres() {
    print_status "Checking PostgreSQL connection..."
    
    if ! pg_isready -h "${DB_HOST:-localhost}" -p "${DB_PORT:-5432}" > /dev/null 2>&1; then
        print_error "PostgreSQL is not running or not accessible"
        print_warning "Please start PostgreSQL first:"
        print_warning "  macOS: brew services start postgresql"
        print_warning "  Ubuntu: sudo systemctl start postgresql"
        exit 1
    fi
    
    print_status "PostgreSQL is running"
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
    
    # Test connection
    print_status "Testing database connection..."
    if psql -h "${DB_HOST:-localhost}" -p "${DB_PORT:-5432}" -U "${DB_USER:-postgres}" -d "${DB_NAME:-secureBanking}" -c "SELECT 1;" > /dev/null 2>&1; then
        print_status "Database connection successful"
    else
        print_error "Database connection failed"
        exit 1
    fi
    
    # Clear password from environment
    unset PGPASSWORD
}

# Create .env file if it doesn't exist
create_env_if_missing() {
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from template..."
        if [ -f env.example ]; then
            cp env.example .env
            print_status ".env file created from template"
            print_warning "Please edit .env file with your actual values:"
            print_warning "  nano .env"
            print_warning "  or"
            print_warning "  code .env"
            exit 0
        else
            print_error "env.example file not found"
            exit 1
        fi
    fi
}

# Main execution
main() {
    echo "🔒 Secure Database Setup"
    echo "========================"
    echo ""
    
    create_env_if_missing
    load_env
    check_postgres
    setup_database
    
    echo ""
    echo "✅ Database setup complete!"
    echo "=========================="
    echo "Host:     ${DB_HOST:-localhost}"
    echo "Port:     ${DB_PORT:-5432}"
    echo "Database: ${DB_NAME:-secureBanking}"
    echo "User:     ${DB_USER:-postgres}"
    echo ""
    echo "You can now run the application securely!"
}

# Handle command line arguments
case "${1:-}" in
    "create-env")
        create_env_if_missing
        ;;
    "test-connection")
        load_env
        check_postgres
        setup_database
        ;;
    *)
        main
        ;;
esac 