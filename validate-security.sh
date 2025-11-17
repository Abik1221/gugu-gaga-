#!/bin/bash

# Security validation script for MesobAI deployment
echo "🔒 Validating security fixes..."

# Check critical security files
SECURITY_FILES=(
    "front_end/middleware.ts"
    "front_end/components/auth/role-specific-guard.tsx"
    "front_end/components/auth/auth-redirect-handler.tsx"
    "front_end/.env.production"
    "backend/.env.production"
)

ALL_GOOD=true

for file in "${SECURITY_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - MISSING!"
        ALL_GOOD=false
    fi
done

if [ "$ALL_GOOD" = true ]; then
    echo "✅ All security files present"
    echo "🚀 Ready for deployment"
    exit 0
else
    echo "❌ Security validation failed"
    exit 1
fi