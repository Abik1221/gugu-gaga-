# AWS EC2 Deployment Guide

## Overview
Deploy Zemen Pharma backend to AWS EC2 using Docker with automated CI/CD from GitHub Actions.

---

## Step 1: Launch EC2 Instance

### 1.1 Create EC2 Instance via AWS Console

1. Go to **EC2 Dashboard** → **Launch Instance**
2. **Name**: `zemen-pharma-backend`
3. **AMI**: Ubuntu Server 22.04 LTS (Free tier eligible)
4. **Instance type**: `t2.micro` (1 vCPU, 1GB RAM) or `t3.small` (2 vCPU, 2GB RAM) recommended
5. **Key pair**: Create new or use existing (download `.pem` file - you'll need it!)
6. **Network settings**:
   - Allow SSH (port 22) from your IP
   - Allow HTTP (port 80) from anywhere
   - Allow HTTPS (port 443) from anywhere
   - Allow Custom TCP (port 8000) from anywhere
7. **Storage**: 20 GB gp3
8. Click **Launch Instance**

### 1.2 Or via AWS CLI

```bash
aws ec2 run-instances \
  --image-id ami-0c7217cdde317cfec \
  --instance-type t3.small \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxx \
  --subnet-id subnet-xxxxx \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=zemen-pharma-backend}]'
```

---

## Step 2: Configure Security Group

### Required Inbound Rules:

| Type | Protocol | Port | Source | Description |
|------|----------|------|--------|-------------|
| SSH | TCP | 22 | Your IP | SSH access |
| HTTP | TCP | 80 | 0.0.0.0/0 | HTTP traffic |
| HTTPS | TCP | 443 | 0.0.0.0/0 | HTTPS traffic |
| Custom TCP | TCP | 8000 | 0.0.0.0/0 | Backend API |

```bash
# Create security group
aws ec2 create-security-group \
  --group-name zemen-pharma-sg \
  --description "Security group for Zemen Pharma backend"

# Add rules
aws ec2 authorize-security-group-ingress --group-id sg-xxxxx --protocol tcp --port 22 --cidr YOUR_IP/32
aws ec2 authorize-security-group-ingress --group-id sg-xxxxx --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id sg-xxxxx --protocol tcp --port 443 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id sg-xxxxx --protocol tcp --port 8000 --cidr 0.0.0.0/0
```

---

## Step 3: Connect to EC2 and Install Docker

### 3.1 Connect via SSH

```bash
# Change permissions on your key file
chmod 400 your-key.pem

# Connect to EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### 3.2 Install Docker

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# Start Docker service
sudo systemctl enable docker
sudo systemctl start docker

# Verify installation
docker --version

# Log out and log back in for group changes to take effect
exit
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

---

## Step 4: Setup Environment Variables on EC2

### 4.1 Create Production Environment File

```bash
# Create .env.production file
nano ~/.env.production
```

Add the following (replace with your actual values):

```bash
# Application
ENVIRONMENT=production
DEBUG=false
APP_NAME=Zemen Pharma
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Database (use RDS endpoint)
DATABASE_URL=postgresql://username:password@your-rds-endpoint.rds.amazonaws.com:5432/zemen_pharma

# Redis (use ElastiCache endpoint or local)
REDIS_URL=redis://your-elasticache-endpoint:6379/0

# Gemini API
GEMINI_API_KEY=your-gemini-api-key

# Auth / JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRES_MINUTES=20160

# Rate limits
RATE_LIMIT_GENERAL_PER_MINUTE=60
RATE_LIMIT_GEMINI_PER_MINUTE=30

# Email (SMTP)
EMAIL_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
SMTP_USE_TLS=true
EMAIL_FROM=your-email@gmail.com

# LangGraph
USE_LANGGRAPH=false

# Scheduler
ENABLE_SCHEDULER=false
SCHEDULER_TENANTS=
SCHEDULER_INTERVAL_SECONDS=600
```

Save and exit (Ctrl+X, Y, Enter)

### 4.2 Secure the file

```bash
chmod 600 ~/.env.production
```

---

## Step 5: Setup Docker Hub Authentication

```bash
# Login to Docker Hub
docker login -u YOUR_DOCKERHUB_USERNAME

# Enter your Docker Hub token when prompted
```

---

## Step 6: Manual First Deployment

```bash
# Pull the image
docker pull YOUR_DOCKERHUB_USERNAME/YOUR_REPO:latest

# Run the container
docker run -d \
  --name zemen-backend \
  --restart unless-stopped \
  -p 8000:8000 \
  --env-file ~/.env.production \
  YOUR_DOCKERHUB_USERNAME/YOUR_REPO:latest

# Check if container is running
docker ps

# View logs
docker logs zemen-backend

# Follow logs
docker logs -f zemen-backend
```

### Test the API

```bash
# From EC2
curl http://localhost:8000/health

# From your machine
curl http://YOUR_EC2_PUBLIC_IP:8000/health
```

---

## Step 7: Setup GitHub Secrets

Go to GitHub → Settings → Secrets and variables → Actions

Add these secrets:

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `DOCKERHUB_USERNAME` | Docker Hub username | `yourusername` |
| `DOCKERHUB_TOKEN` | Docker Hub access token | `dckr_pat_xxxxx` |
| `DOCKERHUB_REPOSITORY` | Docker Hub repository | `yourusername/zemen-pharma-backend` |
| `EC2_HOST` | EC2 public IP or domain | `54.123.45.67` |
| `EC2_USERNAME` | EC2 SSH username | `ubuntu` |
| `EC2_SSH_KEY` | Private SSH key content | Contents of your `.pem` file |

### How to get EC2_SSH_KEY:

```bash
# On your local machine
cat your-key.pem
```

Copy the entire output including:
```
-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----
```

Paste this into the `EC2_SSH_KEY` secret.

---

## Step 8: Setup Nginx Reverse Proxy (Optional but Recommended)

### 8.1 Install Nginx

```bash
sudo apt install nginx -y
```

### 8.2 Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/zemen-pharma
```

Add:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 8.3 Enable the site

```bash
sudo ln -s /etc/nginx/sites-available/zemen-pharma /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8.4 Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically
sudo certbot renew --dry-run
```

---

## Step 9: Setup Database (RDS PostgreSQL)

### 9.1 Create RDS Instance

```bash
aws rds create-db-instance \
  --db-instance-identifier zemen-pharma-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password YOUR_STRONG_PASSWORD \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxx \
  --db-name zemen_pharma \
  --backup-retention-period 7 \
  --publicly-accessible
```

### 9.2 Update Security Group

Allow PostgreSQL (port 5432) from EC2 security group.

### 9.3 Update .env.production

```bash
nano ~/.env.production
```

Update `DATABASE_URL`:
```
DATABASE_URL=postgresql://admin:YOUR_PASSWORD@your-rds-endpoint.rds.amazonaws.com:5432/zemen_pharma
```

### 9.4 Restart container

```bash
docker restart zemen-backend
```

---

## Step 10: Automated Deployment

Now every time you push to `main` branch:

1. ✅ GitHub Actions builds Docker image
2. ✅ Pushes to Docker Hub
3. ✅ SSHs into EC2
4. ✅ Pulls latest image
5. ✅ Stops old container
6. ✅ Starts new container
7. ✅ Cleans up old images

**Just push your code and it deploys automatically!**

```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

---

## Monitoring and Maintenance

### View Container Logs

```bash
# View logs
docker logs zemen-backend

# Follow logs in real-time
docker logs -f zemen-backend

# Last 100 lines
docker logs --tail 100 zemen-backend
```

### Check Container Status

```bash
docker ps
docker stats zemen-backend
```

### Restart Container

```bash
docker restart zemen-backend
```

### Update Environment Variables

```bash
nano ~/.env.production
docker restart zemen-backend
```

### Manual Deployment

```bash
docker pull YOUR_DOCKERHUB_USERNAME/YOUR_REPO:latest
docker stop zemen-backend
docker rm zemen-backend
docker run -d \
  --name zemen-backend \
  --restart unless-stopped \
  -p 8000:8000 \
  --env-file ~/.env.production \
  YOUR_DOCKERHUB_USERNAME/YOUR_REPO:latest
```

---

## Backup and Recovery

### Database Backup

```bash
# Backup
docker exec zemen-backend pg_dump $DATABASE_URL > backup.sql

# Restore
docker exec -i zemen-backend psql $DATABASE_URL < backup.sql
```

### Create AMI Snapshot

```bash
aws ec2 create-image \
  --instance-id i-xxxxx \
  --name "zemen-pharma-backup-$(date +%Y%m%d)" \
  --description "Backup of Zemen Pharma backend"
```

---

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs zemen-backend

# Check if port is in use
sudo netstat -tulpn | grep 8000

# Check environment file
cat ~/.env.production
```

### Can't connect to database

```bash
# Test connection from EC2
docker exec zemen-backend python -c "import psycopg2; conn = psycopg2.connect('$DATABASE_URL'); print('Connected!')"
```

### GitHub Actions deployment fails

```bash
# Check SSH connection
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

# Check Docker is running
docker ps

# Check disk space
df -h
```

---

## Cost Optimization

1. **Use t3.micro** for development ($7/month)
2. **Use t3.small** for production ($15/month)
3. **Stop instance** when not in use (development)
4. **Use RDS t3.micro** ($15/month)
5. **Enable auto-scaling** for traffic spikes

**Estimated Monthly Cost**: $30-50 for small production setup

---

## Security Checklist

- [ ] SSH key is secure and not committed to Git
- [ ] Security group restricts SSH to your IP only
- [ ] Environment variables stored securely on EC2
- [ ] Database password is strong
- [ ] SSL certificate installed (HTTPS)
- [ ] Regular security updates: `sudo apt update && sudo apt upgrade`
- [ ] Docker images are from trusted sources
- [ ] Firewall configured properly
- [ ] Backups enabled

---

## Quick Commands Reference

```bash
# SSH to EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# View logs
docker logs -f zemen-backend

# Restart app
docker restart zemen-backend

# Pull and deploy manually
docker pull YOUR_REPO:latest && docker restart zemen-backend

# Check disk space
df -h

# Check memory
free -h

# Check running processes
docker ps

# Clean up Docker
docker system prune -af
```

---

## Success! 🎉

Your backend is now deployed on EC2 with:
- ✅ Automated CI/CD from GitHub
- ✅ Docker containerization
- ✅ Nginx reverse proxy
- ✅ SSL/HTTPS enabled
- ✅ Database on RDS
- ✅ Automatic restarts
- ✅ Log monitoring

**API URL**: `https://yourdomain.com` or `http://YOUR_EC2_IP:8000`
