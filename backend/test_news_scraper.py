import requests
from bs4 import BeautifulSoup

def scrape_announcements(symbol: str) -> list:
    url = "https://dps.psx.com.pk/announcements"
    payload = {
        "type": "C",
        "symbol": symbol,
        "query": "",
        "count": 10,
        "offset": 0,
        "page": "annc"
    }
    
    headers = {"User-Agent": "Mozilla/5.0"}
    
    try:
        res = requests.post(url, data=payload, headers=headers, timeout=20)
        res.raise_for_status()
    except Exception as e:
        print(f"Error: {e}")
        return []

    soup = BeautifulSoup(res.text, "html.parser")
    rows = soup.select("#announcementsTable tbody tr")
    
    announcements = []
    for row in rows:
        cols = row.find_all("td")
        if len(cols) < 6:
            continue
            
        date = cols[0].get_text(strip=True)
        time = cols[1].get_text(strip=True)
        sym = cols[2].get_text(strip=True)
        company = cols[3].get_text(strip=True)
        title = cols[4].get_text(strip=True)
        
        pdf_link_raw = cols[5].find("a", href=lambda h: h and "/download/document/" in h)
        pdf_link = f"https://dps.psx.com.pk{pdf_link_raw['href']}" if pdf_link_raw else "N/A"
        
        announcements.append({
            "date": date,
            "time": time,
            "symbol": sym,
            "company": company,
            "title": title,
            "pdf_link": pdf_link
        })
        
    return announcements

if __name__ == "__main__":
    symbol = "MARI"
    print(f"Testing announcements scraper for {symbol}...")
    results = scrape_announcements(symbol)
    if results:
        print(f"Found {len(results)} announcements.")
        for i, res in enumerate(results[:3]):
            print(f"{i+1}. {res['date']} {res['time']} - {res['title']}")
            print(f"   Link: {res['pdf_link']}")
    else:
        print("No results found.")
