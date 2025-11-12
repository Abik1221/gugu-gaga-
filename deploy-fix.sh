#!/bin/bash
set -e

# Open firewall ports
sudo ufw allow 80/tcp 2>/dev/null || true
sudo ufw allow 443/tcp 2>/dev/null || true

# Stop and remove containers gracefully
echo "Stopping existing containers..."
docker stop zemen-nginx zemen-frontend zemen-backend 2>/dev/null || true
docker rm zemen-nginx zemen-frontend zemen-backend 2>/dev/null || true

# Create network (ignore if exists)
docker network create zemen-net 2>/dev/null || true

# Pull images
echo "Pulling latest images..."
docker pull docker.io/***:latest
docker pull docker.io/***-frontend:latest

# Create volume
docker volume create zemen-db-data 2>/dev/null || true

# Run migrations
echo "Running database migrations..."
docker run --rm --name zemen-migration \
  --network zemen-net \
  -v zemen-db-data:/app/data \
  -e DATABASE_URL=sqlite:///./data/app.db \
  docker.io/***:latest \
  alembic upgrade head

# Start backend (detached, no restart loops)
echo "Starting backend..."
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
  -e CORS_ORIGINS=http://localhost:3000,http://***:8000,http://mymesob.com,https://mymesob.com,http://www.mymesob.com,https://www.mymesob.com \
  --restart unless-stopped \
  docker.io/***:latest

# Start frontend
echo "Starting frontend..."
docker run -d --name zemen-frontend \
  --network zemen-net \
  --restart unless-stopped \
  docker.io/***-frontend:latest

# SSL setup (non-interactive)
if [ ! -f /etc/letsencrypt/live/mymesob.com/fullchain.pem ]; then
  echo "Setting up SSL..."
  sudo apt update && sudo apt install -y certbot >/dev/null 2>&1
  sudo systemctl stop nginx 2>/dev/null || true
  sudo certbot certonly --standalone -d mymesob.com -d www.mymesob.com \
    --email admin@mymesob.com --agree-tos --non-interactive >/dev/null 2>&1 || echo "SSL setup skipped"
fi

# Nginx config
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
echo "Starting nginx..."
docker run -d --name zemen-nginx \
  --network zemen-net \
  -p 80:80 -p 443:443 \
  -v /etc/nginx/conf.d:/etc/nginx/conf.d:ro \
  -v /etc/letsencrypt:/etc/letsencrypt:ro \
  --restart unless-stopped \
  nginx:alpine

# Quick verification
echo "Verifying deployment..."
sleep 10
docker ps --format "table {{.Names}}\t{{.Status}}"

echo "Deployment completed successfully!"