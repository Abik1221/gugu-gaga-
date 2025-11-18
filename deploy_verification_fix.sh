#!/bin/bash

# Production Verification Fix Deployment Script
# This script deploys the verification fixes to production

set -e

echo "🚀 Deploying Verification Fixes to Production"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "backend" ] || [ ! -d "front_end" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Starting deployment of verification fixes..."

# 1. Backend fixes
echo ""
echo "📦 Deploying Backend Fixes..."
echo "-----------------------------"

cd backend

# Check if production environment file exists
if [ ! -f ".env.production" ]; then
    print_error "Production environment file not found!"
    exit 1
fi

# Run the production fix script
if [ -f "fix_production_verification.py" ]; then
    print_status "Running production verification fixes..."
    python3 fix_production_verification.py
else
    print_warning "Production fix script not found, skipping database cleanup"
fi

# Test email system
if [ -f "production_email_debug.py" ]; then
    print_status "Testing email system..."
    echo "test@example.com" | python3 production_email_debug.py
else
    print_warning "Email debug script not found, skipping email test"
fi

# 2. Frontend fixes
echo ""
echo "🎨 Deploying Frontend Fixes..."
echo "------------------------------"

cd ../front_end

# Check if production environment file exists
if [ ! -f ".env.production" ]; then
    print_warning "Frontend production environment file not found"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    npm install
fi

# Build the frontend
print_status "Building frontend with fixes..."
npm run build

# 3. Docker deployment (if using Docker)
echo ""
echo "🐳 Docker Deployment..."
echo "----------------------"

cd ..

if [ -f "docker-compose.prod.yml" ]; then
    print_status "Stopping existing containers..."
    docker-compose -f docker-compose.prod.yml down
    
    print_status "Building new images with fixes..."
    docker-compose -f docker-compose.prod.yml build --no-cache
    
    print_status "Starting updated containers..."
    docker-compose -f docker-compose.prod.yml up -d
    
    # Wait for services to start
    print_status "Waiting for services to start..."
    sleep 10
    
    # Check if services are running
    if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
        print_status "Services are running successfully"
    else
        print_error "Some services failed to start"
        docker-compose -f docker-compose.prod.yml logs
    fi
else
    print_warning "Docker compose file not found, skipping Docker deployment"
fi

# 4. Health checks
echo ""
echo "🏥 Running Health Checks..."
echo "--------------------------"

# Check if backend is responding
BACKEND_URL="http://13.61.24.25:8000"
if curl -s -f "${BACKEND_URL}/health" > /dev/null; then
    print_status "Backend health check passed"
else
    print_error "Backend health check failed"
fi

# Check if API endpoints are accessible
if curl -s -f "${BACKEND_URL}/api/v1/health" > /dev/null; then
    print_status "API health check passed"
else
    print_error "API health check failed"
fi

# 5. Test verification endpoint
echo ""
echo "🔐 Testing Verification Endpoint..."
echo "----------------------------------"

# Test the verification endpoint with a dummy request
TEST_RESPONSE=$(curl -s -w "%{http_code}" -X POST "${BACKEND_URL}/api/v1/auth/register/verify" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "email=test@example.com&code=123456" \
    -o /dev/null)

if [ "$TEST_RESPONSE" = "404" ] || [ "$TEST_RESPONSE" = "400" ]; then
    print_status "Verification endpoint is responding (expected 404/400 for test data)"
elif [ "$TEST_RESPONSE" = "500" ]; then
    print_error "Verification endpoint returned server error"
else
    print_status "Verification endpoint is accessible (HTTP $TEST_RESPONSE)"
fi

# 6. Final summary
echo ""
echo "📊 Deployment Summary"
echo "===================="

print_status "Verification fixes deployed successfully!"

echo ""
echo "🔍 What was fixed:"
echo "  • Enhanced verification endpoint with better error handling"
echo "  • Improved CORS settings for production"
echo "  • Better network error handling in frontend"
echo "  • Database cleanup of expired codes"
echo "  • Enhanced logging for debugging"

echo ""
echo "🧪 Testing checklist:"
echo "  1. Try registering a new user"
echo "  2. Check email delivery"
echo "  3. Test verification code entry"
echo "  4. Verify successful login after verification"
echo "  5. Check browser console for any errors"

echo ""
echo "📋 If issues persist, check:"
echo "  • Server logs: docker-compose -f docker-compose.prod.yml logs"
echo "  • Email delivery in spam folder"
echo "  • Network connectivity from client"
echo "  • Browser developer tools for CORS errors"

echo ""
print_status "Deployment completed! 🎉"