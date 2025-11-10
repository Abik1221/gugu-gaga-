# PostgreSQL Setup Guide for Production

## Option 1: Install PostgreSQL on EC2 (Recommended for Small Projects)

### Step 1: SSH into EC2
```bash
ssh -i your-key.pem ubuntu@13.48.57.119
```

### Step 2: Install PostgreSQL
```bash
# Update packages
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check status
sudo systemctl status postgresql
```

### Step 3: Create Database and User
```bash
# Switch to postgres user
sudo -u postgres psql

# Inside PostgreSQL prompt, run these commands:
CREATE DATABASE zemen_pharma;
CREATE USER zemen_user WITH PASSWORD 'YourStrongPassword123!';
GRANT ALL PRIVILEGES ON DATABASE zemen_pharma TO zemen_user;
ALTER DATABASE zemen_pharma OWNER TO zemen_user;

# Exit PostgreSQL
\q
```

### Step 4: Configure PostgreSQL for Local Access
```bash
# Edit PostgreSQL config to allow password authentication
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

Find this line:
```
local   all             all                                     peer
```

Change to:
```
local   all             all                                     md5
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

### Step 5: Update .env.production
```bash
nano ~/.env.production
```

Update the DATABASE_URL line:
```bash
DATABASE_URL=postgresql+psycopg://zemen_user:YourStrongPassword123!@localhost:5432/zemen_pharma
```

### Step 6: Install psycopg (PostgreSQL Driver)

Update your `backend/requirements.txt` to include:
```
psycopg[binary]>=3.1.0
```

Or install directly in container (already included in most Python images).

### Step 7: Run Database Migrations
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@13.48.57.119

# Run migrations inside Docker container
docker exec -it zemen-backend alembic upgrade head
```

---

## Option 2: Use AWS RDS PostgreSQL (Recommended for Production)

### Step 1: Create RDS Instance via AWS Console

1. Go to **RDS Dashboard** → **Create database**
2. **Engine**: PostgreSQL
3. **Version**: PostgreSQL 15.x
4. **Templates**: Free tier (or Production for better performance)
5. **DB instance identifier**: `zemen-pharma-db`
6. **Master username**: `zemen_admin`
7. **Master password**: Create strong password (save it!)
8. **DB instance class**: `db.t3.micro` (free tier) or `db.t3.small`
9. **Storage**: 20 GB gp3
10. **Public access**: Yes (for now, restrict later)
11. **VPC security group**: Create new or use existing
12. **Initial database name**: `zemen_pharma`
13. Click **Create database**

### Step 2: Configure Security Group

1. Go to **EC2** → **Security Groups**
2. Find RDS security group
3. Add inbound rule:
   - **Type**: PostgreSQL
   - **Port**: 5432
   - **Source**: EC2 security group (or EC2 IP)

### Step 3: Get RDS Endpoint

1. Go to **RDS** → **Databases**
2. Click on `zemen-pharma-db`
3. Copy **Endpoint** (e.g., `zemen-pharma-db.xxxxx.us-east-1.rds.amazonaws.com`)

### Step 4: Update .env.production

```bash
DATABASE_URL=postgresql+psycopg://zemen_admin:YOUR_PASSWORD@zemen-pharma-db.xxxxx.us-east-1.rds.amazonaws.com:5432/zemen_pharma
```

### Step 5: Test Connection from EC2

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@13.48.57.119

# Install PostgreSQL client
sudo apt install postgresql-client -y

# Test connection
psql -h zemen-pharma-db.xxxxx.us-east-1.rds.amazonaws.com -U zemen_admin -d zemen_pharma
# Enter password when prompted
```

### Step 6: Run Migrations

```bash
# Update .env.production on EC2
nano ~/.env.production

# Restart container
docker restart zemen-backend

# Run migrations
docker exec -it zemen-backend alembic upgrade head
```

---

## Option 3: Use Docker Compose with PostgreSQL (Development/Testing)

Create `docker-compose.yml` on EC2:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: zemen-postgres
    environment:
      POSTGRES_DB: zemen_pharma
      POSTGRES_USER: zemen_user
      POSTGRES_PASSWORD: YourStrongPassword123!
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  backend:
    image: YOUR_DOCKERHUB_USERNAME/zemen-pharma-backend:latest
    container_name: zemen-backend
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql+psycopg://zemen_user:YourStrongPassword123!@postgres:5432/zemen_pharma
    env_file:
      - .env.production
    ports:
      - "8000:8000"
    restart: unless-stopped

volumes:
  postgres_data:
```

Deploy:
```bash
docker-compose up -d
```

---

## Verify PostgreSQL Connection

### Test from Python
```bash
docker exec -it zemen-backend python -c "
from sqlalchemy import create_engine
engine = create_engine('postgresql+psycopg://zemen_user:PASSWORD@localhost:5432/zemen_pharma')
conn = engine.connect()
print('✅ Connected to PostgreSQL!')
conn.close()
"
```

### Check Tables
```bash
docker exec -it zemen-backend python -c "
from app.db.session import engine
from sqlalchemy import inspect
inspector = inspect(engine)
tables = inspector.get_table_names()
print('Tables:', tables)
"
```

---

## Database Backup & Restore

### Backup
```bash
# From EC2
docker exec zemen-backend pg_dump postgresql://zemen_user:PASSWORD@localhost:5432/zemen_pharma > backup_$(date +%Y%m%d).sql

# From RDS
pg_dump -h RDS_ENDPOINT -U zemen_admin -d zemen_pharma > backup_$(date +%Y%m%d).sql
```

### Restore
```bash
# To EC2 PostgreSQL
psql -U zemen_user -d zemen_pharma < backup_20241110.sql

# To RDS
psql -h RDS_ENDPOINT -U zemen_admin -d zemen_pharma < backup_20241110.sql
```

### Automated Backups (Cron)
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * docker exec zemen-backend pg_dump postgresql://zemen_user:PASSWORD@localhost:5432/zemen_pharma > /home/ubuntu/backups/backup_$(date +\%Y\%m\%d).sql
```

---

## Migration from SQLite to PostgreSQL

### Step 1: Export SQLite Data
```bash
# On your local machine or EC2
sqlite3 zemen_local.db .dump > sqlite_dump.sql
```

### Step 2: Convert SQLite to PostgreSQL Format
```bash
# Install pgloader
sudo apt install pgloader -y

# Convert and load
pgloader sqlite_dump.sql postgresql://zemen_user:PASSWORD@localhost:5432/zemen_pharma
```

Or manually:
```bash
# Clean up SQLite-specific syntax
sed -i 's/AUTOINCREMENT/SERIAL/g' sqlite_dump.sql
sed -i 's/INTEGER PRIMARY KEY/SERIAL PRIMARY KEY/g' sqlite_dump.sql

# Import to PostgreSQL
psql -U zemen_user -d zemen_pharma < sqlite_dump.sql
```

---

## Performance Tuning

### PostgreSQL Configuration
```bash
sudo nano /etc/postgresql/*/main/postgresql.conf
```

Recommended settings for small EC2 instance:
```
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 4MB
min_wal_size = 1GB
max_wal_size = 4GB
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

---

## Monitoring

### Check Database Size
```sql
SELECT pg_size_pretty(pg_database_size('zemen_pharma'));
```

### Check Table Sizes
```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Active Connections
```sql
SELECT count(*) FROM pg_stat_activity WHERE datname = 'zemen_pharma';
```

---

## Troubleshooting

### Can't connect to PostgreSQL
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check if port is open
sudo netstat -tulpn | grep 5432

# Check logs
sudo tail -f /var/log/postgresql/postgresql-*-main.log
```

### Permission denied
```bash
# Grant all privileges
sudo -u postgres psql
GRANT ALL PRIVILEGES ON DATABASE zemen_pharma TO zemen_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO zemen_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO zemen_user;
```

### Connection timeout
- Check security group allows port 5432
- Check PostgreSQL is listening on correct interface
- Verify DATABASE_URL is correct

---

## Cost Comparison

| Option | Monthly Cost | Pros | Cons |
|--------|-------------|------|------|
| **EC2 PostgreSQL** | $0 (included in EC2) | Free, full control | Manual backups, single point of failure |
| **RDS t3.micro** | ~$15 | Automated backups, managed | Additional cost |
| **RDS t3.small** | ~$30 | Better performance | Higher cost |

---

## Recommendation

**For Production**: Use **AWS RDS PostgreSQL** (t3.micro for start)
- ✅ Automated backups
- ✅ High availability
- ✅ Easy scaling
- ✅ Managed updates

**For Development/Testing**: Use **PostgreSQL on EC2**
- ✅ No additional cost
- ✅ Good for learning
- ✅ Full control

---

## Quick Setup Commands

```bash
# Install PostgreSQL on EC2
sudo apt update && sudo apt install postgresql postgresql-contrib -y

# Create database
sudo -u postgres psql -c "CREATE DATABASE zemen_pharma;"
sudo -u postgres psql -c "CREATE USER zemen_user WITH PASSWORD 'YourPassword123!';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE zemen_pharma TO zemen_user;"

# Update .env.production
echo "DATABASE_URL=postgresql+psycopg://zemen_user:YourPassword123!@localhost:5432/zemen_pharma" >> ~/.env.production

# Restart container
docker restart zemen-backend

# Run migrations
docker exec -it zemen-backend alembic upgrade head
```

**Done! Your production database is now PostgreSQL! 🎉**
