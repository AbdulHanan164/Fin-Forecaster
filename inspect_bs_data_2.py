import requests
import json

try:
    url = "https://api.askanalyst.com.pk/api/bs/2"
    res = requests.get(url, timeout=10).json()
    ann = res.get('annual', [])
    print(f"Annual item count: {len(ann)}")
    if ann:
        print(f"First label: {ann[0].get('label')}")
        print(f"First data points: {len(ann[0].get('data', [])) if ann[0].get('data') else 'None'}")
    
    qtr = res.get('quarter', [])
    print(f"Quarter item count: {len(qtr)}")
except Exception as e:
    print(f"Error: {e}")
