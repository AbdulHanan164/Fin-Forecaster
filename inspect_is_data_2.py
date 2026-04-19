import requests
import json

try:
    url = "https://api.askanalyst.com.pk/api/is/2"
    res = requests.get(url, timeout=10).json()
    ann = res.get('annual', [])
    print(f"IS Annual ID 2 length: {len(ann)}")
    if ann:
        print(f"First data points: {len(ann[0].get('data', [])) if ann[0].get('data') else 0}")
except Exception as e:
    print(f"Error: {e}")
