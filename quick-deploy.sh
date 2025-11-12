#!/bin/bash

# Quick deployment without SSL complexity
set -e

echo "🚀 Quick deployment starting..."

# Stop and cleanup
docker stop $(docker ps -aq) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true

# Setup
docker network create zemen-net 2>/dev/null || true
docker volume create zemen-db-data 2>/dev/null || true

# Pull and run
docker pull docker.io/nahomkeneni/zemen-pharma:latest
docker pull docker.io/nahomkeneni/zemen-pharma-frontend:latest

# Migrations
docker run --rm --network zemen-net \
  -v zemen-db-data:/app/data \
  -e DATABASE_URL=sqlite:///./data/app.db \
  docker.io/nahomkeneni/zemen-pharma:latest \
  alembic upgrade head

# Backend
docker run -d --name zemen-backend \
  --network zemen-net \
  -v zemen-db-data:/app/data \
  -e DATABASE_URL=sqlite:///./data/app.db \
  -e DEBUG=false \
  --restart unless-stopped \
  docker.io/nahomkeneni/zemen-pharma:latest

# Frontend
docker run -d --name zemen-frontend \
  --network zemen-net \
  --restart unless-stopped \
  docker.io/nahomkeneni/zemen-pharma-frontend:latest

# Simple nginx
docker run -d --name zemen-nginx \
  --network zemen-net \
  -p 80:80 \
  --restart unless-stopped \
  -v /tmp/nginx.conf:/etc/nginx/nginx.conf:ro \
  nginx:alpine

# Create simple nginx config
sudo tee /tmp/nginx.conf > /dev/null << 'EOF'
events { worker_connections 1024; }
http {
    upstream backend { server zemen-backend:8000; }
    upstream frontend { server zemen-frontend:3000; }
    
    server {
        listen 80;
        location /api/ { proxy_pass http://backend; }
        location /health { proxy_pass http://backend; }
        location / { proxy_pass http://frontend; }
    }
}
EOF

docker restart zemen-nginx
sleep 5
docker ps
echo "✅ Quick deployment done!"