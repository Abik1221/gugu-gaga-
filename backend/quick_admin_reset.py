#!/usr/bin/env python3
"""Quick admin password reset for production"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import hash_password
from app.core.roles import Role

def reset_admin_password():
    email = "admin@zemensystem.com"
    password = "ProductionAdmin2024!"
    
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == email, User.role == Role.admin.value).first()
        
        if admin:
            admin.password_hash = hash_password(password)
            db.commit()
            print(f"✅ Admin password updated!")
        else:
            # Create new admin
            admin = User(
                email=email,
                password_hash=hash_password(password),
                role=Role.admin.value,
                is_active=True,
                is_approved=True,
                is_verified=True
            )
            db.add(admin)
            db.commit()
            print(f"✅ New admin created!")
        
        print(f"Email: {email}")
        print(f"Password: {password}")
        
    finally:
        db.close()

if __name__ == "__main__":
    reset_admin_password()