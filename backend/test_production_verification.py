#!/usr/bin/env python3
"""
Test script to debug production verification issues
"""
import requests
import json
import sys
from datetime import datetime

# Production API base
API_BASE = "https://mesobai.com/api/v1"

def test_verification_flow():
    """Test the complete verification flow"""
    print("🔍 Testing Production Verification Flow")
    print("=" * 50)
    
    # Test email for verification
    test_email = "test@example.com"
    test_code = "123456"
    
    print(f"📧 Testing with email: {test_email}")
    print(f"🔢 Testing with code: {test_code}")
    
    # Test 1: Check if verification endpoint is accessible
    print("\n1️⃣ Testing verification endpoint accessibility...")
    try:
        response = requests.post(
            f"{API_BASE}/auth/register/verify",
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            data={"email": test_email, "code": test_code},
            timeout=10
        )
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}...")
        
        if response.status_code == 404:
            print("   ❌ User not found - this is expected for test email")
        elif response.status_code == 400:
            print("   ❌ Invalid code - this is expected for test code")
        elif response.status_code == 500:
            print("   ❌ Server error - this needs investigation")
        else:
            print(f"   ℹ️ Unexpected status: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Network error: {e}")
        return False
    
    # Test 2: Check database connection via health endpoint
    print("\n2️⃣ Testing database connectivity...")
    try:
        response = requests.get(f"{API_BASE}/health", timeout=10)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Database: {data.get('database', 'unknown')}")
            print(f"   Redis: {data.get('redis', 'unknown')}")
        else:
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"   ❌ Health check failed: {e}")
    
    # Test 3: Check if verification codes table exists
    print("\n3️⃣ Testing verification system...")
    try:
        # Try to request a code for a non-existent user
        response = requests.post(
            f"{API_BASE}/auth/resend-code",
            headers={"Content-Type": "application/json"},
            json={"email": "nonexistent@test.com", "purpose": "register"},
            timeout=10
        )
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}...")
        
        if response.status_code == 404:
            print("   ✅ Verification system is working (user not found)")
        elif response.status_code == 429:
            print("   ✅ Rate limiting is working")
        else:
            print(f"   ℹ️ Unexpected response: {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Verification test failed: {e}")
    
    print("\n" + "=" * 50)
    print("✅ Production verification test completed")
    return True

def check_user_verification_status(email: str):
    """Check if a specific user exists and their verification status"""
    print(f"\n🔍 Checking user verification status for: {email}")
    
    # Try to request a password reset to see if user exists
    try:
        response = requests.post(
            f"{API_BASE}/auth/password/reset/request",
            headers={"Content-Type": "application/json"},
            json={"email": email},
            timeout=10
        )
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text}")
        
        if response.status_code == 200:
            print("   ✅ User exists")
        elif response.status_code == 404:
            print("   ❌ User not found")
        else:
            print(f"   ℹ️ Unexpected status: {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Error checking user: {e}")

if __name__ == "__main__":
    print(f"🚀 Production Verification Test - {datetime.now()}")
    
    # Run general tests
    test_verification_flow()
    
    # If email provided as argument, check specific user
    if len(sys.argv) > 1:
        email = sys.argv[1]
        check_user_verification_status(email)
    
    print("\n💡 Tips for debugging:")
    print("   - Check server logs for detailed error messages")
    print("   - Verify database connection and tables")
    print("   - Check if email service is working")
    print("   - Ensure verification codes are being generated")