#!/usr/bin/env python3
"""
Fix production admin login
"""
import sqlite3
import bcrypt

def fix_production_admin():
    # Production credentials
    email = "nahomkeneni4@gmail.com"
    password = "Nahom@keneni"
    
    # Connect to production database
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
    
    # Delete existing admin users
    cursor.execute("DELETE FROM users WHERE role = 'admin'")
    
    # Create proper password hash
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    password_hash = bcrypt.hashpw(password_bytes, salt).decode('utf-8')
    
    # Insert admin user
    cursor.execute("""
        INSERT INTO users (
            email, password_hash, role, is_active, is_approved, is_verified, 
            tenant_id, created_at, updated_at
        ) VALUES (?, ?, 'admin', 1, 1, 1, NULL, datetime('now'), datetime('now'))
    """, (email, password_hash))
    
    conn.commit()
    
    # Verify creation
    cursor.execute("SELECT id, email, role FROM users WHERE role = 'admin'")
    admin = cursor.fetchone()
    
    if admin:
        print("✅ PRODUCTION ADMIN FIXED")
        print("=" * 40)
        print(f"URL: https://mymesob.com/superadin/zeenpharma/login")
        print(f"Email: {email}")
        print(f"Password: {password}")
        print("=" * 40)
        
        # Test password verification
        cursor.execute("SELECT password_hash FROM users WHERE email = ?", (email,))
        stored_hash = cursor.fetchone()[0].encode('utf-8')
        if bcrypt.checkpw(password_bytes, stored_hash):
            print("✅ Password verification: SUCCESS")
        else:
            print("❌ Password verification: FAILED")
    else:
        print("❌ Failed to create admin")
    
    conn.close()

if __name__ == "__main__":
    fix_production_admin()