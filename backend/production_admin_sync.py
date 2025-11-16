#!/usr/bin/env python3
"""
Production Admin Sync - Ensures admin credentials work with production API
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import hash_password, verify_password
from app.core.roles import Role

def sync_production_admin():
    """Sync admin credentials for production"""
    
    # Production admin credentials (matching .env.production)
    email = "admin@zemensystem.com"
    password = "ProductionAdmin2024!"
    
    db = SessionLocal()
    try:
        # Remove any existing admin users
        db.query(User).filter(User.role == Role.admin.value).delete()
        db.commit()
        
        # Create production admin
        admin = User(
            email=email,
            password_hash=hash_password(password),
            role=Role.admin.value,
            is_active=True,
            is_approved=True,
            is_verified=True,
            tenant_id=None
        )
        
        db.add(admin)
        db.commit()
        db.refresh(admin)
        
        # Verify password works
        if verify_password(password, admin.password_hash):
            print("✅ PRODUCTION ADMIN READY")
            print("=" * 50)
            print(f"🌐 Production URL: https://mymesob.com/superadin/zeenpharma/login")
            print(f"📧 Email: {email}")
            print(f"🔑 Password: {password}")
            print("=" * 50)
            print("🚀 Ready for production deployment!")
        else:
            print("❌ Password verification failed!")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    sync_production_admin()