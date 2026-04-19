import React from 'react';

const DataTable = ({ title, data, loading }) => {
    if (loading) {
        return (
            <div className="card">
                <div className="animate-pulse space-y-3">
                    <div className="h-5 w-40 skeleton rounded" />
                    <div className="h-px w-full skeleton" />
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-4 skeleton rounded w-full" />
                    ))}
                </div>
            </div>
        );
    }

    if (!data || !data.length) return null;

    // ── Year extraction: scan ALL rows to find a non-empty data array ─────────
    const parseYear = (y) => {
        if (!y) return 0;
        if (typeof y === 'number') return y;
        if (String(y).includes('-')) {
            const parts = String(y).split('-');
            const yr    = parts[parts.length - 1];
            return yr.length === 2 ? 2000 + parseInt(yr) : parseInt(yr);
        }
        return parseInt(y) || 0;
    };

    let years = [];
    for (const item of data) {
        if (Array.isArray(item.data) && item.data.length > 0 && item.data[0]?.year) {
            years = item.data.map(d => d.year).sort((a, b) => parseYear(b) - parseYear(a));
            break;
        }
    }

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="bg-white border border-mint-100 rounded-[14px] overflow-hidden shadow-sm">
            {title && (
                <div className="px-5 py-3.5 border-b border-mint-100 bg-mint-50">
                    <h3 className="text-sm font-bold text-mint-900" style={{ fontFamily: 'Syne, sans-serif' }}>
                        {title}
                    </h3>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                        <tr className="bg-mint-50 border-b border-mint-100">
                            <th className="px-4 py-3 text-xs font-bold text-mint-600 uppercase tracking-wider
                                           sticky left-0 z-10 bg-mint-50 border-r border-mint-100 w-64">
                                Particulars
                            </th>
                            {years.map(year => (
                                <th key={year}
                                    className="px-4 py-3 text-xs font-bold text-mint-600 uppercase tracking-wider
                                               text-right min-w-[110px]">
                                    {year}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, i) => {
                            // Section headers — rows where data is empty / missing
                            const isSectionHeader =
                                item.bold ||
                                item.isHeader ||
                                !Array.isArray(item.data) ||
                                item.data.length === 0 ||
                                !item.data[0]?.year;

                            if (isSectionHeader) {
                                return (
                                    <tr key={i}
                                        className="bg-mint-50 border-b border-mint-100">
                                        <td
                                            colSpan={years.length + 1}
                                            className="px-4 py-2 text-xs font-bold text-mint-700 uppercase
                                                       tracking-wider sticky left-0 z-10 bg-mint-50"
                                            style={{ fontFamily: 'Syne, sans-serif' }}
                                        >
                                            {item.label}
                                        </td>
                                    </tr>
                                );
                            }

                            return (
                                <tr key={i}
                                    className="border-b border-mint-50 hover:bg-mint-50/60 transition-colors">
                                    <td className={`px-4 py-2.5 text-sm sticky left-0 z-10 bg-white
                                                    border-r border-mint-50
                                                    ${item.bold ? 'font-semibold text-mint-900' : 'text-mint-700'}`}>
                                        {item.label}
                                        {item.unit && (
                                            <span className="text-xs text-mint-400 font-normal ml-1.5">
                                                ({item.unit})
                                            </span>
                                        )}
                                    </td>
                                    {years.map(year => {
                                        const point = item.data?.find(d => d.year === year);
                                        const val   = point?.value;
                                        const num   = val !== null && val !== undefined ? parseFloat(val) : NaN;
                                        const isNeg = !isNaN(num) && num < 0;
                                        return (
                                            <td key={year}
                                                className={`px-4 py-2.5 text-sm text-right font-mono tabular-nums
                                                            ${isNeg ? 'text-red-600' : 'text-mint-800'}
                                                            ${item.bold ? 'font-semibold' : ''}`}>
                                                {!isNaN(num)
                                                    ? num.toLocaleString('en-PK')
                                                    : (val ?? <span className="text-mint-200">—</span>)}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;
