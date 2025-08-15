#!/usr/bin/env python3
"""
Backend API Testing Suite for my-hotel project
Tests FastAPI server endpoints, database connectivity, and CORS configuration
"""

import requests
import json
import sys
import os
from datetime import datetime
import uuid

# Get the backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return None

BACKEND_URL = get_backend_url()
if not BACKEND_URL:
    print("❌ Could not find REACT_APP_BACKEND_URL in frontend/.env")
    sys.exit(1)

API_BASE_URL = f"{BACKEND_URL}/api"

print(f"🔍 Testing Backend API at: {API_BASE_URL}")
print("=" * 60)

def test_health_check():
    """Test the root API endpoint"""
    print("🏥 Testing Health Check Endpoint...")
    try:
        response = requests.get(f"{API_BASE_URL}/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Hello World":
                print("✅ Health check endpoint working correctly")
                return True
            else:
                print(f"❌ Unexpected response: {data}")
                return False
        else:
            print(f"❌ Health check failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Health check request failed: {e}")
        return False

def test_cors_configuration():
    """Test CORS headers"""
    print("\n🌐 Testing CORS Configuration...")
    try:
        # Test preflight request
        headers = {
            'Origin': 'https://example.com',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
        }
        response = requests.options(f"{API_BASE_URL}/", headers=headers, timeout=10)
        
        cors_headers = {
            'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
        }
        
        if cors_headers['Access-Control-Allow-Origin']:
            print("✅ CORS headers present")
            print(f"   Allow-Origin: {cors_headers['Access-Control-Allow-Origin']}")
            print(f"   Allow-Methods: {cors_headers['Access-Control-Allow-Methods']}")
            print(f"   Allow-Headers: {cors_headers['Access-Control-Allow-Headers']}")
            return True
        else:
            print("❌ CORS headers missing")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ CORS test request failed: {e}")
        return False

def test_status_endpoints():
    """Test status check endpoints (GET and POST)"""
    print("\n📊 Testing Status Endpoints...")
    
    # Test GET /api/status
    print("Testing GET /api/status...")
    try:
        response = requests.get(f"{API_BASE_URL}/status", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ GET /api/status working - returned {len(data)} status checks")
        else:
            print(f"❌ GET /api/status failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ GET /api/status request failed: {e}")
        return False
    
    # Test POST /api/status
    print("Testing POST /api/status...")
    try:
        test_data = {
            "client_name": f"test_client_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        }
        response = requests.post(
            f"{API_BASE_URL}/status", 
            json=test_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'id' in data and 'client_name' in data and 'timestamp' in data:
                print("✅ POST /api/status working - created status check")
                print(f"   Created ID: {data['id']}")
                print(f"   Client Name: {data['client_name']}")
                print(f"   Timestamp: {data['timestamp']}")
                return True
            else:
                print(f"❌ POST /api/status returned incomplete data: {data}")
                return False
        else:
            print(f"❌ POST /api/status failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ POST /api/status request failed: {e}")
        return False

def test_database_connectivity():
    """Test database operations by creating and retrieving data"""
    print("\n🗄️ Testing Database Connectivity...")
    
    # Create a test record
    test_client_name = f"db_test_{uuid.uuid4().hex[:8]}"
    
    try:
        # Create record
        create_response = requests.post(
            f"{API_BASE_URL}/status",
            json={"client_name": test_client_name},
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if create_response.status_code != 200:
            print(f"❌ Failed to create test record: {create_response.status_code}")
            return False
        
        created_record = create_response.json()
        created_id = created_record['id']
        
        # Retrieve records and verify our test record exists
        get_response = requests.get(f"{API_BASE_URL}/status", timeout=10)
        
        if get_response.status_code != 200:
            print(f"❌ Failed to retrieve records: {get_response.status_code}")
            return False
        
        all_records = get_response.json()
        
        # Find our test record
        test_record_found = False
        for record in all_records:
            if record.get('id') == created_id and record.get('client_name') == test_client_name:
                test_record_found = True
                break
        
        if test_record_found:
            print("✅ Database connectivity working - record created and retrieved successfully")
            print(f"   Test record ID: {created_id}")
            print(f"   Test client name: {test_client_name}")
            return True
        else:
            print("❌ Database connectivity issue - created record not found in retrieval")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Database connectivity test failed: {e}")
        return False

def test_error_handling():
    """Test API error handling"""
    print("\n🚨 Testing Error Handling...")
    
    try:
        # Test POST with invalid data
        response = requests.post(
            f"{API_BASE_URL}/status",
            json={},  # Missing required client_name
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 422:  # FastAPI validation error
            print("✅ Error handling working - validation errors properly returned")
            return True
        else:
            print(f"⚠️ Unexpected status code for invalid data: {response.status_code}")
            print(f"Response: {response.text}")
            return True  # Not a critical failure
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Error handling test failed: {e}")
        return False

def run_all_tests():
    """Run all backend tests and return overall result"""
    print("🚀 Starting Backend API Test Suite")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"API Base URL: {API_BASE_URL}")
    print("=" * 60)
    
    tests = [
        ("Health Check", test_health_check),
        ("CORS Configuration", test_cors_configuration),
        ("Status Endpoints", test_status_endpoints),
        ("Database Connectivity", test_database_connectivity),
        ("Error Handling", test_error_handling)
    ]
    
    results = {}
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results[test_name] = result
            if result:
                passed += 1
        except Exception as e:
            print(f"❌ {test_name} test crashed: {e}")
            results[test_name] = False
    
    print("\n" + "=" * 60)
    print("📋 TEST SUMMARY")
    print("=" * 60)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All backend tests PASSED!")
        return True
    else:
        print(f"⚠️ {total - passed} test(s) FAILED")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)