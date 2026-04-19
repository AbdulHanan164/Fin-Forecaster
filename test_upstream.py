import requests

try:
    url = "https://api.askanalyst.com.pk/api/is/1"
    r = requests.get(url, timeout=10)
    print(f"Status: {r.status_code}")
except Exception as e:
    print(f"Error: {e}")
