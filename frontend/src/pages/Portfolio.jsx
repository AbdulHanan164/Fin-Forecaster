import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n, dec = 2) =>
    n === null || n === undefined || isNaN(n)
        ? '—'
        : Number(n).toLocaleString('en-PK', { minimumFractionDigits: dec, maximumFractionDigits: dec });

const fmtPct = (n) =>
    n === null || n === undefined || isNaN(n) ? '—' : `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

const PLBadge = ({ value, pct }) => {
    if (value === null) return <span className="text-mint-400 text-xs">Pending</span>;
    const pos = value >= 0;
    return (
        <div className={`text-right ${pos ? 'text-emerald-600' : 'text-red-600'}`}>
            <div className="font-semibold text-sm">{pos ? '+' : ''}{fmt(value, 0)}</div>
            <div className="text-xs font-medium">{fmtPct(pct)}</div>
        </div>
    );
};

const SECTOR_COLORS = [
    '#2D8C7A', '#4ECDA4', '#7EDFC3', '#256B61', '#1F5148',
    '#2DB88E', '#AEEBD6', '#1A3D36', '#38A890', '#5DE0B3',
];

// ─── Add Holding Modal (BUY new position) ────────────────────────────────────
const AddHoldingModal = ({ onClose }) => {
    const { companies, addHolding, prices } = usePortfolio();
    const [search,   setSearch]   = useState('');
    const [selected, setSelected] = useState(null);
    const [shares,   setShares]   = useState('');
    const [avgCost,  setAvgCost]  = useState('');
    const [error,    setError]    = useState('');

    const filtered = useMemo(() => {
        if (!search.trim()) return companies.slice(0, 50);
        const q = search.toLowerCase();
        return companies.filter(c =>
            c.name?.toLowerCase().includes(q) ||
            c.label2?.toLowerCase().includes(q) ||
            c.symbol?.toLowerCase().includes(q)
        ).slice(0, 30);
    }, [search, companies]);

    const livePrice = selected ? prices[selected.symbol] : null;
    const total     = parseFloat(shares) > 0 && parseFloat(avgCost) > 0
        ? (parseFloat(shares) * parseFloat(avgCost)).toLocaleString('en-PK', { maximumFractionDigits: 0 })
        : null;

    const handleAdd = () => {
        if (!selected)               { setError('Please select a company.'); return; }
        const sh = parseFloat(shares);
        const ac = parseFloat(avgCost);
        if (isNaN(sh) || sh <= 0)   { setError('Enter a valid number of shares.'); return; }
        if (isNaN(ac) || ac <= 0)   { setError('Enter a valid buy price (PKR).'); return; }
        addHolding({ companyId: selected.value, symbol: selected.symbol, name: selected.name, sector: selected.sector || 'N/A', shares: sh, avgCost: ac });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(26,61,54,0.5)' }}>
            <div className="bg-white rounded-2xl shadow-mint-lg w-full max-w-lg mx-4 animate-slide-up overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-mint-100"
                    style={{ background: 'linear-gradient(90deg, #1F5148 0%, #2D8C7A 100%)' }}>
                    <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </span>
                        <h2 className="text-base font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Buy / Add Holding</h2>
                    </div>
                    <button onClick={onClose} className="text-mint-200 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Company search */}
                    <div>
                        <label className="block text-sm font-semibold text-mint-700 mb-1.5" style={{ fontFamily: 'Syne, sans-serif' }}>Company</label>
                        <input type="text" className="input-field" placeholder="Search by name or symbol..."
                            value={search} onChange={e => { setSearch(e.target.value); setSelected(null); }} />
                        {search.length > 0 && !selected && (
                            <div className="mt-1 border border-mint-200 rounded-xl overflow-hidden shadow-sm max-h-44 overflow-y-auto">
                                {filtered.length === 0
                                    ? <div className="px-4 py-3 text-sm text-mint-400">No companies found.</div>
                                    : filtered.map(c => (
                                        <button key={c.value}
                                            className="w-full text-left px-4 py-2.5 text-sm text-mint-800 hover:bg-mint-50 flex justify-between items-center transition-colors"
                                            onClick={() => { setSelected(c); setSearch(c.name); }}>
                                            <span className="font-medium">{c.name}</span>
                                            <span className="text-xs text-mint-500 badge-mint ml-2">{c.symbol || c.label2}</span>
                                        </button>
                                    ))}
                            </div>
                        )}
                        {selected && (
                            <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-mint-50 border border-mint-200 rounded-xl text-sm">
                                <span className="badge-mint font-bold">{selected.symbol || selected.label2}</span>
                                <span className="text-mint-700 font-medium">{selected.name}</span>
                                {livePrice && <span className="ml-auto text-xs text-emerald-600 font-semibold">Live: PKR {fmt(livePrice)}</span>}
                                <button onClick={() => { setSelected(null); setSearch(''); }} className="text-mint-400 hover:text-red-500 transition-colors ml-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-mint-700 mb-1.5" style={{ fontFamily: 'Syne, sans-serif' }}>Shares</label>
                            <input type="number" min="1" className="input-field" placeholder="e.g. 500"
                                value={shares} onChange={e => setShares(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-mint-700 mb-1.5" style={{ fontFamily: 'Syne, sans-serif' }}>Buy Price (PKR / share)</label>
                            <input type="number" min="0.01" step="0.01" className="input-field" placeholder="e.g. 125.50"
                                value={avgCost} onChange={e => setAvgCost(e.target.value)} />
                            {livePrice && (
                                <button className="text-xs text-mint-500 mt-1 hover:text-mint-700"
                                    onClick={() => setAvgCost(livePrice.toFixed(2))}>
                                    Use live price: PKR {fmt(livePrice)}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Order total */}
                    {total && (
                        <div className="bg-mint-50 border border-mint-200 rounded-xl px-4 py-3 flex justify-between items-center">
                            <span className="text-sm text-mint-600">Order Total</span>
                            <span className="text-base font-bold text-mint-900" style={{ fontFamily: 'Syne, sans-serif' }}>PKR {total}</span>
                        </div>
                    )}

                    {error && (
                        <p className="text-xs text-red-600 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </p>
                    )}

                    <div className="flex gap-3 pt-1">
                        <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                        <button onClick={handleAdd}
                            className="flex-1 py-2.5 px-4 rounded-xl font-bold text-sm text-white transition-all
                                       bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                            style={{ fontFamily: 'Syne, sans-serif' }}>
                            Confirm Buy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Sell Modal ───────────────────────────────────────────────────────────────
const SellModal = ({ holding, onClose }) => {
    const { sellHolding, prices } = usePortfolio();
    const [qty,      setQty]      = useState('');
    const [sellPx,   setSellPx]   = useState(prices[holding.symbol] ? String(prices[holding.symbol].toFixed(2)) : '');
    const [error,    setError]    = useState('');
    const [result,   setResult]   = useState(null);  // { realizedPL }

    const livePrice = prices[holding.symbol];
    const qtyNum    = parseFloat(qty);
    const pxNum     = parseFloat(sellPx);
    const proceeds  = !isNaN(qtyNum) && !isNaN(pxNum) ? qtyNum * pxNum : null;
    const estPL     = !isNaN(qtyNum) && !isNaN(pxNum) ? (pxNum - holding.avgCost) * qtyNum : null;

    const handleSell = () => {
        const res = sellHolding(holding.id, qty, sellPx);
        if (res.error) { setError(res.error); return; }
        setResult(res);
    };

    if (result) {
        const pos = result.realizedPL >= 0;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(26,61,54,0.5)' }}>
                <div className="bg-white rounded-2xl shadow-mint-lg w-full max-w-sm mx-4 animate-slide-up p-8 text-center">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${pos ? 'bg-emerald-100' : 'bg-red-100'}`}>
                        <svg className={`w-7 h-7 ${pos ? 'text-emerald-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-mint-900 mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>
                        Sale Executed
                    </h3>
                    <p className="text-sm text-mint-500 mb-4">
                        Sold {qtyNum} shares of {holding.symbol} @ PKR {fmt(pxNum)}
                    </p>
                    <div className={`text-2xl font-extrabold mb-6 ${pos ? 'text-emerald-600' : 'text-red-600'}`}
                        style={{ fontFamily: 'Syne, sans-serif' }}>
                        {pos ? '+' : ''}PKR {fmt(result.realizedPL, 0)}
                        <p className="text-sm font-normal mt-1 text-mint-400">Realized P&L</p>
                    </div>
                    <button onClick={onClose} className="btn-primary w-full">Done</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(26,61,54,0.5)' }}>
            <div className="bg-white rounded-2xl shadow-mint-lg w-full max-w-md mx-4 animate-slide-up overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-mint-100"
                    style={{ background: 'linear-gradient(90deg, #7f1d1d 0%, #dc2626 100%)' }}>
                    <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </span>
                        <h2 className="text-base font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Sell Shares</h2>
                    </div>
                    <button onClick={onClose} className="text-red-200 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Holding info */}
                    <div className="bg-mint-50 border border-mint-100 rounded-xl px-4 py-3 flex items-center justify-between">
                        <div>
                            <p className="font-bold text-mint-900 text-sm" style={{ fontFamily: 'Syne, sans-serif' }}>{holding.symbol}</p>
                            <p className="text-xs text-mint-500">{holding.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-mint-500">Available</p>
                            <p className="font-bold text-mint-900">{fmt(holding.shares, 0)} shares</p>
                            <p className="text-xs text-mint-400">Avg cost: PKR {fmt(holding.avgCost)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-mint-700 mb-1.5" style={{ fontFamily: 'Syne, sans-serif' }}>
                                Shares to Sell
                            </label>
                            <input type="number" min="1" max={holding.shares} className="input-field"
                                placeholder={`Max ${fmt(holding.shares, 0)}`}
                                value={qty} onChange={e => { setQty(e.target.value); setError(''); }} />
                            <button className="text-xs text-mint-500 mt-1 hover:text-mint-700"
                                onClick={() => setQty(String(holding.shares))}>
                                Sell all
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-mint-700 mb-1.5" style={{ fontFamily: 'Syne, sans-serif' }}>
                                Sell Price (PKR / share)
                            </label>
                            <input type="number" min="0.01" step="0.01" className="input-field"
                                placeholder="e.g. 150.00"
                                value={sellPx} onChange={e => { setSellPx(e.target.value); setError(''); }} />
                            {livePrice && (
                                <button className="text-xs text-mint-500 mt-1 hover:text-mint-700"
                                    onClick={() => setSellPx(livePrice.toFixed(2))}>
                                    Use live: PKR {fmt(livePrice)}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* P&L estimate */}
                    {proceeds !== null && estPL !== null && (
                        <div className={`border rounded-xl px-4 py-3 space-y-1.5 ${estPL >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                            <div className="flex justify-between text-sm">
                                <span className="text-mint-600">Sale Proceeds</span>
                                <span className="font-semibold text-mint-900">PKR {fmt(proceeds, 0)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-mint-600">Cost Basis</span>
                                <span className="font-semibold text-mint-900">PKR {fmt(holding.avgCost * qtyNum, 0)}</span>
                            </div>
                            <div className="flex justify-between text-sm border-t border-current/20 pt-1.5 mt-1.5">
                                <span className={`font-bold ${estPL >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>Realized P&L</span>
                                <span className={`font-bold text-base ${estPL >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                                    {estPL >= 0 ? '+' : ''}PKR {fmt(estPL, 0)}
                                </span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <p className="text-xs text-red-600 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </p>
                    )}

                    <div className="flex gap-3 pt-1">
                        <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                        <button onClick={handleSell}
                            className="flex-1 py-2.5 px-4 rounded-xl font-bold text-sm text-white transition-all
                                       bg-red-600 hover:bg-red-700 shadow-sm"
                            style={{ fontFamily: 'Syne, sans-serif' }}>
                            Confirm Sell
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Summary Card ─────────────────────────────────────────────────────────────
const SummaryCard = ({ label, value, sub, positive }) => (
    <div className="stat-card">
        <p className="text-xs font-semibold text-mint-500 uppercase tracking-wider mb-1"
            style={{ fontFamily: 'Syne, sans-serif' }}>{label}</p>
        <p className={`text-2xl font-extrabold ${
            positive === true  ? 'text-emerald-600'
          : positive === false ? 'text-red-600'
          : 'text-mint-900'
        }`} style={{ fontFamily: 'Syne, sans-serif' }}>{value}</p>
        {sub && <p className="text-xs text-mint-400 mt-1">{sub}</p>}
    </div>
);

// ─── Transaction History ──────────────────────────────────────────────────────
const TransactionHistory = ({ transactions, onClear }) => {
    if (transactions.length === 0) return (
        <div className="bg-white border border-mint-100 rounded-[14px] p-8 text-center text-mint-400 text-sm">
            No transactions recorded yet.
        </div>
    );
    return (
        <div className="bg-white border border-mint-100 rounded-[14px] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-mint-100 bg-mint-50">
                <h2 className="font-bold text-mint-900" style={{ fontFamily: 'Syne, sans-serif' }}>
                    Transaction History
                    <span className="ml-2 text-xs font-normal text-mint-400">({transactions.length} records)</span>
                </h2>
                <button onClick={onClear} className="text-xs text-mint-400 hover:text-red-500 transition-colors">
                    Clear history
                </button>
            </div>
            <div className="divide-y divide-mint-50 max-h-80 overflow-y-auto">
                {transactions.map(tx => (
                    <div key={tx.id} className="grid grid-cols-[80px_1fr_90px_90px_90px] items-center px-5 py-3 hover:bg-mint-50 transition-colors">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-lg w-fit
                                         ${tx.type === 'BUY'
                                             ? 'bg-emerald-100 text-emerald-700'
                                             : 'bg-red-100 text-red-700'}`}>
                            {tx.type}
                        </span>
                        <div>
                            <p className="text-sm font-semibold text-mint-800">{tx.symbol}</p>
                            <p className="text-xs text-mint-400">{tx.date} {tx.time}</p>
                        </div>
                        <div className="text-right text-sm text-mint-700 tabular-nums">
                            {fmt(tx.shares, 0)} <span className="text-mint-400 text-xs">shares</span>
                        </div>
                        <div className="text-right text-sm text-mint-700 tabular-nums">
                            PKR {fmt(tx.price)}
                        </div>
                        <div className="text-right text-sm font-semibold text-mint-800 tabular-nums">
                            PKR {fmt(tx.total, 0)}
                        </div>
                    </div>
                ))}
            </div>
            {/* Header for clarity */}
            <div className="grid grid-cols-[80px_1fr_90px_90px_90px] px-5 py-2 border-t border-mint-100 bg-mint-50
                            text-xs font-bold text-mint-500 uppercase tracking-wider"
                style={{ fontFamily: 'Syne, sans-serif' }}>
                <span />
                <span>Company</span>
                <span className="text-right">Qty</span>
                <span className="text-right">Price</span>
                <span className="text-right">Total</span>
            </div>
        </div>
    );
};

// ─── Main Portfolio Page ──────────────────────────────────────────────────────
const Portfolio = () => {
    const {
        holdings, summary, transactions,
        removeHolding, refreshPrices, loadingPrices,
        clearPortfolio, clearTransactions,
    } = usePortfolio();
    const navigate = useNavigate();
    const [showBuyModal,  setShowBuyModal]  = useState(false);
    const [sellTarget,    setSellTarget]    = useState(null);  // holding object
    const [confirmClear,  setConfirmClear]  = useState(false);
    const [activeTab,     setActiveTab]     = useState('holdings'); // 'holdings' | 'history'

    const sectorAllocation = useMemo(() => {
        const map = {};
        holdings.forEach(h => {
            const sector = h.sector || 'Other';
            const val    = h.currentValue || h.invested;
            map[sector] = (map[sector] || 0) + val;
        });
        return Object.entries(map).map(([sector, value]) => ({ sector, value }));
    }, [holdings]);

    const fmtPKR   = (v) => `PKR ${fmt(v, 0)}`;
    const plPos    = summary.totalPL >= 0;

    return (
        <div className="min-h-screen bg-mint-50">
            {/* Header */}
            <div className="border-b border-mint-200"
                style={{ background: 'linear-gradient(135deg, #1A3D36 0%, #2D8C7A 100%)' }}>
                <div className="container mx-auto px-4 py-10">
                    <nav className="flex items-center gap-2 text-sm text-mint-300 mb-4">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-white font-medium">Portfolio</span>
                    </nav>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                                My Portfolio
                            </h1>
                            <p className="text-mint-200 mt-1 text-sm">
                                Buy, sell and track your PSX holdings in real time.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <button onClick={refreshPrices} disabled={loadingPrices || holdings.length === 0}
                                className="flex items-center gap-1.5 px-3 py-2 bg-white/15 border border-white/30
                                           text-white text-sm font-medium rounded-xl hover:bg-white/25 transition-all disabled:opacity-40">
                                <svg className={`w-4 h-4 ${loadingPrices ? 'animate-spin' : ''}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                {loadingPrices ? 'Refreshing...' : 'Refresh Prices'}
                            </button>
                            <button onClick={() => setShowBuyModal(true)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-white text-mint-800 text-sm
                                           font-bold rounded-xl hover:bg-mint-50 transition-all shadow-sm"
                                style={{ fontFamily: 'Syne, sans-serif' }}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Buy
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">

                {/* Empty state */}
                {holdings.length === 0 && (
                    <div className="card text-center py-16 animate-fade-in">
                        <div className="w-16 h-16 bg-mint-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-mint-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-mint-900 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                            Your portfolio is empty
                        </h3>
                        <p className="text-mint-500 mb-6 max-w-sm mx-auto">
                            Track your holdings and monitor real-time profit & loss.
                        </p>
                        <button onClick={() => setShowBuyModal(true)} className="btn-primary inline-flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Buy Your First Stock
                        </button>
                    </div>
                )}

                {holdings.length > 0 && (
                    <>
                        {/* Summary cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
                            <SummaryCard label="Total Invested"  value={fmtPKR(summary.totalInvested)}
                                sub={`${holdings.length} holding${holdings.length !== 1 ? 's' : ''}`} />
                            <SummaryCard label="Current Value"   value={fmtPKR(summary.totalCurrentValue)}
                                sub="Based on live prices" />
                            <SummaryCard label="Unrealized P&L"  value={`${plPos ? '+' : ''}${fmtPKR(summary.totalPL)}`}
                                sub={fmtPct(summary.totalPlPct)} positive={plPos} />
                            <SummaryCard label="Best Performer"
                                value={(() => {
                                    const b = [...holdings].sort((a,b) => (b.plPct||-Infinity)-(a.plPct||-Infinity))[0];
                                    return b?.symbol || '—';
                                })()}
                                sub={(() => {
                                    const b = [...holdings].sort((a,b) => (b.plPct||-Infinity)-(a.plPct||-Infinity))[0];
                                    return b?.plPct !== null ? fmtPct(b?.plPct) : '';
                                })()}
                                positive={true} />
                        </div>

                        {/* Tab bar */}
                        <div className="flex gap-1 bg-white border border-mint-100 rounded-xl p-1 w-fit">
                            {['holdings', 'history'].map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all capitalize
                                                ${activeTab === tab
                                                    ? 'bg-mint-700 text-white shadow-sm'
                                                    : 'text-mint-500 hover:text-mint-800'}`}
                                    style={{ fontFamily: 'Syne, sans-serif' }}>
                                    {tab === 'holdings' ? 'Holdings' : `History (${transactions.length})`}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'holdings' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Holdings Table */}
                                <div className="lg:col-span-2 bg-white border border-mint-100 rounded-[14px] shadow-sm overflow-hidden animate-slide-up-delay-1">
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-mint-100">
                                        <h2 className="font-bold text-mint-900" style={{ fontFamily: 'Syne, sans-serif' }}>Holdings</h2>
                                        {confirmClear ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-red-600 font-medium">Confirm clear?</span>
                                                <button onClick={() => { clearPortfolio(); setConfirmClear(false); }}
                                                    className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-all">
                                                    Yes
                                                </button>
                                                <button onClick={() => setConfirmClear(false)}
                                                    className="text-xs px-2 py-1 bg-mint-50 text-mint-600 rounded-lg font-semibold">
                                                    No
                                                </button>
                                            </div>
                                        ) : (
                                            <button onClick={() => setConfirmClear(true)}
                                                className="text-xs text-mint-400 hover:text-red-500 transition-colors">
                                                Clear all
                                            </button>
                                        )}
                                    </div>

                                    {/* Table header */}
                                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_120px] px-5 py-2.5 bg-mint-50 border-b border-mint-100
                                                    text-xs font-bold text-mint-600 uppercase tracking-wider"
                                        style={{ fontFamily: 'Syne, sans-serif' }}>
                                        <span>Company</span>
                                        <span className="text-right">Shares</span>
                                        <span className="text-right">Avg Cost</span>
                                        <span className="text-right">Price</span>
                                        <span className="text-right">P&L</span>
                                        <span className="text-center">Actions</span>
                                    </div>

                                    <div className="divide-y divide-mint-50">
                                        {holdings.map(h => (
                                            <div key={h.id}
                                                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_120px] items-center px-5 py-3.5 hover:bg-mint-50 transition-colors group">
                                                <div>
                                                    <button className="text-sm font-semibold text-mint-800 hover:text-mint-600 transition-colors text-left"
                                                        onClick={() => navigate(`/company/${h.companyId}/overview`)}
                                                        style={{ fontFamily: 'Syne, sans-serif' }}>
                                                        {h.symbol}
                                                    </button>
                                                    <p className="text-xs text-mint-400 truncate max-w-[140px]">{h.name}</p>
                                                </div>
                                                <div className="text-right text-sm text-mint-700 font-medium tabular-nums">{fmt(h.shares, 0)}</div>
                                                <div className="text-right text-sm text-mint-700 tabular-nums">{fmt(h.avgCost)}</div>
                                                <div className="text-right text-sm text-mint-800 font-semibold tabular-nums">
                                                    {h.currentPrice ? fmt(h.currentPrice) : <span className="text-mint-300 text-xs">—</span>}
                                                </div>
                                                <PLBadge value={h.plPKR} pct={h.plPct} />

                                                {/* Buy / Sell / Remove actions */}
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => setShowBuyModal(true)}
                                                        title="Buy more"
                                                        className="px-2 py-1 text-xs font-bold rounded-lg bg-emerald-100 text-emerald-700
                                                                   hover:bg-emerald-600 hover:text-white transition-all">
                                                        Buy
                                                    </button>
                                                    <button
                                                        onClick={() => setSellTarget(h)}
                                                        title="Sell shares"
                                                        className="px-2 py-1 text-xs font-bold rounded-lg bg-red-100 text-red-700
                                                                   hover:bg-red-600 hover:text-white transition-all">
                                                        Sell
                                                    </button>
                                                    <button
                                                        onClick={() => removeHolding(h.id)}
                                                        title="Remove holding"
                                                        className="text-mint-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="px-5 py-3 border-t border-mint-100 bg-mint-50">
                                        <button onClick={() => setShowBuyModal(true)}
                                            className="text-sm text-mint-600 hover:text-mint-800 font-semibold flex items-center gap-1.5 transition-colors"
                                            style={{ fontFamily: 'Syne, sans-serif' }}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Buy another stock
                                        </button>
                                    </div>
                                </div>

                                {/* Sector Allocation Pie */}
                                <div className="bg-white border border-mint-100 rounded-[14px] shadow-sm p-5 animate-slide-up-delay-2">
                                    <h2 className="font-bold text-mint-900 mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>Sector Allocation</h2>
                                    {sectorAllocation.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={240}>
                                            <PieChart>
                                                <Pie data={sectorAllocation} dataKey="value" nameKey="sector"
                                                    cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
                                                    {sectorAllocation.map((e, i) => (
                                                        <Cell key={e.sector} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(v, n) => [`PKR ${fmt(v, 0)}`, n]}
                                                    contentStyle={{ background: '#fff', border: '1px solid #AEEBD6', borderRadius: '10px', fontSize: '12px' }} />
                                                <Legend formatter={v => <span className="text-xs text-mint-700">{v}</span>} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-[240px] flex items-center justify-center text-mint-300 text-sm">No data</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <TransactionHistory transactions={transactions} onClear={clearTransactions} />
                        )}

                        <p className="text-xs text-mint-400 text-center pb-4">
                            Portfolio data is stored locally in your browser. Prices are fetched live. This is not investment advice.
                        </p>
                    </>
                )}
            </div>

            {showBuyModal  && <AddHoldingModal onClose={() => setShowBuyModal(false)} />}
            {sellTarget    && <SellModal holding={sellTarget} onClose={() => setSellTarget(null)} />}
        </div>
    );
};

export default Portfolio;
