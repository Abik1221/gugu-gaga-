# Complete Docker Deployment Guide

## Overview
Everything runs in Docker containers:
- ✅ PostgreSQL database
- ✅ Backend API
- ✅ Automatic database migrations
- ✅ Persistent data storage
- ✅ Automatic restarts

---

## What's Included

### Docker Compose Setup (`docker-compose.prod.yml`)

```yaml
services:
  postgres:
    - PostgreSQL 15 Alpine (lightweight)
    - Persistent volume for data
    - Health checks
    - Auto-restart
  
  backend:
    - Your FastAPI application
    - Waits for PostgreSQL to be healthy
    - Runs migrations automatically on startup
    - Connects to PostgreSQL via Docker network
```

---

## Automatic Deployment Flow

1. **Push to GitHub** → Triggers CI/CD
2. **Build Docker image** → Pushes to Docker Hub
3. **Upload files to EC2**:
   - `.env.production`
   - `docker-compose.prod.yml`
4. **Install Docker & Docker Compose** (if not present)
5. **Pull latest image** from Docker Hub
6. **Stop old containers**
7. **Start new containers** with Docker Compose
8. **PostgreSQL starts** → Health check passes
9. **Backend starts** → Runs migrations → Starts API
10. **Done!** ✅

---

## Manual Deployment (First Time)

### Step 1: SSH into EC2
```bash
ssh -i your-key.pem ubuntu@13.48.57.119
```

### Step 2: Install Docker & Docker Compose (if needed)
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker --version
docker-compose --version
```

### Step 3: Create deployment directory
```bash
mkdir -p ~/deployment
cd ~/deployment
```

### Step 4: Upload files
From your local machine:
```bash
scp -i your-key.pem backend/.env.production ubuntu@13.48.57.119:~/deployment/
scp -i your-key.pem backend/docker-compose.prod.yml ubuntu@13.48.57.119:~/deployment/
```

### Step 5: Deploy
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@13.48.57.119
cd ~/deployment

# Set Docker image
export DOCKER_IMAGE=YOUR_DOCKERHUB_USERNAME/zemen-pharma-backend:latest

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

---

## Useful Commands

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Backend only
docker-compose -f docker-compose.prod.yml logs -f backend

# PostgreSQL only
docker-compose -f docker-compose.prod.yml logs -f postgres

# Last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100
```

### Check Status
```bash
# Service status
docker-compose -f docker-compose.prod.yml ps

# Container details
docker ps

# Resource usage
docker stats
```

### Restart Services
```bash
# Restart all
docker-compose -f docker-compose.prod.yml restart

# Restart backend only
docker-compose -f docker-compose.prod.yml restart backend

# Restart PostgreSQL only
docker-compose -f docker-compose.prod.yml restart postgres
```

### Stop Services
```bash
# Stop all (keeps data)
docker-compose -f docker-compose.prod.yml stop

# Stop and remove containers (keeps data)
docker-compose -f docker-compose.prod.yml down

# Stop and remove everything including volumes (DELETES DATA!)
docker-compose -f docker-compose.prod.yml down -v
```

### Update Application
```bash
# Pull latest image
docker pull YOUR_DOCKERHUB_USERNAME/zemen-pharma-backend:latest

# Recreate backend container
docker-compose -f docker-compose.prod.yml up -d --force-recreate backend
```

---

## Database Management

### Access PostgreSQL
```bash
# Connect to PostgreSQL container
docker exec -it zemen-postgres psql -U zemen_user -d zemen_pharma

# Inside PostgreSQL:
\dt              # List tables
\d users         # Describe users table
SELECT * FROM users LIMIT 5;
\q               # Exit
```

### Run Migrations Manually
```bash
# Run migrations
docker exec -it zemen-backend alembic upgrade head

# Check migration status
docker exec -it zemen-backend alembic current

# Create new migration
docker exec -it zemen-backend alembic revision --autogenerate -m "description"
```

### Backup Database
```bash
# Create backup
docker exec zemen-postgres pg_dump -U zemen_user zemen_pharma > backup_$(date +%Y%m%d).sql

# Restore backup
cat backup_20241110.sql | docker exec -i zemen-postgres psql -U zemen_user -d zemen_pharma
```

### Reset Database (CAUTION!)
```bash
# Stop services
docker-compose -f docker-compose.prod.yml down

# Remove PostgreSQL volume (DELETES ALL DATA!)
docker volume rm deployment_postgres_data

# Start fresh
docker-compose -f docker-compose.prod.yml up -d
```

---

## Update Environment Variables

### Step 1: Edit .env.production
```bash
nano ~/.env.production
```

### Step 2: Restart backend
```bash
docker-compose -f docker-compose.prod.yml restart backend
```

---

## Troubleshooting

### Backend won't start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs backend

# Check if PostgreSQL is healthy
docker-compose -f docker-compose.prod.yml ps

# Restart services
docker-compose -f docker-compose.prod.yml restart
```

### Database connection failed
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check PostgreSQL logs
docker-compose -f docker-compose.prod.yml logs postgres

# Test connection
docker exec -it zemen-postgres psql -U zemen_user -d zemen_pharma -c "SELECT 1;"
```

### Migration failed
```bash
# Check migration logs
docker-compose -f docker-compose.prod.yml logs backend | grep migration

# Run migrations manually
docker exec -it zemen-backend alembic upgrade head

# Check current migration version
docker exec -it zemen-backend alembic current
```

### Port already in use
```bash
# Check what's using port 8000
sudo netstat -tulpn | grep 8000

# Kill process
sudo kill -9 <PID>

# Or change port in docker-compose.prod.yml
ports:
  - "8001:8000"  # Use 8001 instead
```

### Out of disk space
```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -af
docker volume prune -f

# Remove old images
docker image prune -af
```

---

## Monitoring

### Health Check
```bash
# Check API health
curl http://localhost:8000/health

# Check from outside
curl http://13.48.57.119:8000/health
```

### Resource Usage
```bash
# Real-time stats
docker stats

# Disk usage
docker system df

# Container logs size
docker ps -a --format "table {{.Names}}\t{{.Size}}"
```

---

## Security Best Practices

### Change Default Password
Edit `docker-compose.prod.yml`:
```yaml
environment:
  POSTGRES_PASSWORD: YOUR_STRONG_PASSWORD_HERE
```

And update `.env.production`:
```bash
DATABASE_URL=postgresql+psycopg://zemen_user:YOUR_STRONG_PASSWORD_HERE@postgres:5432/zemen_pharma
```

### Restrict PostgreSQL Port
Remove port exposure if not needed externally:
```yaml
# Comment out or remove:
# ports:
#   - "5432:5432"
```

### Use Docker Secrets (Advanced)
For production, consider using Docker secrets instead of environment variables.

---

## Backup Strategy

### Automated Daily Backups
```bash
# Create backup script
cat > ~/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)
docker exec zemen-postgres pg_dump -U zemen_user zemen_pharma > $BACKUP_DIR/backup_$DATE.sql
# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
echo "Backup completed: backup_$DATE.sql"
EOF

chmod +x ~/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add line:
0 2 * * * /home/ubuntu/backup.sh >> /home/ubuntu/backup.log 2>&1
```

---

## Scaling

### Increase Resources
Edit `docker-compose.prod.yml`:
```yaml
backend:
  deploy:
    resources:
      limits:
        cpus: '1.0'
        memory: 1G
      reservations:
        cpus: '0.5'
        memory: 512M
```

### Multiple Backend Instances (Load Balancing)
```yaml
backend:
  deploy:
    replicas: 3
```

---

## Quick Reference

```bash
# Start everything
docker-compose -f docker-compose.prod.yml up -d

# Stop everything
docker-compose -f docker-compose.prod.yml down

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart backend
docker-compose -f docker-compose.prod.yml restart backend

# Update backend
docker pull YOUR_IMAGE:latest && docker-compose -f docker-compose.prod.yml up -d --force-recreate backend

# Backup database
docker exec zemen-postgres pg_dump -U zemen_user zemen_pharma > backup.sql

# Access PostgreSQL
docker exec -it zemen-postgres psql -U zemen_user -d zemen_pharma

# Run migrations
docker exec -it zemen-backend alembic upgrade head

# Check health
curl http://localhost:8000/health
```

---

## Success! 🎉

Your production environment now has:
- ✅ PostgreSQL database in Docker
- ✅ Backend API in Docker
- ✅ Automatic migrations on startup
- ✅ Persistent data storage
- ✅ Automatic restarts
- ✅ Easy updates via CI/CD

**Just push to GitHub and everything deploys automatically!**
