import React, { useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getAnnouncements } from '../api';
import { useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

// ─── In-browser cache so re-opening the same row is instant ──────────────────
const summaryCache = {};

const fetchAnalysis = async (pdfUrl, title) => {
    const key = pdfUrl;
    if (summaryCache[key]) return summaryCache[key];
    try {
        const res = await axios.post(
            `${API_BASE}/announcements/summarize`,
            { pdf_url: pdfUrl, title: title || '' },
            { timeout: 40000 }
        );
        const data = res.data;
        const result = {
            summary:          data.summary          || 'No summary available.',
            sentiment:        data.sentiment         || 'neutral',
            sentiment_reason: data.sentiment_reason  || '',
        };
        summaryCache[key] = result;
        return result;
    } catch {
        return {
            summary:          'Could not generate summary. Please open the PDF directly.',
            sentiment:        'neutral',
            sentiment_reason: '',
        };
    }
};

// ─── Sentiment badge ──────────────────────────────────────────────────────────
const SENTIMENT_CONFIG = {
    positive: {
        label: 'Positive',
        bg:    'bg-emerald-50',
        border:'border-emerald-200',
        text:  'text-emerald-700',
        dot:   'bg-emerald-500',
    },
    negative: {
        label: 'Negative',
        bg:    'bg-red-50',
        border:'border-red-200',
        text:  'text-red-700',
        dot:   'bg-red-500',
    },
    neutral: {
        label: 'Neutral',
        bg:    'bg-slate-50',
        border:'border-slate-200',
        text:  'text-slate-600',
        dot:   'bg-slate-400',
    },
};

const SentimentBadge = ({ sentiment }) => {
    const s  = sentiment?.toLowerCase() || 'neutral';
    const cfg = SENTIMENT_CONFIG[s] || SENTIMENT_CONFIG.neutral;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold
                          border ${cfg.bg} ${cfg.border} ${cfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
};

// ─── Chevron ──────────────────────────────────────────────────────────────────
const ChevronIcon = ({ open }) => (
    <svg
        className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

// ─── Single announcement row ──────────────────────────────────────────────────
const AnnouncementRow = ({ item }) => {
    const [open,      setOpen]      = useState(false);
    const [analysis,  setAnalysis]  = useState(null);
    const [loading,   setLoading]   = useState(false);
    const hasPdf = item.pdf_link && item.pdf_link !== 'N/A';

    const toggle = useCallback(async () => {
        // Fetch on first open only
        if (!open && hasPdf && !analysis) {
            setLoading(true);
            const result = await fetchAnalysis(item.pdf_link, item.title);
            setAnalysis(result);
            setLoading(false);
        }
        setOpen(prev => !prev);
    }, [open, hasPdf, analysis, item.pdf_link, item.title]);

    return (
        <div className={`border-b border-mint-50 last:border-0 transition-colors ${open ? 'bg-mint-50/30' : ''}`}>

            {/* ── Main row (clickable) ── */}
            <div
                className="grid grid-cols-[130px_1fr_80px_36px] items-center px-5 py-3.5
                           hover:bg-mint-50 transition-colors cursor-pointer group"
                onClick={toggle}
            >
                <span className="text-sm text-mint-500 font-medium tabular-nums">{item.date}</span>

                <span className="text-sm text-mint-800 font-medium leading-snug pr-4
                                 group-hover:text-mint-900 transition-colors">
                    {item.title}
                </span>

                {/* PDF button — click doesn't bubble to toggle */}
                <div className="flex justify-end" onClick={e => e.stopPropagation()}>
                    {hasPdf ? (
                        <a
                            href={item.pdf_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg
                                       bg-mint-100 text-mint-700 text-xs font-semibold
                                       hover:bg-mint-600 hover:text-white transition-all border border-mint-200"
                            title="View PDF"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            PDF
                        </a>
                    ) : (
                        <span className="text-xs text-mint-200">—</span>
                    )}
                </div>

                <div className="flex justify-center text-mint-400 group-hover:text-mint-600 transition-colors">
                    <ChevronIcon open={open} />
                </div>
            </div>

            {/* ── Slide-down analysis panel ── */}
            <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: open ? '600px' : '0px', opacity: open ? 1 : 0 }}
            >
                <div className="px-6 pb-5 pt-3 border-t border-mint-100">
                    <div className="flex items-start gap-3">
                        {/* Accent bar */}
                        <div className="w-1 flex-shrink-0 rounded-full self-stretch mt-0.5"
                            style={{
                                background: analysis?.sentiment === 'positive' ? '#10b981'
                                    : analysis?.sentiment === 'negative' ? '#ef4444'
                                    : '#9ca3af'
                            }} />

                        <div className="flex-1 space-y-3">
                            {/* Header row */}
                            <div className="flex items-center gap-3">
                                <p className="text-xs font-bold text-mint-600 uppercase tracking-wider"
                                    style={{ fontFamily: 'Syne, sans-serif' }}>
                                    AI Summary
                                </p>
                                {analysis && <SentimentBadge sentiment={analysis.sentiment} />}
                                {loading && (
                                    <span className="text-xs text-mint-400 flex items-center gap-1">
                                        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10"
                                                stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Analysing with Gemini...
                                    </span>
                                )}
                            </div>

                            {loading ? (
                                <div className="space-y-2 animate-pulse">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className={`h-3 skeleton rounded ${i === 3 ? 'w-3/5' : 'w-full'}`} />
                                    ))}
                                </div>
                            ) : analysis ? (
                                <>
                                    <p className="text-sm text-mint-800 leading-relaxed">
                                        {analysis.summary}
                                    </p>
                                    {analysis.sentiment_reason && (
                                        <div className={`flex items-start gap-2 px-3 py-2 rounded-lg border
                                            ${analysis.sentiment === 'positive'
                                                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                                : analysis.sentiment === 'negative'
                                                ? 'bg-red-50 border-red-100 text-red-700'
                                                : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                                            <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none"
                                                stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-xs leading-relaxed">
                                                {analysis.sentiment_reason}
                                            </span>
                                        </div>
                                    )}
                                </>
                            ) : !hasPdf ? (
                                <p className="text-sm text-mint-400 italic">
                                    No PDF available for this announcement.
                                </p>
                            ) : null}

                            {/* Footer link */}
                            {hasPdf && !loading && analysis && (
                                <a href={item.pdf_link} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold
                                               text-mint-500 hover:text-mint-800 transition-colors">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    Open full document
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Main News Page ───────────────────────────────────────────────────────────
const News = () => {
    const { companyInfo } = useOutletContext();
    const [news,    setNews]    = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);

    useEffect(() => {
        if (companyInfo?.company?.symbol) {
            setLoading(true);
            setError(null);
            getAnnouncements(companyInfo.company.symbol)
                .then(data  => { setNews(data); setLoading(false); })
                .catch(err  => {
                    console.error('Announcements fetch error:', err);
                    setError('Failed to load announcements.');
                    setLoading(false);
                });
        }
    }, [companyInfo]);

    if (loading) return (
        <div className="space-y-3 animate-pulse">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white border border-mint-100 rounded-xl px-5 py-4 flex items-center gap-4">
                    <div className="skeleton h-4 w-24 flex-shrink-0" />
                    <div className="skeleton h-4 flex-1" />
                </div>
            ))}
        </div>
    );

    if (error) return (
        <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-xl text-center text-sm">{error}</div>
    );

    if (!news.length) return (
        <div className="bg-white border border-mint-100 text-mint-500 p-10 rounded-xl text-center font-medium">
            No recent announcements found for this company.
        </div>
    );

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl font-bold text-mint-900" style={{ fontFamily: 'Syne, sans-serif' }}>
                    Company Announcements
                </h2>
                <div className="flex items-center gap-3 text-xs text-mint-400">
                    <span>Click any row to expand AI summary</span>
                    <span>|</span>
                    <div className="flex items-center gap-2">
                        <SentimentBadge sentiment="positive" />
                        <SentimentBadge sentiment="negative" />
                        <SentimentBadge sentiment="neutral" />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-mint-100 rounded-xl overflow-hidden shadow-sm">
                {/* Header */}
                <div className="grid grid-cols-[130px_1fr_80px_36px] px-5 py-3 bg-mint-50 border-b border-mint-100">
                    {['Date', 'Title', 'Filing', ''].map((h, i) => (
                        <span key={i}
                            className={`text-xs font-bold text-mint-600 uppercase tracking-wider
                                        ${i === 2 ? 'text-right' : ''}`}
                            style={{ fontFamily: 'Syne, sans-serif' }}>
                            {h}
                        </span>
                    ))}
                </div>

                {news.map((item, i) => (
                    <AnnouncementRow key={i} item={item} />
                ))}
            </div>

            <p className="text-xs text-mint-400 text-right">
                AI analysis powered by DeepSeek
            </p>
        </div>
    );
};

export default News;
