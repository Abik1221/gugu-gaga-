#!/usr/bin/env python3
"""Quick test for production verification issue"""

import requests
import json

def test_verification_endpoint():
    """Test the verification endpoint directly"""
    url = "http://13.61.24.25:8000/api/v1/auth/register/verify"
    
    # Test with form data (expected format)
    data = {
        'email': 'test@example.com',
        'code': '123456'
    }
    
    try:
        response = requests.post(url, data=data, timeout=10)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text[:200]}")
        
        if response.status_code == 404:
            print("✅ Endpoint is accessible (404 expected for test data)")
        elif response.status_code == 500:
            print("❌ Server error - check backend logs")
        else:
            print(f"ℹ️  Got {response.status_code} - endpoint is working")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server")
    except requests.exceptions.Timeout:
        print("❌ Request timeout")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_verification_endpoint()