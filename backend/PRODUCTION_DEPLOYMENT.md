# 🚀 Production Deployment Guide

## 🔒 Secure Admin Setup

### Step 1: Generate Production Credentials
```bash
# On your local machine
python production_admin_setup.py
```
This generates:
- Ultra-secure 32-character admin password
- 64-byte JWT secret
- Complete production environment file

### Step 2: Server Deployment

#### Option A: Docker Deployment (Recommended)
```bash
# 1. Copy files to server
scp -r backend/ user@your-server:/opt/zemen-pharma/
scp .env.production.secure user@your-server:/opt/zemen-pharma/.env

# 2. On server - Build and run
cd /opt/zemen-pharma
docker-compose -f docker-compose.prod.yml up -d
```

#### Option B: Direct Server Deployment
```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Set up environment
cp .env.production.secure .env

# 3. Run migrations
alembic upgrade head

# 4. Start server
python start_server.py
```

### Step 3: Generate Admin in Production

#### Method 1: Using Secure Generator (Recommended)
```bash
# On production server
python scripts/secure_admin_generator.py --email admin@yourcompany.com --force
```

#### Method 2: Environment Variables (Auto-creation)
The admin user is automatically created on server startup using `.env` credentials.

#### Method 3: Manual Production Admin Creation
```bash
# SSH into production server
python -c "
from app.db.session import SessionLocal
from app.core.admin_security import AdminSecurityManager

db = SessionLocal()
result = AdminSecurityManager.create_secure_admin(
    db=db, 
    email='admin@yourcompany.com', 
    force_new=True
)
print(f'Email: {result[\"email\"]}')
print(f'Password: {result[\"password\"]}')
db.close()
"
```

## 🛡️ Production Security Checklist

### ✅ Server Security
- [ ] Enable firewall (only ports 80, 443, 22)
- [ ] Disable root SSH login
- [ ] Use SSH keys only
- [ ] Enable fail2ban
- [ ] Regular security updates

### ✅ Application Security
- [ ] HTTPS only (SSL certificate)
- [ ] Strong JWT secrets (64+ characters)
- [ ] Database encryption at rest
- [ ] Regular backups
- [ ] Log monitoring

### ✅ Admin Security
- [ ] Complex passwords (32+ characters)
- [ ] IP whitelist for admin access
- [ ] MFA enabled (future enhancement)
- [ ] Regular password rotation
- [ ] Audit logging enabled

## 🔑 Admin Login Process

### Development
```
URL: http://localhost:3000/superadin/zeenpharma/login
Email: admin@zemensystem.com
Password: secret
```

### Production
```
URL: https://yourdomain.com/superadin/zeenpharma/login
Email: [generated secure email]
Password: [32-character secure password]
```

## 📊 Monitoring & Maintenance

### Log Monitoring
```bash
# Check admin login attempts
tail -f /var/log/zemen-pharma/admin.log

# Monitor failed logins
grep "admin.login.failed" /var/log/zemen-pharma/audit.log
```

### Password Rotation
```bash
# Generate new admin password (monthly)
python scripts/secure_admin_generator.py --email admin@yourcompany.com --force
```

### Security Audit
```bash
# Check admin access logs
python -c "
from app.db.session import SessionLocal
from app.models.audit_log import AuditLog

db = SessionLocal()
logs = db.query(AuditLog).filter(AuditLog.action.like('admin.%')).limit(100).all()
for log in logs:
    print(f'{log.created_at}: {log.action} - {log.message}')
"
```

## 🚨 Emergency Access Recovery

### If Admin Password Lost
```bash
# SSH to server and reset
python scripts/secure_admin_generator.py --email admin@yourcompany.com --force --output file
```

### If Database Corrupted
```bash
# Restore from backup
cp backup/app.db.backup ./app.db
python scripts/secure_admin_generator.py --email admin@yourcompany.com --force
```

## 📞 Support Contacts
- Technical Support: support@zemensystem.com
- Security Issues: security@zemensystem.com
- Emergency: +251-XXX-XXXX