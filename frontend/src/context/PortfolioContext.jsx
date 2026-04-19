import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getCompanies } from '../api';

const PortfolioContext = createContext(null);

const STORAGE_KEY  = 'finforecaster_portfolio_v1';
const TX_STORAGE   = 'finforecaster_transactions_v1';
const API_BASE     = 'http://localhost:8000/api';

// ─── Storage helpers ──────────────────────────────────────────────────────────
const load = (key, fallback) => {
    try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
    catch { return fallback; }
};
const save = (key, val) => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};

// ─── Price parser ─────────────────────────────────────────────────────────────
const parsePKRPrice = (val) => {
    if (!val || val === 'N/A') return null;
    const cleaned = String(val).replace(/Rs\.?\s*/gi, '').replace(/,/g, '').trim();
    const num = parseFloat(cleaned);
    return !isNaN(num) && num > 0 ? num : null;
};

// ─── Live price fetch ─────────────────────────────────────────────────────────
const fetchLivePrice = async (symbol) => {
    try {
        const res = await axios.get(
            `${API_BASE}/company/${encodeURIComponent(symbol)}/quote`,
            { timeout: 15000 }
        );
        return parsePKRPrice(res.data?.last_close);
    } catch { return null; }
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const PortfolioProvider = ({ children }) => {
    const [holdings,      setHoldings]      = useState(() => load(STORAGE_KEY, []));
    const [transactions,  setTransactions]  = useState(() => load(TX_STORAGE,  []));
    const [prices,        setPrices]        = useState({});
    const [companies,     setCompanies]     = useState([]);
    const [loadingPrices, setLoadingPrices] = useState(false);

    // Persist
    useEffect(() => { save(STORAGE_KEY, holdings);    }, [holdings]);
    useEffect(() => { save(TX_STORAGE,  transactions); }, [transactions]);

    // Load companies once
    useEffect(() => { getCompanies().then(setCompanies).catch(console.error); }, []);

    // ── Refresh prices ────────────────────────────────────────────────────────
    const refreshPrices = useCallback(async (currentHoldings) => {
        const list = currentHoldings ?? holdings;
        if (list.length === 0) return;
        setLoadingPrices(true);
        const results = await Promise.allSettled(list.map(h => fetchLivePrice(h.symbol)));
        const updated = {};
        results.forEach((r, i) => {
            if (r.status === 'fulfilled' && r.value !== null) updated[list[i].symbol] = r.value;
        });
        if (Object.keys(updated).length > 0) setPrices(prev => ({ ...prev, ...updated }));
        setLoadingPrices(false);
    }, [holdings]);

    useEffect(() => { if (holdings.length > 0) refreshPrices(holdings); }, [holdings.length]);

    // ── Record transaction helper ──────────────────────────────────────────────
    const recordTx = (type, holding, qty, price) => {
        setTransactions(prev => [{
            id:        Date.now(),
            type,                            // 'BUY' | 'SELL'
            symbol:    holding.symbol,
            name:      holding.name,
            shares:    qty,
            price,
            total:     qty * price,
            date:      new Date().toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }),
            time:      new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }),
        }, ...prev].slice(0, 200));  // keep last 200 transactions
    };

    // ── BUY — adds to existing holding (weighted avg cost) ────────────────────
    const addHolding = (holding) => {
        setHoldings(prev => {
            const existing = prev.find(h => h.companyId === holding.companyId);
            if (existing) {
                return prev.map(h => {
                    if (h.companyId !== holding.companyId) return h;
                    const totalShares = h.shares + holding.shares;
                    const avgCost     = (h.shares * h.avgCost + holding.shares * holding.avgCost) / totalShares;
                    return { ...h, shares: totalShares, avgCost };
                });
            }
            return [...prev, { ...holding, id: Date.now() }];
        });
        recordTx('BUY', holding, holding.shares, holding.avgCost);
    };

    // ── SELL — reduces shares; removes holding if fully sold ──────────────────
    // Returns { ok, realizedPL } or { error }
    const sellHolding = (id, qtyToSell, sellPrice) => {
        const holding = holdings.find(h => h.id === id);
        if (!holding) return { error: 'Holding not found.' };

        const qty = parseFloat(qtyToSell);
        const px  = parseFloat(sellPrice);
        if (isNaN(qty) || qty <= 0)           return { error: 'Enter a valid quantity.' };
        if (isNaN(px)  || px  <= 0)           return { error: 'Enter a valid sell price.' };
        if (qty > holding.shares)             return { error: `You only hold ${holding.shares} shares.` };

        const realizedPL = (px - holding.avgCost) * qty;

        if (qty === holding.shares) {
            // Full sell — remove holding
            setHoldings(prev => prev.filter(h => h.id !== id));
            setPrices(prev => { const c = { ...prev }; delete c[holding.symbol]; return c; });
        } else {
            // Partial sell — reduce shares (avg cost stays the same)
            setHoldings(prev => prev.map(h =>
                h.id === id ? { ...h, shares: +(h.shares - qty).toFixed(6) } : h
            ));
        }

        recordTx('SELL', holding, qty, px);
        return { ok: true, realizedPL };
    };

    // ── Remove holding (delete button) ────────────────────────────────────────
    const removeHolding = (id) => {
        const toRemove = holdings.find(h => h.id === id);
        setHoldings(prev => prev.filter(h => h.id !== id));
        if (toRemove) setPrices(prev => { const c = { ...prev }; delete c[toRemove.symbol]; return c; });
    };

    const updateHolding  = (id, updates) =>
        setHoldings(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));

    const clearPortfolio = () => { setHoldings([]); setPrices({}); };

    const clearTransactions = () => setTransactions([]);

    // ── Enrich holdings with live P&L ─────────────────────────────────────────
    const enrichedHoldings = holdings.map(h => {
        const currentPrice = prices[h.symbol] ?? null;
        const invested     = h.shares * h.avgCost;
        const currentValue = currentPrice !== null ? h.shares * currentPrice : null;
        const plPKR        = currentValue !== null ? currentValue - invested : null;
        const plPct        = invested > 0 && plPKR !== null ? (plPKR / invested) * 100 : null;
        return { ...h, currentPrice, invested, currentValue, plPKR, plPct };
    });

    // ── Portfolio summary ──────────────────────────────────────────────────────
    const summary = enrichedHoldings.reduce(
        (acc, h) => {
            acc.totalInvested     += h.invested;
            acc.totalCurrentValue += h.currentValue !== null ? h.currentValue : h.invested;
            acc.totalPL           += h.plPKR !== null ? h.plPKR : 0;
            return acc;
        },
        { totalInvested: 0, totalCurrentValue: 0, totalPL: 0 }
    );
    summary.totalPlPct = summary.totalInvested > 0
        ? (summary.totalPL / summary.totalInvested) * 100 : 0;

    // Realized P&L from transaction history
    summary.realizedPL = transactions.reduce((sum, tx) => {
        if (tx.type === 'SELL') {
            const h = holdings.find(h => h.symbol === tx.symbol);
            const avgCost = h?.avgCost ?? tx.price;
            return sum + (tx.price - avgCost) * tx.shares;
        }
        return sum;
    }, 0);

    return (
        <PortfolioContext.Provider value={{
            holdings: enrichedHoldings,
            rawHoldings: holdings,
            transactions,
            companies,
            prices,
            loadingPrices,
            summary,
            addHolding,
            sellHolding,
            removeHolding,
            updateHolding,
            clearPortfolio,
            clearTransactions,
            refreshPrices: () => refreshPrices(holdings),
        }}>
            {children}
        </PortfolioContext.Provider>
    );
};

export const usePortfolio = () => {
    const ctx = useContext(PortfolioContext);
    if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
    return ctx;
};
