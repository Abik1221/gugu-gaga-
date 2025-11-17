# Admin Login Verification Guide

## Default Admin Credentials ✅

The system automatically creates an admin user on startup with these credentials:

### **Production Admin**:
- **Email**: `nahomkeneni4@gmail.com`
- **Password**: `Nahom@keneni`
- **Role**: `admin`
- **Status**: Auto-verified and approved

## Admin Login Process ✅

### **Step 1: Access Admin Login**
- **Secure URL**: `/secure-admin-zmp-7x9k` → Redirects to admin login
- **Direct URL**: `/superadin/zemnpharma/login`
- **Blocked URL**: `/dashboard/admin` → Returns 404 (security)

### **Step 2: Two-Factor Authentication**
1. Enter email: `nahomkeneni4@gmail.com`
2. Enter password: `Nahom@keneni`
3. System sends OTP to email
4. Enter OTP code to complete login
5. Redirected to admin dashboard

### **Step 3: Password Change (Optional)**
- Use `/api/v1/auth/change-password` endpoint
- Requires current password + new password
- All other sessions are revoked for security

## Security Features ✅

### **Admin Route Protection**:
- ✅ `/dashboard/admin` → Blocked (404 error)
- ✅ `/secure-admin-zmp-7x9k` → Hidden admin access
- ✅ Two-factor authentication required
- ✅ IP logging and security monitoring

### **Admin Seeder**:
- ✅ Auto-creates admin on startup
- ✅ Uses environment variables
- ✅ Skips if admin already exists
- ✅ Sets proper permissions

## Testing Admin Login

### **Manual Test**:
1. Go to: `https://mymesob.com/secure-admin-zmp-7x9k`
2. Enter: `nahomkeneni4@gmail.com`
3. Enter: `Nahom@keneni`
4. Check email for OTP
5. Enter OTP code
6. Should redirect to admin dashboard

### **API Test**:
```bash
# Step 1: Request code
curl -X POST "https://mymesob.com/api/v1/auth/login/request-code" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=nahomkeneni4@gmail.com&password=Nahom@keneni&grant_type=password"

# Step 2: Verify code (replace CODE with actual code from email)
curl -X POST "https://mymesob.com/api/v1/auth/login/verify" \
  -H "Content-Type: application/json" \
  -d '{"email":"nahomkeneni4@gmail.com","code":"CODE"}'
```

## Environment Configuration ✅

The admin credentials are set in `.env.production`:
```env
ADMIN_EMAIL=nahomkeneni4@gmail.com
ADMIN_PASSWORD=Nahom@keneni
```

## Security Notes ⚠️

1. **Change Default Password**: After first login, change the default password
2. **Secure Access**: Only use the hidden admin URL
3. **Monitor Access**: Check logs for unauthorized attempts
4. **Regular Updates**: Keep admin credentials secure

## Troubleshooting

### **If Admin Login Fails**:
1. Check if backend is running
2. Verify email service is configured
3. Check database for admin user
4. Run admin seeder manually if needed

### **Reset Admin Password**:
1. Use password reset flow with admin email
2. Or update directly in database
3. Or recreate admin user

---
**Status**: ✅ Admin login system verified and working
**Security**: ✅ Hidden routes and 2FA protection active