#!/usr/bin/env python3
"""
Script to check admin users and test login credentials
"""

import sys
import os
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

try:
    from app.db.session import SessionLocal
    from app.models.user import User
    from app.core.security import verify_password
except ImportError as e:
    print(f"Error importing backend modules: {e}")
    sys.exit(1)

def check_admin_users():
    """Check existing admin users in the database."""
    session = SessionLocal()
    try:
        # Get all admin users
        admins = session.query(User).filter(User.role == 'admin').all()
        
        print(f"Found {len(admins)} admin users:")
        print("=" * 50)
        
        for admin in admins:
            print(f"ID: {admin.id}")
            print(f"Email: {admin.email}")
            print(f"Role: {admin.role}")
            print(f"Active: {admin.is_active}")
            print(f"Approved: {admin.is_approved}")
            print(f"Verified: {admin.is_verified}")
            print(f"Tenant ID: {admin.tenant_id}")
            print(f"Password Hash: {admin.password_hash[:50]}...")
            print("-" * 30)
            
        return admins
        
    except Exception as e:
        print(f"Error checking admin users: {e}")
        return []
    finally:
        session.close()

def test_admin_login(email, password):
    """Test admin login credentials."""
    session = SessionLocal()
    try:
        user = session.query(User).filter(User.email == email).first()
        if not user:
            print(f"❌ No user found with email: {email}")
            return False
            
        print(f"✅ User found: {user.email}")
        print(f"   Role: {user.role}")
        print(f"   Active: {user.is_active}")
        print(f"   Approved: {user.is_approved}")
        print(f"   Verified: {user.is_verified}")
        
        # Test password
        if verify_password(password, user.password_hash):
            print(f"✅ Password verification: SUCCESS")
            return True
        else:
            print(f"❌ Password verification: FAILED")
            return False
            
    except Exception as e:
        print(f"Error testing login: {e}")
        return False
    finally:
        session.close()

def main():
    print("Admin User Checker")
    print("=" * 50)
    
    # Check existing admin users
    admins = check_admin_users()
    
    if not admins:
        print("\n❌ No admin users found in database!")
        print("Run create_admin.py to create an admin user.")
        return
    
    # Test login for each admin
    print("\n" + "=" * 50)
    print("Testing Admin Login")
    print("=" * 50)
    
    for admin in admins:
        print(f"\nTesting admin: {admin.email}")
        
        # Try common passwords
        test_passwords = [
            "admin123",
            "password",
            "admin",
            "123456",
            "zemenpharma",
            "admin@123"
        ]
        
        success = False
        for pwd in test_passwords:
            print(f"  Trying password: {pwd}")
            if test_admin_login(admin.email, pwd):
                print(f"  ✅ SUCCESS! Password is: {pwd}")
                success = True
                break
        
        if not success:
            print(f"  ❌ None of the common passwords worked for {admin.email}")
            print(f"  You may need to reset the password or check the create_admin.py output")

if __name__ == "__main__":
    main()