#!/usr/bin/env python3
"""
Post-deployment admin setup for CI/CD
Ensures admin user is created after deployment
"""
import os
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

def wait_for_db():
    """Wait for database to be ready"""
    max_retries = 30
    for i in range(max_retries):
        try:
            from app.db.session import SessionLocal
            db = SessionLocal()
            db.execute("SELECT 1")
            db.close()
            print("✅ Database ready")
            return True
        except Exception as e:
            print(f"⏳ Waiting for database... ({i+1}/{max_retries})")
            time.sleep(2)
    return False

def setup_admin():
    """Setup admin user post-deployment"""
    if not wait_for_db():
        print("❌ Database not ready")
        return False
    
    try:
        from app.db.session import SessionLocal
        from app.models.user import User
        from app.core.security import hash_password
        from app.core.roles import Role
        
        email = os.getenv("ADMIN_EMAIL", "admin@zemensystem.com")
        password = os.getenv("ADMIN_PASSWORD", "ProductionAdmin2024!")
        
        db = SessionLocal()
        
        # Check if admin exists
        admin = db.query(User).filter(User.email == email, User.role == Role.admin.value).first()
        
        if not admin:
            # Create admin
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
            print(f"✅ Admin created: {email}")
        else:
            # Update password
            admin.password_hash = hash_password(password)
            admin.is_active = True
            db.commit()
            print(f"✅ Admin updated: {email}")
        
        db.close()
        
        print("🎯 PRODUCTION ADMIN READY:")
        print(f"   URL: https://mymesob.com/superadin/zeenpharma/login")
        print(f"   Email: {email}")
        print(f"   Password: {password}")
        
        return True
        
    except Exception as e:
        print(f"❌ Admin setup failed: {e}")
        return False

if __name__ == "__main__":
    setup_admin()