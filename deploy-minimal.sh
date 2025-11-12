#!/bin/bash

# Stop existing containers
docker stop $(docker ps -q) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true

# Create network
docker network create zemen-net 2>/dev/null || true

# Pull images
docker pull docker.io/***:latest
docker pull docker.io/***-frontend:latest

# Create volume
docker volume create zemen-db-data 2>/dev/null || true

# Run migrations
docker run --rm --network zemen-net \
  -v zemen-db-data:/app/data \
  -e DATABASE_URL=sqlite:///./data/app.db \
  docker.io/***:latest \
  alembic upgrade head

# Start backend (DETACHED - this was the issue)
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
  -e CORS_ORIGINS=http://localhost:3000,http://mymesob.com,https://mymesob.com \
  docker.io/***:latest \
  sh -c "uvicorn app.main:app --host 0.0.0.0 --port 8000 &"

# Start frontend
docker run -d --name zemen-frontend \
  --network zemen-net \
  docker.io/***-frontend:latest

# Start nginx
docker run -d --name zemen-nginx \
  --network zemen-net \
  -p 80:80 -p 443:443 \
  nginx:alpine

# Wait briefly and show status
sleep 5
docker ps

echo "Deployment completed!"