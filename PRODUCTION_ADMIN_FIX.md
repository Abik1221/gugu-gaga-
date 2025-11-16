# 🔧 Production Admin Login Fix

## 🚨 **ISSUE**: Production admin login not working

### **🛠️ Quick Fix Steps:**

#### **Method 1: SSH to Production Server**
```bash
# SSH to your production server
ssh user@your-production-server

# Navigate to backend directory
cd /path/to/backend

# Run the fix script
python fix_production_admin.py
```

#### **Method 2: Direct Database Fix**
```bash
# SSH to server and run SQL directly
ssh user@your-server
cd /path/to/backend

# Fix admin user in database
sqlite3 app.db "
DELETE FROM users WHERE role = 'admin';
INSERT INTO users (email, password_hash, role, is_active, is_approved, is_verified, tenant_id, created_at, updated_at) 
VALUES (
  'nahomkeneni4@gmail.com', 
  '\$2b\$12\$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 
  'admin', 1, 1, 1, NULL, 
  datetime('now'), datetime('now')
);
SELECT 'Admin fixed: nahomkeneni4@gmail.com / secret' as result;
"
```

#### **Method 3: Environment Variable Fix**
```bash
# Update production environment and restart
ssh user@your-server

# Set admin credentials in environment
export ADMIN_EMAIL=nahomkeneni4@gmail.com
export ADMIN_PASSWORD=Nahom@keneni

# Restart backend service
docker restart zemen-backend
# OR
systemctl restart zemen-pharma
```

### **🔑 Fixed Credentials:**
```
URL: https://mymesob.com/superadin/zeenpharma/login
Email: nahomkeneni4@gmail.com
Password: secret  (if using Method 2)
Password: Nahom@keneni  (if using Method 1 or 3)
```

### **🧪 Test Login:**
```bash
# Test the API directly
curl -X POST "https://mymesob.com/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=nahomkeneni4@gmail.com&password=secret&grant_type=password"
```

**Choose any method and the admin login will work! 🎯**