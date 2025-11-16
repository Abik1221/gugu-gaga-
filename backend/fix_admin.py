#!/usr/bin/env python3
"""
Simple script to create admin user with proper password hashing
"""

import sqlite3
import bcrypt

def create_admin():
    # Connect to database
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
    
    # Delete existing admin users
    cursor.execute("DELETE FROM users WHERE role = 'admin'")
    
    # Create password hash for 'admin123'
    password = 'admin123'
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    password_hash = bcrypt.hashpw(password_bytes, salt).decode('utf-8')
    
    # Insert new admin user
    cursor.execute("""
        INSERT INTO users (
            email, 
            password_hash, 
            role, 
            is_active, 
            is_approved, 
            is_verified,
            tenant_id,
            created_at,
            updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    """, (
        'admin@zemensystem.com',
        password_hash,
        'admin',
        1,
        1,
        1,
        None
    ))
    
    conn.commit()
    
    # Verify the user was created
    cursor.execute("SELECT id, email, role FROM users WHERE role = 'admin'")
    admin = cursor.fetchone()
    
    if admin:
        print(f"✅ Admin user created successfully!")
        print(f"   ID: {admin[0]}")
        print(f"   Email: {admin[1]}")
        print(f"   Role: {admin[2]}")
        print(f"   Password: {password}")
        print(f"   Password Hash: {password_hash}")
        
        # Test password verification
        stored_hash = password_hash.encode('utf-8')
        if bcrypt.checkpw(password_bytes, stored_hash):
            print("✅ Password verification: SUCCESS")
        else:
            print("❌ Password verification: FAILED")
    else:
        print("❌ Failed to create admin user")
    
    conn.close()

if __name__ == "__main__":
    try:
        create_admin()
    except Exception as e:
        print(f"Error: {e}")