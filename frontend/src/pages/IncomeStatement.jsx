import React, { useEffect, useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getIncomeStatement, getCashFlow } from '../api';
import DataTable from '../components/DataTable';
import SankeyChart from '../components/SankeyChart';
import { ComparisonChart, TrendChart, GroupedBarChart, BasicPieChart } from '../components/FinancialCharts';
import DynamicDataView from '../components/DynamicDataView';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const hasItems = (d) => d && Array.isArray(d) && d.length > 0;

const flattenData = (arr) => {
    if (!arr || arr.length === 0) return arr;
    const first = arr[0]?.data?.[0];
    if (first && first.year === undefined) {
        const flat = [];
        arr.forEach(section => {
            flat.push({ label: section.label, data: [], bold: true, isHeader: true });
            if (Array.isArray(section.data)) flat.push(...section.data);
        });
        return flat;
    }
    return arr;
};

// ─── Component ────────────────────────────────────────────────────────────────
const IncomeStatement = () => {
    const { companyId } = useOutletContext();
    const [period, setPeriod] = useState('annual');

    // Raw API response — fetched ONCE per companyId
    const [rawIs, setRawIs] = useState(null);
    const [rawCf, setRawCf] = useState(null);
    const [loading, setLoading] = useState(true);
    const [availablePeriods, setAvailablePeriods] = useState({ annual: false, quarter: false });

    // Derived display state (no API call on period toggle)
    const [data, setData] = useState(null);
    const [cfData, setCfData] = useState(null);

    // ── Fetch once per companyId ──────────────────────────────────────────────
    useEffect(() => {
        if (!companyId) return;
        setLoading(true);
        setRawIs(null);
        setRawCf(null);
        Promise.all([
            getIncomeStatement(companyId),
            getCashFlow(companyId),
        ])
            .then(([isRes, cfRes]) => {
                setRawIs(isRes);
                setRawCf(cfRes);
                setAvailablePeriods({
                    annual: hasItems(isRes.annual),
                    quarter: hasItems(isRes.quarter),
                });
            })
            .catch(err => console.error('IS Fetch Error:', err))
            .finally(() => setLoading(false));
    }, [companyId]);

    // ── Derive display data from raw + period (no re-fetch) ───────────────────
    useEffect(() => {
        if (!rawIs) return;

        // Auto-correct period if selection has no data
        let sel = period;
        if (sel === 'annual' && !hasItems(rawIs.annual) && hasItems(rawIs.quarter)) sel = 'quarter';
        if (sel === 'quarter' && !hasItems(rawIs.quarter) && hasItems(rawIs.annual)) sel = 'annual';
        if (sel !== period) setPeriod(sel);

        setData(flattenData(sel === 'annual' ? rawIs.annual : rawIs.quarter));

        if (rawCf) {
            setCfData(sel === 'annual'
                ? (rawCf.indirect || rawCf.annual)
                : (rawCf.quarter || rawCf.indirect));
        }
    }, [rawIs, rawCf, period]);

    // ── Charts ─────────────────────────────────────────────────────────────────
    const chartData = useMemo(() => {
        if (!data) return null;
        const findRow = (st, label) => st?.find(d => d.label?.toLowerCase().includes(label.toLowerCase()));

        const rev = findRow(data, 'Net sales') || findRow(data, 'Revenue');
        const cos = findRow(data, 'Cost of sales');
        const gp  = findRow(data, 'Gross Profit');
        const op  = findRow(data, 'Operating Profit');
        const ni  = findRow(data, 'Profit after tax') || findRow(data, 'Net Income');
        const ocf = findRow(cfData, 'Operating Cash Flow') || findRow(cfData, 'Net cash flow from operating activities');

        if (!rev) return null;

        return rev.data.map(d => {
            const y = d.year;
            const v = (row) => {
                const item = row?.data?.find(p => p.year === y);
                return item ? parseFloat(item.value) : 0;
            };
            const r = v(rev), n = v(ni), g = v(gp), o = v(op), c = v(cos);
            return {
                year: y,
                revenue: r,
                costOfSales: Math.abs(c),
                grossProfit: g,
                netIncome: n,
                ocf: v(ocf),
                grossMargin:     r > 0 ? (g / r) * 100 : 0,
                operatingMargin: r > 0 ? (o / r) * 100 : 0,
                netMargin:       r > 0 ? (n / r) * 100 : 0,
            };
        }).sort((a, b) => {
            const ya = a.year.includes('-') ? parseInt(a.year.split('-')[1]) : parseInt(a.year);
            const yb = b.year.includes('-') ? parseInt(b.year.split('-')[1]) : parseInt(b.year);
            return isNaN(ya) || isNaN(yb) ? a.year.localeCompare(b.year) : ya - yb;
        }).slice(-5);
    }, [data, cfData]);

    const pieData = useMemo(() => {
        if (!data || !chartData || chartData.length === 0) return null;
        const latestYear = chartData[chartData.length - 1].year;
        const findVal = (label) => {
            const row = data.find(d => d.label?.toLowerCase().includes(label.toLowerCase()));
            const item = row?.data?.find(p => p.year === latestYear);
            return item ? Math.abs(parseFloat(item.value)) : 0;
        };
        return [
            { name: 'Admin',        value: findVal('Administrative') },
            { name: 'Distribution', value: findVal('Distribution') || findVal('Selling') },
            { name: 'Finance',      value: findVal('Finance cost') || findVal('Financial charges') },
            { name: 'Tax',          value: findVal('Taxation') },
            { name: 'Other',        value: findVal('Other operating expenses') || findVal('Other expenses') },
        ].filter(d => d.value > 0);
    }, [data, chartData]);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h2 className="text-xl font-bold text-mint-900" style={{ fontFamily: 'Syne, sans-serif' }}>
                    Income Statement
                    <span className="ml-2 text-sm font-medium text-mint-500">
                        ({period === 'annual' ? 'Annual' : 'Quarterly'})
                    </span>
                </h2>

                {/* Period Toggle */}
                <div className="period-toggle self-start sm:self-auto">
                    <button
                        onClick={() => setPeriod('annual')}
                        disabled={!availablePeriods.annual}
                        className={period === 'annual' ? 'period-btn-active' : 'period-btn'}
                        style={{ opacity: !availablePeriods.annual ? 0.35 : 1,
                                 cursor: !availablePeriods.annual ? 'not-allowed' : 'pointer' }}
                    >
                        Annual
                    </button>
                    <button
                        onClick={() => setPeriod('quarter')}
                        disabled={!availablePeriods.quarter}
                        className={period === 'quarter' ? 'period-btn-active' : 'period-btn'}
                        style={{ opacity: !availablePeriods.quarter ? 0.35 : 1,
                                 cursor: !availablePeriods.quarter ? 'not-allowed' : 'pointer' }}
                    >
                        Quarterly
                    </button>
                </div>
            </div>

            {data && <DynamicDataView data={data} title="Income Statement" defaultChartType="area" />}

            {chartData && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <ComparisonChart
                        title="Revenue vs Net Income"
                        data={chartData}
                        bars={[{ key: 'revenue', name: 'Revenue', color: '#2D8C7A' }]}
                        lines={[{ key: 'netIncome', name: 'Net Income', color: '#4ECDA4' }]}
                    />
                    <TrendChart
                        title="Profitability Margins (%)"
                        data={chartData}
                        unit="%"
                        metrics={[
                            { key: 'grossMargin',     name: 'Gross Margin',     color: '#2DB88E' },
                            { key: 'operatingMargin', name: 'Operating Margin', color: '#256B61' },
                            { key: 'netMargin',       name: 'Net Margin',       color: '#4ECDA4' },
                        ]}
                    />
                    <ComparisonChart
                        title="Earnings Quality (OCF / NI)"
                        data={chartData}
                        bars={[{ key: 'ocf',       name: 'Op. Cash Flow', color: '#2D8C7A' }]}
                        lines={[{ key: 'netIncome', name: 'Net Income',    color: '#ef4444' }]}
                    />
                    <GroupedBarChart
                        title="Revenue vs Costs"
                        data={chartData}
                        bars={[
                            { key: 'revenue',     name: 'Revenue',     color: '#2D8C7A' },
                            { key: 'costOfSales', name: 'Cost of Sales', color: '#ef4444' },
                            { key: 'grossProfit', name: 'Gross Profit', color: '#4ECDA4' },
                        ]}
                    />
                    {pieData && pieData.length > 0 && (
                        <BasicPieChart
                            title={`Expense Mix (${chartData[chartData.length - 1].year})`}
                            data={pieData}
                        />
                    )}
                </div>
            )}

            {data && !loading && <SankeyChart data={data} />}
            <DataTable data={data} loading={loading} />
        </div>
    );
};

export default IncomeStatement;
