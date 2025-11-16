#!/usr/bin/env python3
"""
Test admin endpoints
"""
import requests
import json

# Test configuration
BASE_URL = "http://127.0.0.1:8000/api/v1"
ADMIN_EMAIL = "admin@localhost.com"
ADMIN_PASSWORD = "LocalAdmin123!"

def test_admin_endpoints():
    # Login as admin
    print("🔐 Testing admin login...")
    login_response = requests.post(
        f"{BASE_URL}/auth/login",
        data={
            "username": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD,
            "grant_type": "password"
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        print(f"Response: {login_response.text}")
        return False
    
    token_data = login_response.json()
    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    print("✅ Admin login successful")
    
    # Test pharmacy summary endpoint
    print("\n📊 Testing pharmacy summary...")
    summary_response = requests.get(
        f"{BASE_URL}/admin/pharmacies/summary",
        headers=headers
    )
    
    if summary_response.status_code == 200:
        print("✅ Pharmacy summary endpoint working")
        data = summary_response.json()
        print(f"   Total pharmacies: {data.get('totals', {}).get('total', 0)}")
    else:
        print(f"❌ Pharmacy summary failed: {summary_response.status_code}")
        print(f"Response: {summary_response.text}")
    
    # Test pharmacies list endpoint
    print("\n🏥 Testing pharmacies list...")
    pharmacies_response = requests.get(
        f"{BASE_URL}/admin/pharmacies?page=1&page_size=10",
        headers=headers
    )
    
    if pharmacies_response.status_code == 200:
        print("✅ Pharmacies list endpoint working")
        data = pharmacies_response.json()
        print(f"   Total pharmacies: {data.get('total', 0)}")
        print(f"   Items returned: {len(data.get('items', []))}")
    else:
        print(f"❌ Pharmacies list failed: {pharmacies_response.status_code}")
        print(f"Response: {pharmacies_response.text}")
    
    # Test analytics overview
    print("\n📈 Testing analytics overview...")
    analytics_response = requests.get(
        f"{BASE_URL}/admin/analytics/overview?days=30",
        headers=headers
    )
    
    if analytics_response.status_code == 200:
        print("✅ Analytics overview endpoint working")
        data = analytics_response.json()
        totals = data.get('totals', {})
        print(f"   Total pharmacies: {totals.get('total_pharmacies', 0)}")
        print(f"   Active pharmacies: {totals.get('active_pharmacies', 0)}")
    else:
        print(f"❌ Analytics overview failed: {analytics_response.status_code}")
        print(f"Response: {analytics_response.text}")
    
    return True

if __name__ == "__main__":
    print("🧪 Testing Admin Endpoints")
    print("=" * 50)
    test_admin_endpoints()
    print("\n✅ Test completed!")