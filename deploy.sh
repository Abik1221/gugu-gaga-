#!/bin/bash

# Zemen Pharma Deployment Script
set -e

echo "🚀 Starting Zemen Pharma deployment..."

# Configuration
BACKEND_IMAGE="docker.io/nahomkeneni/zemen-pharma"
FRONTEND_IMAGE="docker.io/nahomkeneni/zemen-pharma-frontend"

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker stop zemen-backend zemen-frontend zemen-nginx 2>/dev/null || true
docker rm zemen-backend zemen-frontend zemen-nginx 2>/dev/null || true

# Setup network and volume
echo "🔧 Setting up network and storage..."
docker network create zemen-net 2>/dev/null || true
docker volume create zemen-db-data 2>/dev/null || true

# Pull latest images
echo "📥 Pulling latest images..."
docker pull $BACKEND_IMAGE:latest
docker pull $FRONTEND_IMAGE:latest

# Run database migrations
echo "🗃️ Running database migrations..."
docker run --rm --network zemen-net \
  -v zemen-db-data:/app/data \
  -e DATABASE_URL=sqlite:///./data/app.db \
  $BACKEND_IMAGE:latest \
  alembic upgrade head

# Start backend
echo "🔧 Starting backend service..."
docker run -d --name zemen-backend \
  --network zemen-net \
  -v zemen-db-data:/app/data \
  -e DATABASE_URL=sqlite:///./data/app.db \
  -e DEBUG=false \
  -e EMAIL_ENABLED=true \
  -e SMTP_HOST=smtp.gmail.com \
  -e SMTP_PORT=587 \
  -e SMTP_USERNAME=nahomkeneni4@gmail.com \
  -e SMTP_PASSWORD=bajfugnwibkrpgvg \
  -e SMTP_USE_TLS=true \
  -e EMAIL_FROM=nahomkeneni4@gmail.com \
  -e CORS_ORIGINS=http://localhost:3000,http://13.61.24.25:8000,http://mymesob.com,https://mymesob.com,http://www.mymesob.com,https://www.mymesob.com \
  --restart unless-stopped \
  $BACKEND_IMAGE:latest

# Start frontend
echo "🎨 Starting frontend service..."
docker run -d --name zemen-frontend \
  --network zemen-net \
  --restart unless-stopped \
  $FRONTEND_IMAGE:latest

# Setup nginx configuration
echo "🌐 Setting up nginx..."
sudo mkdir -p /etc/nginx/conf.d
sudo tee /etc/nginx/conf.d/app.conf > /dev/null << 'EOF'
server {
    listen 80;
    server_name mymesob.com www.mymesob.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name mymesob.com www.mymesob.com;
    
    ssl_certificate /etc/letsencrypt/live/mymesob.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mymesob.com/privkey.pem;
    
    client_max_body_size 50M;
    
    location /api/ {
        proxy_pass http://zemen-backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /health {
        proxy_pass http://zemen-backend:8000;
        proxy_set_header Host $host;
    }
    
    location / {
        proxy_pass http://zemen-frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Start nginx
echo "🔒 Starting nginx with SSL..."
docker run -d --name zemen-nginx \
  --network zemen-net \
  -p 80:80 -p 443:443 \
  -v /etc/nginx/conf.d:/etc/nginx/conf.d:ro \
  -v /etc/letsencrypt:/etc/letsencrypt:ro \
  --restart unless-stopped \
  nginx:alpine

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Show final status
echo "📊 Final status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo "✅ Deployment completed successfully!"
echo "🌐 Your application is available at: https://mymesob.com"