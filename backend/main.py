import io
import os
import re
import requests
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from scraper import scrape_company, scrape_equity, scrape_quote, scrape_market_summary, scrape_announcements
from gemini_summarizer import analyze_announcement

# ─────────────────────────────────────────────
# APP SETUP
# ─────────────────────────────────────────────
app = FastAPI(title="FinForecaster.pk API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# LOAD COMPANY LIST
# ─────────────────────────────────────────────
DATA_DIR = os.path.join(os.path.dirname(__file__), "..")
COMPANY_FILE = os.path.join(DATA_DIR, "company_name_value.xls")

_companies_cache = None
_market_summary_cache = None


def get_companies():
    global _companies_cache
    if _companies_cache is None:
        df = pd.read_csv(COMPANY_FILE)
        _companies_cache = df.to_dict(orient="records")
    return _companies_cache


def get_market_summary_cached():
    """Return cached market summary; refreshes if called again (in-process cache)."""
    global _market_summary_cache
    if _market_summary_cache is None:
        _market_summary_cache = scrape_market_summary()
    return _market_summary_cache


# ─────────────────────────────────────────────
# ASKANALYST API PROXY HELPERS
# ─────────────────────────────────────────────
ASK_BASE = "https://api.askanalyst.com.pk/api"


def proxy_get(path: str):
    """Fetch JSON from AskAnalyst API with retries and long timeout."""
    url = f"{ASK_BASE}/{path}"
    print(f"Proxy Request: {url}")
    
    max_retries = 2
    for attempt in range(max_retries + 1):
        try:
            res = requests.get(url, timeout=60)
            res.raise_for_status()
            return res.json()
        except Exception as e:
            print(f"Proxy Attempt {attempt+1} failed: {e}")
            if attempt == max_retries:
                raise HTTPException(status_code=502, detail=f"Upstream error after {max_retries+1} attempts: {str(e)}")
            continue


# ─────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────


@app.get("/")
def root():
    return {"message": "FinForecaster.pk API", "version": "1.0.0"}


@app.get("/api/companies")
def list_companies():
    """Return all 360 PSX-listed companies."""
    return get_companies()


@app.get("/api/sectors")
def list_sectors():
    """Return unique sectors with company counts from the company list."""
    companies = get_companies()
    sector_map = {}
    for c in companies:
        s = c.get("sector", "Unknown")
        if s not in sector_map:
            sector_map[s] = {"sector": s, "sector_id": c.get("sector_id"), "company_count": 0}
        sector_map[s]["company_count"] += 1
    return sorted(sector_map.values(), key=lambda x: x["sector"])


@app.get("/api/market-summary")
def market_summary(refresh: bool = False):
    """
    Live market data grouped by sector.
    Returns: { sector_name: [ { symbol, company_name, ldcp, open, high, low, current, change, volume, return }, ... ] }
    Pass ?refresh=true to bypass the in-process cache.
    """
    global _market_summary_cache
    if refresh:
        _market_summary_cache = None
    return get_market_summary_cached()


@app.get("/api/sector/{sector_name}/summary")
def sector_summary(sector_name: str):
    """Aggregated market statistics for one sector."""
    data = get_market_summary_cached()
    if "error" in data:
        raise HTTPException(status_code=502, detail=data["error"])

    # Case-insensitive match
    matched_key = next(
        (k for k in data if k.upper() == sector_name.upper()), None
    )
    if not matched_key:
        raise HTTPException(status_code=404, detail=f"Sector '{sector_name}' not found in market summary")

    companies = data[matched_key]
    if not companies:
        return {"sector": matched_key, "companies": [], "stats": {}}

    # Aggregate stats
    valid_change  = [c["change"]  for c in companies if c["change"]  is not None]
    valid_volume  = [c["volume"]  for c in companies if c["volume"]  is not None]
    valid_return  = [c["return"]  for c in companies if c["return"]  is not None]
    valid_ldcp    = [c["ldcp"]    for c in companies if c["ldcp"]    is not None]
    valid_current = [c["current"] for c in companies if c["current"] is not None]

    top_gainer = max(companies, key=lambda c: c["return"] or 0)
    top_loser  = min(companies, key=lambda c: c["return"] or 0)

    stats = {
        "company_count":   len(companies),
        "avg_ldcp":        round(sum(valid_ldcp) / len(valid_ldcp), 2)   if valid_ldcp   else None,
        "avg_current":     round(sum(valid_current) / len(valid_current), 2) if valid_current else None,
        "total_volume":    round(sum(valid_volume), 0)                   if valid_volume  else None,
        "avg_change":      round(sum(valid_change) / len(valid_change), 4) if valid_change else None,
        "avg_return_pct":  round(sum(valid_return) / len(valid_return), 2) if valid_return  else None,
        "top_gainer":      {"symbol": top_gainer["symbol"], "return": top_gainer["return"]},
        "top_loser":       {"symbol": top_loser["symbol"],  "return": top_loser["return"]},
    }

    return {"sector": matched_key, "stats": stats, "companies": companies}


@app.get("/api/company/{company_id}/financials")
def get_financials(company_id: int):
    """Financial summary: EPS, DPS, BVPS, margins, etc."""
    return proxy_get(f"companyfinancialnew/{company_id}?companyfinancial=true&test=true")


@app.get("/api/company/{company_id}/industry")
def get_industry(company_id: int):
    """Industry average metrics for comparison."""
    return proxy_get(f"industrynew/{company_id}")


@app.get("/api/company/{company_id}/stockdata")
def get_stock_data(company_id: int):
    """Stock price data: shares, prices, returns."""
    return proxy_get(f"stockpricedatanew/{company_id}")


@app.get("/api/company/{company_id}/ratios")
def get_ratios(company_id: int):
    """Financial ratios: Valuation, Margins, Returns, Health, Activity, Growth."""
    return proxy_get(f"rationew/{company_id}")


@app.get("/api/company/{company_id}/balance-sheet")
def get_balance_sheet(company_id: int):
    """Balance sheet: annual + quarterly."""
    return proxy_get(f"bs/{company_id}")


@app.get("/api/company/{company_id}/income-statement")
def get_income_statement(company_id: int):
    """Income statement: annual + quarterly."""
    return proxy_get(f"is/{company_id}")


@app.get("/api/company/{company_id}/cash-flow")
def get_cash_flow(company_id: int):
    """Cash flow statement: annual + quarterly."""
    return proxy_get(f"cf/{company_id}")


@app.get("/api/company/{symbol}/quote")
def get_quote(symbol: str):
    """Live quote scraped from PSX."""
    return scrape_quote(symbol.upper())


@app.get("/api/company/{symbol}/profile")
def get_profile(symbol: str):
    """Company profile scraped from PSX (business description, key people, etc.)."""
    return scrape_company(symbol.upper())


@app.get("/api/company/{symbol}/equity")
def get_equity(symbol: str):
    """Equity stats scraped from PSX."""
    return scrape_equity(symbol.upper())


@app.get("/api/company/{symbol}/announcements")
def get_announcements(symbol: str):
    """Company announcements (news) scraped from PSX."""
    return scrape_announcements(symbol.upper())


@app.get("/api/company/{company_id}/overview")
def get_overview(company_id: int):
    """Aggregated overview: finds company by ID, fetches financials + industry + stock data."""
    companies = get_companies()
    company = next((c for c in companies if c["value"] == company_id), None)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    symbol = company["symbol"]

    def safe_proxy(path: str):
        try:
            return proxy_get(path)
        except Exception as e:
            print(f"[overview] Non-fatal upstream error for '{path}': {e}")
            return None

    def safe_scrape(fn, *args):
        try:
            return fn(*args)
        except Exception as e:
            print(f"[overview] Non-fatal scrape error: {e}")
            return None

    return {
        "company": company,
        "financials": safe_proxy(f"companyfinancialnew/{company_id}?companyfinancial=true&test=true"),
        "industry": safe_proxy(f"industrynew/{company_id}"),
        "stock_data": safe_proxy(f"stockpricedatanew/{company_id}"),
        "chart_data": safe_proxy(f"stockchartnew/{company_id}"),
        "ratios": safe_proxy(f"rationew/{company_id}"),
        "balance_sheet": safe_proxy(f"bs/{company_id}"),
        "quote": safe_scrape(scrape_quote, symbol),
        "profile": safe_scrape(scrape_company, symbol),
    }


@app.get("/api/company/{company_id}/chart")
def get_chart_data(company_id: int):
    """Stock chart data: 1D, 1M, 1Y etc."""
    return proxy_get(f"stockchartnew/{company_id}")


# ─────────────────────────────────────────────
# ANNOUNCEMENT SUMMARIZE  (Gemini 2.5 Flash)
# ─────────────────────────────────────────────

class SummarizeRequest(BaseModel):
    pdf_url: str
    title:   str = ""


@app.post("/api/announcements/summarize")
def summarize_announcement(req: SummarizeRequest):
    """
    Gemini 2.5 Flash: download PDF → extract text → single API call →
    returns { summary, sentiment, sentiment_reason, cached }.
    """
    pdf_url = req.pdf_url.strip()
    if not pdf_url or pdf_url == "N/A":
        raise HTTPException(status_code=400, detail="Invalid PDF URL")

    return analyze_announcement(pdf_url=pdf_url, title=req.title)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
