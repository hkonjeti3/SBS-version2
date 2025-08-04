#!/bin/bash

# Test Email Configuration Script
# This script tests if the email configuration is working properly

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
if [ -f .env ]; then
    print_status "Loading environment variables..."
    export $(cat .env | grep -v '^#' | xargs)
else
    print_error ".env file not found"
    exit 1
fi

print_status "Testing email configuration..."
print_status "Email Host: ${MAIL_HOST}"
print_status "Email Port: ${MAIL_PORT}"
print_status "Email Username: ${MAIL_USERNAME}"

# Test if we can connect to the email server
print_status "Testing email server connection..."
if command -v telnet &> /dev/null; then
    if timeout 5 telnet ${MAIL_HOST} ${MAIL_PORT} 2>/dev/null; then
        print_status "Email server connection successful"
    else
        print_warning "Could not connect to email server"
    fi
else
    print_warning "telnet not available, skipping connection test"
fi

print_status "Email configuration test complete"
print_status "To test actual email sending, try logging in to the application"
print_status "Backend URL: http://localhost:8081"
print_status "Frontend URL: http://localhost:4200" 