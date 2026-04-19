import React from 'react';

const Header = ({ company, quote }) => {
    if (!company || !quote) return null;

    const change = parseFloat(quote.change);
    const isPositive = !isNaN(change) && change >= 0;
    const isNeutral  = isNaN(change);

    const changeColor = isNeutral ? 'text-mint-500'
        : isPositive ? 'text-emerald-600'
        : 'text-red-600';

    const changeBg = isNeutral ? 'bg-mint-50 border-mint-200'
        : isPositive ? 'bg-emerald-50 border-emerald-200'
        : 'bg-red-50 border-red-200';

    return (
        <div className="bg-white border border-mint-100 rounded-[14px] p-5 shadow-sm animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">

                {/* Company Identity */}
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-mint-50 rounded-xl flex items-center justify-center p-1.5 overflow-hidden border border-mint-100 shadow-sm flex-shrink-0">
                        <img
                            src={company.image}
                            alt={company.symbol}
                            className="max-w-full max-h-full object-contain"
                            onError={e => { e.target.style.display = 'none'; }}
                        />
                    </div>
                    <div>
                        <h1
                            className="text-xl font-bold text-mint-900 leading-snug"
                            style={{ fontFamily: 'Syne, sans-serif' }}
                        >
                            {company.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="badge-mint font-bold">{company.symbol || company.label2}</span>
                            {company.sector && (
                                <span className="text-xs text-mint-500 bg-mint-50 px-2 py-0.5 rounded-full border border-mint-100">
                                    {company.sector}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Price Info */}
                <div className={`flex flex-col items-end border rounded-xl px-5 py-3 ${changeBg}`}>
                    <div className="text-3xl font-extrabold text-mint-900 leading-tight"
                        style={{ fontFamily: 'Syne, sans-serif' }}>
                        {quote.last_close || '—'}
                        <span className="text-base font-normal text-mint-400 ml-1.5">PKR</span>
                    </div>
                    {!isNeutral && (
                        <div className={`flex items-center gap-1.5 font-semibold text-sm mt-0.5 ${changeColor}`}>
                            {isPositive ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                </svg>
                            )}
                            <span>{quote.change}</span>
                            <span>({quote.change_percent})</span>
                        </div>
                    )}
                    {quote.volume && (
                        <div className="text-xs text-mint-400 mt-1">
                            Vol: <span className="font-medium text-mint-600">{quote.volume}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Extra trading stats row */}
            {(quote.open || quote.high || quote.low || quote.day_range) && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-mint-100">
                    {[
                        { label: 'Open',      value: quote.open },
                        { label: 'High',      value: quote.high },
                        { label: 'Low',       value: quote.low },
                        { label: 'Day Range', value: quote.day_range },
                    ].map(({ label, value }) =>
                        value ? (
                            <div key={label} className="text-center">
                                <div className="text-xs text-mint-400 font-medium uppercase tracking-wide">{label}</div>
                                <div className="text-sm font-semibold text-mint-800 mt-0.5">{value}</div>
                            </div>
                        ) : null
                    )}
                </div>
            )}
        </div>
    );
};

export default Header;
