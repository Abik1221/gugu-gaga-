#!/usr/bin/env python3
"""
Production Email Debug Script
Tests email functionality and OTP verification in production environment
"""

import os
import sys
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import sqlite3
import random

# Add the app directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '.'))

def test_smtp_connection():
    """Test SMTP connection with production settings"""
    print("🔍 Testing SMTP Connection...")
    
    # Production SMTP settings
    smtp_host = "smtp.gmail.com"
    smtp_port = 587
    smtp_username = "nahomkeneni4@gmail.com"
    smtp_password = "bajfugnwibkrpgvg"
    
    try:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=30) as smtp:
            smtp.ehlo()
            context = ssl.create_default_context()
            smtp.starttls(context=context)
            smtp.ehlo()
            smtp.login(smtp_username, smtp_password)
            print("✅ SMTP connection successful!")
            return True
    except Exception as e:
        print(f"❌ SMTP connection failed: {e}")
        return False

def send_test_email(to_email: str):
    """Send a test email"""
    print(f"📧 Sending test email to {to_email}...")
    
    smtp_host = "smtp.gmail.com"
    smtp_port = 587
    smtp_username = "nahomkeneni4@gmail.com"
    smtp_password = "bajfugnwibkrpgvg"
    
    # Create test message
    message = MIMEMultipart('alternative')
    message["From"] = f"Mesob <{smtp_username}>"
    message["To"] = to_email
    message["Subject"] = "Mesob Email Test - Production"
    
    # Plain text version
    plain_text = f"""
Mesob Email Test

This is a test email from the Mesob production system.

Time: {datetime.utcnow().isoformat()}

If you receive this email, the email system is working correctly.

--
Mesob Team
https://mymesob.com
"""
    
    # HTML version
    html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Mesob Email Test</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9f9f9;">
    <div style="max-width: 500px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px;">
        <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">Mesob Email Test</h1>
        
        <p style="color: #666; line-height: 1.5;">This is a test email from the Mesob production system.</p>
        
        <p style="color: #666; line-height: 1.5;"><strong>Time:</strong> {datetime.utcnow().isoformat()}</p>
        
        <p style="color: #666; line-height: 1.5;">If you receive this email, the email system is working correctly.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
        
        <p style="color: #aaa; font-size: 12px; text-align: center; margin: 0;">Mesob Team | https://mymesob.com</p>
    </div>
</body>
</html>
"""
    
    text_part = MIMEText(plain_text, 'plain', 'utf-8')
    html_part = MIMEText(html_body, 'html', 'utf-8')
    message.attach(text_part)
    message.attach(html_part)
    
    try:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=30) as smtp:
            smtp.ehlo()
            context = ssl.create_default_context()
            smtp.starttls(context=context)
            smtp.ehlo()
            smtp.login(smtp_username, smtp_password)
            smtp.send_message(message)
        print("✅ Test email sent successfully!")
        return True
    except Exception as e:
        print(f"❌ Failed to send test email: {e}")
        return False

def test_verification_code_flow(email: str):
    """Test the complete verification code flow"""
    print(f"🔐 Testing verification code flow for {email}...")
    
    # Connect to production database
    db_path = "./data/app.db"
    if not os.path.exists(db_path):
        print(f"❌ Database not found at {db_path}")
        return False
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Generate a test code
        test_code = ''.join(str(random.randint(0, 9)) for _ in range(6))
        expires_at = datetime.utcnow() + timedelta(minutes=10)
        
        # Insert verification code
        cursor.execute("""
            INSERT INTO verification_codes (email, code, purpose, expires_at, consumed, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (email, test_code, "register", expires_at, False, datetime.utcnow()))
        
        conn.commit()
        
        print(f"✅ Test verification code created: {test_code}")
        print(f"📧 Code expires at: {expires_at}")
        
        # Test verification
        cursor.execute("""
            SELECT * FROM verification_codes 
            WHERE email = ? AND purpose = ? AND code = ? AND consumed = 0 AND expires_at >= ?
        """, (email, "register", test_code, datetime.utcnow()))
        
        result = cursor.fetchone()
        if result:
            print("✅ Verification code can be retrieved successfully")
            
            # Mark as consumed
            cursor.execute("""
                UPDATE verification_codes 
                SET consumed = 1 
                WHERE email = ? AND purpose = ? AND code = ?
            """, (email, "register", test_code))
            conn.commit()
            
            print("✅ Verification code marked as consumed")
        else:
            print("❌ Verification code could not be retrieved")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Database test failed: {e}")
        return False

def check_user_verification_status(email: str):
    """Check if user exists and verification status"""
    print(f"👤 Checking user status for {email}...")
    
    db_path = "./data/app.db"
    if not os.path.exists(db_path):
        print(f"❌ Database not found at {db_path}")
        return
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check user
        cursor.execute("SELECT id, email, role, is_verified, is_active FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
        
        if user:
            print(f"✅ User found: ID={user[0]}, Role={user[2]}, Verified={user[3]}, Active={user[4]}")
        else:
            print("❌ User not found")
        
        # Check recent verification codes
        cursor.execute("""
            SELECT code, purpose, expires_at, consumed, created_at 
            FROM verification_codes 
            WHERE email = ? 
            ORDER BY created_at DESC 
            LIMIT 5
        """, (email,))
        
        codes = cursor.fetchall()
        if codes:
            print("📋 Recent verification codes:")
            for code in codes:
                status = "✅ Valid" if not code[3] and datetime.fromisoformat(code[2]) > datetime.utcnow() else "❌ Invalid/Expired"
                print(f"  Code: {code[0]}, Purpose: {code[1]}, Status: {status}")
        else:
            print("📋 No verification codes found")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ User check failed: {e}")

def main():
    print("🚀 Mesob Production Email Debug Tool")
    print("=" * 50)
    
    # Test email (replace with actual test email)
    test_email = input("Enter test email address: ").strip()
    if not test_email:
        test_email = "test@example.com"
    
    print(f"\n🎯 Testing with email: {test_email}")
    print("-" * 30)
    
    # Run tests
    smtp_ok = test_smtp_connection()
    print()
    
    if smtp_ok:
        email_ok = send_test_email(test_email)
        print()
    
    db_ok = test_verification_code_flow(test_email)
    print()
    
    check_user_verification_status(test_email)
    print()
    
    # Summary
    print("📊 Test Summary:")
    print(f"  SMTP Connection: {'✅ OK' if smtp_ok else '❌ FAILED'}")
    if smtp_ok:
        print(f"  Email Sending: {'✅ OK' if email_ok else '❌ FAILED'}")
    print(f"  Database Operations: {'✅ OK' if db_ok else '❌ FAILED'}")
    
    if smtp_ok and db_ok:
        print("\n🎉 Email system appears to be working correctly!")
        print("If users still can't verify, check:")
        print("  1. Frontend API endpoint configuration")
        print("  2. CORS settings")
        print("  3. Network connectivity")
        print("  4. Firewall rules")
    else:
        print("\n⚠️  Issues detected. Please fix the failed components.")

if __name__ == "__main__":
    main()