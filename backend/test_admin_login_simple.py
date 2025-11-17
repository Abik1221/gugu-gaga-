#!/usr/bin/env python3
"""
Simple Admin Login Test
"""
import os
import requests
import json

def test_admin_login():
    """Test admin login with environment credentials"""
    
    # Get credentials from environment
    admin_email = os.getenv("ADMIN_EMAIL", "nahomkeneni4@gmail.com")
    admin_password = os.getenv("ADMIN_PASSWORD", "Nahom@keneni")
    
    base_url = "http://localhost:8000"
    
    print("🔐 Testing Admin Login")
    print(f"Email: {admin_email}")
    print(f"Password: {'*' * len(admin_password)}")
    
    # Step 1: Request login code
    print("\n📧 Step 1: Requesting login code...")
    
    login_data = {
        "username": admin_email,
        "password": admin_password,
        "grant_type": "password"
    }
    
    try:
        response = requests.post(
            f"{base_url}/api/v1/auth/login/request-code",
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        if response.status_code == 200:
            print("✅ Login code request successful!")
            print("📱 Check email for verification code")
            
            # Get verification code from user
            code = input("\nEnter the verification code from email: ").strip()
            
            if code:
                # Step 2: Verify code and get token
                print("\n🔑 Step 2: Verifying code...")
                
                verify_data = {
                    "email": admin_email,
                    "code": code
                }
                
                verify_response = requests.post(
                    f"{base_url}/api/v1/auth/login/verify",
                    json=verify_data,
                    headers={"Content-Type": "application/json"}
                )
                
                if verify_response.status_code == 200:
                    token_data = verify_response.json()
                    access_token = token_data.get("access_token")
                    
                    print("✅ Login successful!")
                    print(f"🎫 Access Token: {access_token[:50]}...")
                    
                    # Step 3: Test admin endpoint
                    print("\n🔍 Step 3: Testing admin access...")
                    
                    admin_response = requests.get(
                        f"{base_url}/api/v1/auth/me",
                        headers={"Authorization": f"Bearer {access_token}"}
                    )
                    
                    if admin_response.status_code == 200:
                        user_data = admin_response.json()
                        print("✅ Admin access confirmed!")
                        print(f"👤 User: {user_data.get('email')}")
                        print(f"🏷️ Role: {user_data.get('role')}")
                        print(f"✅ Verified: {user_data.get('is_verified')}")
                        print(f"✅ Active: {user_data.get('is_active')}")
                        return True
                    else:
                        print(f"❌ Admin access failed: {admin_response.status_code}")
                        print(admin_response.text)
                else:
                    print(f"❌ Code verification failed: {verify_response.status_code}")
                    print(verify_response.text)
            else:
                print("❌ No verification code provided")
        else:
            print(f"❌ Login request failed: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Error: {e}")
    
    return False

if __name__ == "__main__":
    success = test_admin_login()
    if success:
        print("\n🎉 Admin login test PASSED!")
    else:
        print("\n💥 Admin login test FAILED!")