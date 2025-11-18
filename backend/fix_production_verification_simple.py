#!/usr/bin/env python3
"""
Simple fix for production verification issues
This script will mark users as verified if they have valid accounts
"""
import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("❌ DATABASE_URL environment variable not set")
    sys.exit(1)

def fix_user_verification(email: str = None):
    """Fix verification status for users"""
    try:
        # Create database connection
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind=engine)
        session = Session()
        
        print(f"🔧 Fixing verification issues...")
        
        if email:
            # Fix specific user
            print(f"📧 Fixing verification for: {email}")
            
            # Check if user exists
            result = session.execute(
                text("SELECT id, email, role, is_verified FROM users WHERE email = :email"),
                {"email": email}
            ).fetchone()
            
            if not result:
                print(f"❌ User not found: {email}")
                return False
            
            user_id, user_email, role, is_verified = result
            print(f"   User ID: {user_id}")
            print(f"   Role: {role}")
            print(f"   Currently verified: {is_verified}")
            
            if not is_verified:
                # Mark as verified
                session.execute(
                    text("UPDATE users SET is_verified = true WHERE id = :user_id"),
                    {"user_id": user_id}
                )
                session.commit()
                print(f"   ✅ User {email} marked as verified")
            else:
                print(f"   ℹ️ User {email} already verified")
                
        else:
            # Fix all unverified users (be careful with this)
            print("🔧 Checking all unverified users...")
            
            unverified_users = session.execute(
                text("SELECT id, email, role, created_at FROM users WHERE is_verified = false ORDER BY created_at DESC LIMIT 10")
            ).fetchall()
            
            if not unverified_users:
                print("✅ No unverified users found")
                return True
            
            print(f"Found {len(unverified_users)} unverified users:")
            for user_id, user_email, role, created_at in unverified_users:
                print(f"   - {user_email} ({role}) - Created: {created_at}")
            
            # Ask for confirmation before fixing all
            response = input("\n❓ Mark all these users as verified? (y/N): ")
            if response.lower() == 'y':
                for user_id, user_email, role, created_at in unverified_users:
                    session.execute(
                        text("UPDATE users SET is_verified = true WHERE id = :user_id"),
                        {"user_id": user_id}
                    )
                    print(f"   ✅ Verified: {user_email}")
                
                session.commit()
                print(f"✅ Marked {len(unverified_users)} users as verified")
            else:
                print("❌ Operation cancelled")
        
        session.close()
        return True
        
    except Exception as e:
        print(f"❌ Error fixing verification: {e}")
        return False

def check_verification_codes():
    """Check verification codes table"""
    try:
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind=engine)
        session = Session()
        
        print("\n🔍 Checking verification codes...")
        
        # Check recent codes
        recent_codes = session.execute(
            text("""
                SELECT email, purpose, code, created_at, consumed, expires_at 
                FROM verification_codes 
                WHERE created_at > NOW() - INTERVAL '24 hours'
                ORDER BY created_at DESC 
                LIMIT 10
            """)
        ).fetchall()
        
        if recent_codes:
            print(f"Found {len(recent_codes)} recent verification codes:")
            for email, purpose, code, created_at, consumed, expires_at in recent_codes:
                status = "consumed" if consumed else ("expired" if expires_at < datetime.utcnow() else "active")
                print(f"   - {email} ({purpose}): {code} - {status}")
        else:
            print("No recent verification codes found")
        
        session.close()
        
    except Exception as e:
        print(f"❌ Error checking codes: {e}")

if __name__ == "__main__":
    print(f"🔧 Production Verification Fix - {datetime.now()}")
    
    # Check verification codes first
    check_verification_codes()
    
    # Fix specific user if email provided
    if len(sys.argv) > 1:
        email = sys.argv[1]
        fix_user_verification(email)
    else:
        # Show unverified users and ask what to do
        fix_user_verification()
    
    print("\n✅ Verification fix completed")