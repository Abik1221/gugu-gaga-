#!/usr/bin/env python3
"""
Production Verification Fix Script
Fixes common issues with OTP verification in production
"""

import os
import sys
import sqlite3
from datetime import datetime, timedelta

# Add the app directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '.'))

def fix_cors_settings():
    """Update CORS settings in production environment"""
    print("🔧 Fixing CORS settings...")
    
    env_file = ".env.production"
    if not os.path.exists(env_file):
        print(f"❌ {env_file} not found")
        return False
    
    # Read current settings
    with open(env_file, 'r') as f:
        lines = f.readlines()
    
    # Update CORS origins
    updated_lines = []
    cors_updated = False
    
    for line in lines:
        if line.startswith('CORS_ORIGINS='):
            # Ensure all necessary origins are included
            new_cors = 'CORS_ORIGINS=http://localhost:3000,http://13.61.24.25:8000,http://mymesob.com,https://mymesob.com,http://www.mymesob.com,https://www.mymesob.com,https://13.61.24.25:8000\n'
            updated_lines.append(new_cors)
            cors_updated = True
            print("✅ Updated CORS origins")
        else:
            updated_lines.append(line)
    
    if not cors_updated:
        # Add CORS settings if not present
        updated_lines.append('\n# CORS Settings\n')
        updated_lines.append('CORS_ORIGINS=http://localhost:3000,http://13.61.24.25:8000,http://mymesob.com,https://mymesob.com,http://www.mymesob.com,https://www.mymesob.com,https://13.61.24.25:8000\n')
        print("✅ Added CORS origins")
    
    # Write back
    with open(env_file, 'w') as f:
        f.writelines(updated_lines)
    
    return True

def clean_expired_codes():
    """Clean up expired verification codes"""
    print("🧹 Cleaning expired verification codes...")
    
    db_path = "./data/app.db"
    if not os.path.exists(db_path):
        print(f"❌ Database not found at {db_path}")
        return False
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Count expired codes
        cursor.execute("SELECT COUNT(*) FROM verification_codes WHERE expires_at < ?", (datetime.utcnow(),))
        expired_count = cursor.fetchone()[0]
        
        # Delete expired codes
        cursor.execute("DELETE FROM verification_codes WHERE expires_at < ?", (datetime.utcnow(),))
        conn.commit()
        
        print(f"✅ Cleaned {expired_count} expired verification codes")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Failed to clean expired codes: {e}")
        return False

def fix_user_verification_issues():
    """Fix common user verification issues"""
    print("👤 Fixing user verification issues...")
    
    db_path = "./data/app.db"
    if not os.path.exists(db_path):
        print(f"❌ Database not found at {db_path}")
        return False
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Find users with pending verification codes but not verified
        cursor.execute("""
            SELECT DISTINCT u.id, u.email, u.is_verified
            FROM users u
            JOIN verification_codes vc ON u.email = vc.email
            WHERE u.is_verified = 0 
            AND vc.purpose = 'register'
            AND vc.consumed = 0
            AND vc.expires_at >= ?
        """, (datetime.utcnow(),))
        
        pending_users = cursor.fetchall()
        
        if pending_users:
            print(f"📋 Found {len(pending_users)} users with pending verification:")
            for user in pending_users:
                print(f"  - {user[1]} (ID: {user[0]})")
        else:
            print("✅ No users with pending verification issues found")
        
        # Check for users with multiple unconsumed codes
        cursor.execute("""
            SELECT email, COUNT(*) as code_count
            FROM verification_codes
            WHERE consumed = 0 AND expires_at >= ?
            GROUP BY email
            HAVING COUNT(*) > 1
        """, (datetime.utcnow(),))
        
        duplicate_codes = cursor.fetchall()
        
        if duplicate_codes:
            print(f"🔄 Found {len(duplicate_codes)} emails with multiple active codes:")
            for email, count in duplicate_codes:
                print(f"  - {email}: {count} codes")
                
                # Keep only the most recent code for each email
                cursor.execute("""
                    DELETE FROM verification_codes
                    WHERE email = ? AND consumed = 0 AND expires_at >= ?
                    AND id NOT IN (
                        SELECT id FROM verification_codes
                        WHERE email = ? AND consumed = 0 AND expires_at >= ?
                        ORDER BY created_at DESC
                        LIMIT 1
                    )
                """, (email, datetime.utcnow(), email, datetime.utcnow()))
                
                print(f"    ✅ Cleaned duplicate codes for {email}")
        
        conn.commit()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Failed to fix user verification issues: {e}")
        return False

def create_enhanced_verification_endpoint():
    """Create an enhanced verification endpoint with better error handling"""
    print("🔧 Creating enhanced verification endpoint...")
    
    endpoint_code = '''
@router.post("/register/verify")
def verify_registration_enhanced(
    payload: RegistrationVerifyRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    """Enhanced registration verification with detailed error handling"""
    import logging
    logger = logging.getLogger(__name__)
    
    # Log the verification attempt
    logger.warning(f"🔍 Verification attempt: email={payload.email}, code={payload.code}")
    
    try:
        # Clean the inputs
        email = payload.email.strip().lower()
        code = str(payload.code).strip()
        
        # Check if user exists
        user = db.query(User).filter(User.email == email).first()
        if not user:
            logger.warning(f"❌ User not found: {email}")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No account found with this email address")
        
        # Check if already verified
        if user.is_verified:
            logger.warning(f"⚠️ User already verified: {email}")
            # Still create session for already verified users
            tokens = _issue_session_tokens(db, user, request)
            return {
                "status": "already_verified", 
                "access_token": tokens.access_token, 
                "token_type": "bearer",
                "refresh_token": tokens.refresh_token,
                "session_id": tokens.session_id,
                "user": _user_with_status(db, user)
            }
        
        # Verify the code with enhanced logging
        if not verify_code(db, email=email, purpose="register", code=code):
            logger.warning(f"❌ Invalid verification code: email={email}, code={code}")
            
            # Check what codes exist for debugging
            from app.models.verification import VerificationCode
            existing_codes = db.query(VerificationCode).filter(
                VerificationCode.email == email,
                VerificationCode.purpose == "register",
                VerificationCode.consumed == False,
                VerificationCode.expires_at >= datetime.utcnow(),
            ).all()
            
            logger.warning(f"📋 Existing valid codes for {email}: {[(c.code, c.expires_at) for c in existing_codes]}")
            
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired verification code")
        
        # Mark user as verified
        user.is_verified = True
        db.add(user)
        db.commit()
        
        logger.warning(f"✅ User verified successfully: {email}")
        
        # Create session tokens
        tokens = _issue_session_tokens(db, user, request)
        
        return {
            "status": "verified", 
            "access_token": tokens.access_token, 
            "token_type": "bearer",
            "refresh_token": tokens.refresh_token,
            "session_id": tokens.session_id,
            "user": _user_with_status(db, user)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Verification error: {type(e).__name__}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Verification failed due to server error")
'''
    
    # Write to a patch file
    with open("verification_endpoint_patch.py", "w") as f:
        f.write(endpoint_code)
    
    print("✅ Enhanced verification endpoint code saved to verification_endpoint_patch.py")
    print("   Apply this manually to app/api/v1/auth.py")
    
    return True

def create_frontend_api_fix():
    """Create a fix for frontend API configuration"""
    print("🔧 Creating frontend API fix...")
    
    api_fix = '''
// Enhanced API configuration for production
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://13.61.24.25:8000/api/v1";

// Enhanced registerVerify with better error handling
export const AuthAPI = {
  registerVerify: async (email: string, code: string) => {
    console.log('🔍 AuthAPI.registerVerify called with:', { email, code });
    
    // Try form-encoded first (as expected by FastAPI)
    try {
      const result = await postForm("/api/v1/auth/register/verify", { email, code });
      console.log('✅ registerVerify success (form):', result);
      return result;
    } catch (err: any) {
      console.error('❌ registerVerify failed (form):', err);
      
      // If form fails, try JSON
      if (err?.status === 422 || err?.status === 400) {
        console.warn("🔄 Retrying with JSON format");
        try {
          const result = await postJSON("/api/v1/auth/register/verify", { email, code });
          console.log('✅ registerVerify success (JSON):', result);
          return result;
        } catch (err2: any) {
          console.error('❌ registerVerify retry failed (JSON):', err2);
          throw new Error(err2?.message || err?.message || "Verification failed");
        }
      }
      
      // Handle specific error cases
      if (err?.status === 404) {
        throw new Error("No account found with this email address");
      } else if (err?.status === 400) {
        throw new Error("Invalid or expired verification code");
      } else if (err?.message?.includes("fetch")) {
        throw new Error("Network error - please check your connection");
      }
      
      throw err;
    }
  },
  
  // ... rest of AuthAPI methods
};

// Enhanced error handling for network issues
export async function postForm<T = any>(
  path: string,
  data: Record<string, string>,
  tenantId?: string
): Promise<T> {
  const body = new URLSearchParams(data);
  
  try {
    const res = await fetch(resolveApiUrl(path), {
      method: "POST",
      headers: buildHeaders(
        { "Content-Type": "application/x-www-form-urlencoded" },
        tenantId
      ),
      body,
    });

    if (!res.ok) {
      let parsed: any = null;
      try {
        parsed = await res.json();
      } catch {
        parsed = await res.text().catch(() => null);
      }

      let msg = "";
      if (!parsed) msg = `Request failed with ${res.status}`;
      else if (typeof parsed === "string") msg = parsed;
      else if (Array.isArray(parsed)) msg = parsed.join(", ");
      else if (parsed?.detail) msg = parsed.detail;
      else if (parsed?.message) msg = parsed.message;
      else if (parsed?.error) msg = parsed.error;
      else msg = JSON.stringify(parsed);

      const err: any = new Error(msg || `Request failed with ${res.status}`);
      err.status = res.status;
      err.body = parsed;
      console.error("[postForm] failed", { path, status: res.status, parsed });
      throw err;
    }

    return (await res.json()) as T;
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error - please check your connection and try again');
    }
    throw error;
  }
}
'''
    
    with open("frontend_api_fix.ts", "w") as f:
        f.write(api_fix)
    
    print("✅ Frontend API fix saved to frontend_api_fix.ts")
    print("   Apply relevant parts to front_end/utils/api.ts")
    
    return True

def main():
    print("🔧 Mesob Production Verification Fix Tool")
    print("=" * 50)
    
    print("\n1. Fixing CORS settings...")
    cors_ok = fix_cors_settings()
    
    print("\n2. Cleaning expired verification codes...")
    clean_ok = clean_expired_codes()
    
    print("\n3. Fixing user verification issues...")
    user_ok = fix_user_verification_issues()
    
    print("\n4. Creating enhanced verification endpoint...")
    endpoint_ok = create_enhanced_verification_endpoint()
    
    print("\n5. Creating frontend API fix...")
    frontend_ok = create_frontend_api_fix()
    
    print("\n" + "=" * 50)
    print("📊 Fix Summary:")
    print(f"  CORS Settings: {'✅ Fixed' if cors_ok else '❌ Failed'}")
    print(f"  Database Cleanup: {'✅ Done' if clean_ok else '❌ Failed'}")
    print(f"  User Issues: {'✅ Fixed' if user_ok else '❌ Failed'}")
    print(f"  Backend Patch: {'✅ Created' if endpoint_ok else '❌ Failed'}")
    print(f"  Frontend Fix: {'✅ Created' if frontend_ok else '❌ Failed'}")
    
    print("\n🚀 Next Steps:")
    print("1. Restart the backend server to apply CORS changes")
    print("2. Apply the verification endpoint patch to app/api/v1/auth.py")
    print("3. Apply the frontend API fix to front_end/utils/api.ts")
    print("4. Test the verification flow")
    print("5. Check server logs for any remaining issues")
    
    print("\n📋 Manual Checks:")
    print("- Ensure port 8000 is open on the server")
    print("- Verify DNS resolution for mymesob.com")
    print("- Check if SSL certificate is properly configured")
    print("- Test from different networks/devices")

if __name__ == "__main__":
    main()