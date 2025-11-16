# 🚀 Production Admin Login Guide

## ✅ **PRODUCTION CREDENTIALS CONFIGURED**

### **🔑 Admin Login Details:**
```
URL: https://mymesob.com/superadin/zeenpharma/login
Email: admin@zemensystem.com
Password: ProductionAdmin2024!
```

### **🛠️ Setup Steps:**

#### **Step 1: Sync Production Database**
```bash
# On production server (https://mymesob.com)
cd /path/to/backend
python production_admin_sync.py
```

#### **Step 2: Verify API Connection**
```bash
# Test production API
curl -X POST "https://mymesob.com/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@zemensystem.com&password=ProductionAdmin2024!&grant_type=password"
```

#### **Step 3: Frontend Production Build**
```bash
# Build frontend for production
cd front_end
npm run build
npm start
```

### **🌐 Production Environment:**
- **Backend API**: `https://mymesob.com/api/v1`
- **Frontend**: Uses production API automatically
- **Database**: Production SQLite with admin user
- **CORS**: Configured for mymesob.com domain

### **🔧 Quick Production Admin Reset:**
```bash
# If admin login fails, run this on production server:
python -c "
import sys, os
sys.path.append('.')
from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import hash_password
from app.core.roles import Role

db = SessionLocal()
db.query(User).filter(User.role == 'admin').delete()
admin = User(
    email='admin@zemensystem.com',
    password_hash=hash_password('ProductionAdmin2024!'),
    role='admin',
    is_active=True,
    is_approved=True,
    is_verified=True
)
db.add(admin)
db.commit()
print('✅ Admin reset complete')
db.close()
"
```

### **📱 Login Process:**
1. Go to: `https://mymesob.com/superadin/zeenpharma/login`
2. Enter: `admin@zemensystem.com`
3. Enter: `ProductionAdmin2024!`
4. Click "Sign in"
5. Redirected to admin dashboard

### **🛡️ Security Notes:**
- Password is 18 characters with special chars
- JWT tokens expire in 14 days (production setting)
- CORS restricted to mymesob.com domain
- All admin actions are logged

**Ready for production! 🎯**