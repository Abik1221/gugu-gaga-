#!/usr/bin/env python3
"""
Quick local admin generator
"""
import sqlite3
import bcrypt

def create_local_admin():
    email = "admin@localhost.com"
    password = "LocalAdmin123!"
    
    # Hash password
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    password_hash = bcrypt.hashpw(password_bytes, salt).decode('utf-8')
    
    # Connect to database
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
    
    # Delete existing admins
    cursor.execute("DELETE FROM users WHERE role = 'admin'")
    
    # Create new admin
    cursor.execute("""
        INSERT INTO users (email, password_hash, role, is_active, is_approved, is_verified, tenant_id, created_at, updated_at)
        VALUES (?, ?, 'admin', 1, 1, 1, NULL, datetime('now'), datetime('now'))
    """, (email, password_hash))
    
    conn.commit()
    conn.close()
    
    print("✅ LOCAL ADMIN CREATED")
    print("=" * 40)
    print(f"URL: http://localhost:3000/superadin/zeenpharma/login")
    print(f"Email: {email}")
    print(f"Password: {password}")
    print("=" * 40)

if __name__ == "__main__":
    create_local_admin()