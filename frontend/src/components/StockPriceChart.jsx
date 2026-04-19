import React, { useState, useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { ArrowUp, ArrowDown } from 'lucide-react';

const StockPriceChart = ({ data, chartData, company, quote }) => {
    const [range, setRange] = useState('1Y');

    const processedData = useMemo(() => {
        if (!chartData || !Array.isArray(chartData)) return [];

        // API returns array of objects: { lable: "1M", data: [...] }
        // We find the dataset matching the selected range

        // Map UI range to API label
        const rangeMap = {
            '1D': '1D', // Check if 1D exists, usually it does or is handled differently
            '1M': '1M',
            '3M': '3M',
            '6M': '6M',
            '1Y': '1OC', // API seems to use '1OC' for something? Or maybe '1Y'? 
            // The screenshot showed "1M", I saw "1M" in the tool output. 
            // I should probably just find the one that matches or fallback.
            '3Y': '3Y',
            '5Y': '5Y'
        };

        // Note: The API output showed `lable`. It might be `lable` (typo in API) or `label`.
        // The tool output showed `lable`.

        const targetLabel = rangeMap[range] || range;

        // Find exact match or maybe close match?
        // Let's dump the available labels to console to debug if needed, 
        // but for now let's try to find it.

        // Specific handling for '1Y' -> might be '1Y' or '1 Year'. 
        // I will assume standard keys but allow for '1Y' to match '1Y' or '1 Year'.

        let dataset = chartData.find(d => d.lable === targetLabel || d.label === targetLabel);

        // Fallback: if '1Y' not found, maybe it's under a different name or just default to first one?
        // Actually, let's map '1Y' to '1Y' primarily.

        // If 1D is selected and not available, maybe use the intraday if available? 
        // The user didn't show intraday in the snippet, just 1M.

        if (!dataset && range === '1Y') {
            // Sometimes APIs use '1Y' or 'Yearly'. 
            // Let's look for any label containing '1Y'.
            dataset = chartData.find(d => d.lable?.includes('1Y') || d.label?.includes('1Y'));
        }

        if (!dataset) return [];

        return dataset.data.map(item => ({
            date: item.xx || item.x, // 'xx' seems to be the full date in the snippet
            price: parseFloat(item.y)
        }));
    }, [chartData, range]);

    const change = parseFloat(quote?.change || 0);
    const isPositive = change >= 0;

    // Determine available ranges from data to disable buttons
    const availableRanges = useMemo(() => {
        if (!chartData) return [];
        return chartData.map(d => d.lable || d.label);
    }, [chartData]);

    // Update range if current Selection is not in new data? 
    // Maybe better to keep '1Y' as default and fallback if not found in processedData logic.

    return (
        <div className="card">
            <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                    <h1 className="text-xl font-bold text-slate-900">
                        {company?.name} ({company?.symbol})
                    </h1>
                    <span className="text-sm text-slate-500 font-medium uppercase">{company?.sector}</span>
                </div>
                <div className="text-xs text-slate-400 mb-4">
                    {new Date().toLocaleString()}
                </div>

                <div className="mb-2">
                    <span className="text-sm text-slate-500">Current Price</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-slate-900">
                        {quote?.last_close || "PKR --"}
                    </span>
                    <div className={`flex items-center text-lg font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
                        {quote?.change} {quote?.change_percent}
                    </div>
                </div>
            </div>

            {/* Range Selectors */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {['1D', '1M', '3M', '6M', '1Y', '3Y', '5Y'].map(r => (
                    <button
                        key={r}
                        onClick={() => setRange(r)}
                        // Disable if not in data? Optional.
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${range === r
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        {r}
                    </button>
                ))}
            </div>

            <div className="h-[400px] w-full">
                {processedData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={processedData}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="date"
                                hide
                            // Maybe show some ticks? hide for now to match clean look
                            />
                            <YAxis
                                orientation="right"
                                domain={['auto', 'auto']}
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                                itemStyle={{ color: '#475569' }}
                                formatter={(value) => [`PKR ${value}`, 'Price']}
                                labelFormatter={(label) => `Date: ${label}`}
                            />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorPrice)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-500">
                        No data available for this range
                    </div>
                )}
            </div>
        </div>
    );
};

export default StockPriceChart;
