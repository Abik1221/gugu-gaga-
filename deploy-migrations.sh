#!/bin/bash

# Deploy database migrations script
# This script can be run manually or by CI/CD to apply database migrations

set -e

echo "🔄 Starting database migration deployment..."

# Configuration
BACKEND_IMAGE="nahomkeneni/zemen-pharma"
NETWORK_NAME="zemen-net"
VOLUME_NAME="zemen-db-data"

# Create network if it doesn't exist
docker network create $NETWORK_NAME 2>/dev/null || echo "Network $NETWORK_NAME already exists"

# Create volume if it doesn't exist
docker volume create $VOLUME_NAME 2>/dev/null || echo "Volume $VOLUME_NAME already exists"

# Pull latest backend image
echo "📥 Pulling latest backend image..."
docker pull $BACKEND_IMAGE:latest

# Run migrations
echo "🗄️ Running database migrations..."
docker run --rm --name zemen-migration \
  --network $NETWORK_NAME \
  -v $VOLUME_NAME:/app/data \
  -e DATABASE_URL=sqlite:///./data/app.db \
  -e DEBUG=false \
  $BACKEND_IMAGE:latest \
  sh -c "alembic upgrade head"

echo "✅ Database migrations completed successfully!"

# Optional: Show current migration status
echo "📊 Current migration status:"
docker run --rm --name zemen-migration-status \
  --network $NETWORK_NAME \
  -v $VOLUME_NAME:/app/data \
  -e DATABASE_URL=sqlite:///./data/app.db \
  -e DEBUG=false \
  $BACKEND_IMAGE:latest \
  sh -c "alembic current"

echo "🎉 Migration deployment complete!"