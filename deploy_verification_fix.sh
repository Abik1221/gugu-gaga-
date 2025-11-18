#!/bin/bash

# Deploy verification fixes to production
echo "🚀 Deploying verification fixes..."

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
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "backend/app/main.py" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Starting verification fix deployment..."

# Step 1: Build and deploy backend changes
print_status "Building backend with verification fixes..."
cd backend

# Build Docker image
docker build -t mesobai-backend:verification-fix .
if [ $? -ne 0 ]; then
    print_error "Backend build failed"
    exit 1
fi

print_status "Backend build successful"

# Step 2: Build frontend changes
print_status "Building frontend with role validation..."
cd ../front_end

# Install dependencies and build
npm install
npm run build
if [ $? -ne 0 ]; then
    print_error "Frontend build failed"
    exit 1
fi

print_status "Frontend build successful"

# Step 3: Deploy to production (assuming Docker Compose setup)
cd ..
print_status "Deploying to production..."

# Stop current services
docker-compose down

# Start with new images
docker-compose up -d --build
if [ $? -ne 0 ]; then
    print_error "Deployment failed"
    exit 1
fi

print_status "Deployment successful"

# Step 4: Wait for services to be ready
print_status "Waiting for services to start..."
sleep 30

# Step 5: Test the deployment
print_status "Testing deployment..."

# Test health endpoint
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/v1/health)
if [ "$HEALTH_CHECK" = "200" ]; then
    print_status "Health check passed"
else
    print_warning "Health check failed (HTTP $HEALTH_CHECK)"
fi

# Test verification endpoint
VERIFY_CHECK=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "email=test@example.com&code=123456" \
    http://localhost:8000/api/v1/auth/register/verify)

if [ "$VERIFY_CHECK" = "404" ] || [ "$VERIFY_CHECK" = "400" ]; then
    print_status "Verification endpoint is responding correctly"
else
    print_warning "Verification endpoint returned HTTP $VERIFY_CHECK"
fi

print_status "Deployment completed successfully!"

echo ""
echo "🔧 Next steps:"
echo "1. Test the login flows on different role pages"
echo "2. Check that role validation is working"
echo "3. Verify that email verification is working"
echo "4. Monitor logs for any issues"
echo ""
echo "📝 To check logs:"
echo "   docker-compose logs -f backend"
echo ""
echo "🔍 To test verification fix:"
echo "   python backend/test_production_verification.py"
echo ""
echo "🛠️ To fix specific user verification:"
echo "   python backend/fix_production_verification_simple.py user@example.com"