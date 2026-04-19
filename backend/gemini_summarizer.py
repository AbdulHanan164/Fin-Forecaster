"""
gemini_summarizer.py
────────────────────
AI summarizer for PSX announcement PDFs.
Provider: DeepSeek (deepseek-chat via OpenAI-compatible API)

Design goals
- ONE API call per document (summary + sentiment in single request)
- Server-side LRU cache — repeat requests for same PDF = instant, zero cost
- pypdf extracts text locally; scanned PDFs fall back to title-only analysis
- Structured JSON output parsed safely with markdown-fence fallback
"""

import io
import re
import json
import logging
import requests
from openai import OpenAI

logger = logging.getLogger(__name__)

# ── DeepSeek client (singleton — created once at import time) ─────────────────
_CLIENT = OpenAI(
    api_key  = "sk-09f6406f3b1840458e6e2ff3d025c81a",
    base_url = "https://api.deepseek.com",
)
_MODEL = "deepseek-chat"           # DeepSeek-V3 — fast, accurate, cost-effective

# ── Server-side in-memory cache: pdf_url → result dict ────────────────────────
_cache: dict[str, dict] = {}
MAX_CACHE = 200


def _cache_put(key: str, value: dict):
    if len(_cache) >= MAX_CACHE:
        first = next(iter(_cache))
        del _cache[first]
    _cache[key] = value


# ── PDF download & text extraction ────────────────────────────────────────────
def _fetch_pdf_bytes(url: str) -> bytes | None:
    try:
        resp = requests.get(
            url,
            headers={"User-Agent": "Mozilla/5.0"},
            timeout=15,
        )
        resp.raise_for_status()
        return resp.content
    except Exception as exc:
        logger.warning("PDF download failed (%s): %s", url, exc)
        return None


def _extract_text(pdf_bytes: bytes, max_chars: int = 3000) -> str:
    """Extract plain text with pypdf. Returns '' for image-only PDFs."""
    try:
        from pypdf import PdfReader
        reader = PdfReader(io.BytesIO(pdf_bytes))
        parts: list[str] = []
        total = 0
        for page in reader.pages:
            t = (page.extract_text() or "").strip()
            if t:
                parts.append(t)
                total += len(t)
            if total >= max_chars:
                break
        return "\n".join(parts)[:max_chars]
    except Exception as exc:
        logger.warning("pypdf extraction failed: %s", exc)
        return ""


# ── Prompt ────────────────────────────────────────────────────────────────────
_SYSTEM = (
    "You are a financial analyst specializing in Pakistan Stock Exchange (PSX) "
    "corporate announcements. Always respond with ONLY valid JSON — no markdown "
    "fences, no extra keys, no commentary."
)

_USER_TEMPLATE = """\
Announcement title: {title}

{content_block}

Return ONLY this JSON object:
{{
  "summary": "<3-5 concise sentences covering the key facts>",
  "sentiment": "<positive|negative|neutral>",
  "sentiment_reason": "<one sentence explaining the sentiment from a retail investor perspective>"
}}"""


def _build_user_prompt(title: str, text: str) -> str:
    if text.strip():
        content_block = f"Document content (extracted from PDF):\n{text}"
    else:
        content_block = (
            "(The PDF is image-based or unreadable. "
            "Analyse based on the announcement title only.)"
        )
    return _USER_TEMPLATE.format(title=title, content_block=content_block)


# ── Response parser ───────────────────────────────────────────────────────────
def _parse(raw: str) -> dict:
    def _clean_sentiment(s: str) -> str:
        s = s.lower().strip()
        return s if s in ("positive", "negative", "neutral") else "neutral"

    # Try direct parse
    try:
        data = json.loads(raw)
        return {
            "summary":          str(data.get("summary", "Summary unavailable.")),
            "sentiment":        _clean_sentiment(data.get("sentiment", "neutral")),
            "sentiment_reason": str(data.get("sentiment_reason", "")),
        }
    except (json.JSONDecodeError, AttributeError):
        pass

    # Strip markdown fences and retry
    cleaned = re.sub(r"```[a-z]*\n?|```", "", raw).strip()
    try:
        data = json.loads(cleaned)
        return {
            "summary":          str(data.get("summary", "Summary unavailable.")),
            "sentiment":        _clean_sentiment(data.get("sentiment", "neutral")),
            "sentiment_reason": str(data.get("sentiment_reason", "")),
        }
    except Exception:
        pass

    # Last resort: return raw text as summary
    return {
        "summary":          (raw[:600] if raw else "Could not parse response."),
        "sentiment":        "neutral",
        "sentiment_reason": "Automated parsing failed.",
    }


# ── Public API ────────────────────────────────────────────────────────────────
def analyze_announcement(pdf_url: str, title: str = "") -> dict:
    """
    Main entry point.

    Returns:
        {
            "summary":          str,
            "sentiment":        "positive" | "negative" | "neutral",
            "sentiment_reason": str,
            "cached":           bool,
        }
    """
    cache_key = pdf_url.strip()

    # 1. Cache hit — instant, zero cost
    if cache_key in _cache:
        return {**_cache[cache_key], "cached": True}

    # 2. Download + extract PDF text
    pdf_bytes = _fetch_pdf_bytes(cache_key) if cache_key and cache_key != "N/A" else None
    text      = _extract_text(pdf_bytes) if pdf_bytes else ""

    # 3. Single DeepSeek API call
    user_prompt = _build_user_prompt(title or "PSX Announcement", text)
    try:
        response = _CLIENT.chat.completions.create(
            model       = _MODEL,
            messages    = [
                {"role": "system", "content": _SYSTEM},
                {"role": "user",   "content": user_prompt},
            ],
            temperature      = 0.1,    # low → factual, deterministic
            max_tokens       = 400,    # summary + sentiment fits in ~250 tokens
            response_format  = {"type": "json_object"},  # DeepSeek JSON mode
        )
        raw = response.choices[0].message.content or ""
    except Exception as exc:
        logger.error("DeepSeek API error: %s", exc)
        return {
            "summary":          "Unable to generate summary at this time.",
            "sentiment":        "neutral",
            "sentiment_reason": "DeepSeek API call failed.",
            "cached":           False,
        }

    # 4. Parse + cache
    parsed = _parse(raw)
    _cache_put(cache_key, parsed)
    return {**parsed, "cached": False}
