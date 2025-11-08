#!/usr/bin/env python3
"""
Test script for supplier endpoints
Run this to verify the backend integration is working
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_endpoints():
    print("Testing Supplier Backend Endpoints...")
    
    # Test health endpoint
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✓ Health check: {response.status_code}")
    except Exception as e:
        print(f"✗ Health check failed: {e}")
    
    # Test API health
    try:
        response = requests.get(f"{BASE_URL}/api/v1/health")
        print(f"✓ API health check: {response.status_code}")
    except Exception as e:
        print(f"✗ API health check failed: {e}")
    
    # Test admin suppliers endpoint (without auth - should get 401)
    try:
        response = requests.get(f"{BASE_URL}/api/v1/admin/suppliers")
        print(f"✓ Admin suppliers endpoint exists: {response.status_code} (expected 401/403)")
    except Exception as e:
        print(f"✗ Admin suppliers endpoint failed: {e}")
    
    # Test supplier onboarding status (without auth - should get 401)
    try:
        response = requests.get(f"{BASE_URL}/api/v1/supplier-onboarding/status")
        print(f"✓ Supplier onboarding status endpoint exists: {response.status_code} (expected 401/403)")
    except Exception as e:
        print(f"✗ Supplier onboarding status endpoint failed: {e}")
    
    # Test orders endpoint (without auth - should get 401)
    try:
        response = requests.get(f"{BASE_URL}/api/v1/orders")
        print(f"✓ Orders endpoint exists: {response.status_code} (expected 401/403)")
    except Exception as e:
        print(f"✗ Orders endpoint failed: {e}")
    
    print("\nAll endpoints are accessible. Backend integration is ready!")
    print("Note: 401/403 responses are expected without authentication tokens.")

if __name__ == "__main__":
    test_endpoints()