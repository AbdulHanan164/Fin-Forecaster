import requests

try:
    r = requests.get('http://localhost:8000/api/company/1/balance-sheet', timeout=10)
    print(f"Status: {r.status_code}")
    print(f"Response: {r.text[:500]}")
except Exception as e:
    print(f"Error: {e}")
