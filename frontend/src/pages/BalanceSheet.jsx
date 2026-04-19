import React, { useEffect, useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getBalanceSheet } from '../api';
import DataTable from '../components/DataTable';
import { CompositionChart, TrendChart, ComparisonChart, GroupedBarChart, BasicPieChart } from '../components/FinancialCharts';
import DynamicDataView from '../components/DynamicDataView';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const hasItems = (d) => d && Array.isArray(d) && d.length > 0;

// The balance sheet API returns nested structure:
// [{label:'Current Asset', data:[{label:'Cash', data:[{year,value},...]},...]},...]
// Flatten it so DataTable gets a flat list where section headers have data:[].
const flattenData = (arr) => {
    if (!arr || arr.length === 0) return arr;
    // Detect nesting: first item's first data element has no .year (it's a sub-item row)
    const first = arr[0]?.data?.[0];
    if (first && first.year === undefined) {
        const flat = [];
        arr.forEach(section => {
            flat.push({ label: section.label, data: [], bold: true, isHeader: true });
            if (Array.isArray(section.data)) flat.push(...section.data);
        });
        return flat;
    }
    return arr; // already flat
};

// ─── Component ────────────────────────────────────────────────────────────────
const BalanceSheet = () => {
    const { companyId } = useOutletContext();
    const [period, setPeriod] = useState('annual');

    // Raw API response — fetched ONCE per companyId
    const [rawData, setRawData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [availablePeriods, setAvailablePeriods] = useState({ annual: false, quarter: false });

    // Derived display state
    const [data, setData] = useState(null);
    const [title, setTitle] = useState('Balance Sheet');

    // ── Fetch once per companyId ──────────────────────────────────────────────
    useEffect(() => {
        if (!companyId) return;
        setLoading(true);
        setRawData(null);
        getBalanceSheet(companyId)
            .then(res => {
                setRawData(res);
                setAvailablePeriods({
                    annual: hasItems(res.annual),
                    quarter: hasItems(res.quarter),
                });
            })
            .catch(err => console.error('BS Fetch Error:', err))
            .finally(() => setLoading(false));
    }, [companyId]);

    // ── Derive display data from raw + period (no re-fetch) ───────────────────
    useEffect(() => {
        if (!rawData) return;

        let sel = period;
        if (sel === 'annual' && !hasItems(rawData.annual) && hasItems(rawData.quarter)) sel = 'quarter';
        if (sel === 'quarter' && !hasItems(rawData.quarter) && hasItems(rawData.annual)) sel = 'annual';
        if (sel !== period) setPeriod(sel);

        setData(flattenData(sel === 'annual' ? rawData.annual : rawData.quarter));
        setTitle(sel === 'annual' ? 'Balance Sheet (Annual)' : 'Balance Sheet (Quarterly)');
    }, [rawData, period]);

    // ── Charts ─────────────────────────────────────────────────────────────────
    const chartData = useMemo(() => {
        if (!data) return null;
        const findRow = (label) => data.find(d => d.label?.toLowerCase().includes(label.toLowerCase()));

        const assets    = findRow('Total assets');
        const liabs     = findRow('Total liabilities');
        const equity    = findRow('Total equity');
        const cAssets   = findRow('Total current assets');
        const ncAssets  = findRow('Total non-current assets');
        const cLiab     = findRow('Total current liabilities');
        const ncLiab    = findRow('Total non-current liabilities');
        const cash      = findRow('Cash & bank balances') || findRow('Cash and cash equivalents');
        const ltDebt    = findRow('Long-term debt') || findRow('Long term loans');
        const stDebt    = findRow('Short term borrowings') || findRow('Short term loans');

        if (!assets) return null;

        return assets.data.map(d => {
            const y = d.year;
            const v = (row) => {
                const item = row?.data?.find(p => p.year === y);
                return item ? parseFloat(item.value) : 0;
            };
            return {
                year: y,
                assets: v(assets),
                liabilities: v(liabs),
                equity: v(equity),
                currentAssets: v(cAssets),
                nonCurrentAssets: v(ncAssets),
                currentLiabilities: v(cLiab),
                nonCurrentLiabilities: v(ncLiab),
                cash: v(cash),
                totalDebt: v(ltDebt) + v(stDebt),
            };
        }).sort((a, b) => {
            const ya = a.year.includes('-') ? parseInt(a.year.split('-')[1]) : parseInt(a.year);
            const yb = b.year.includes('-') ? parseInt(b.year.split('-')[1]) : parseInt(b.year);
            return isNaN(ya) || isNaN(yb) ? a.year.localeCompare(b.year) : ya - yb;
        }).slice(-5);
    }, [data]);

    const assetMix = useMemo(() => {
        if (!data || !chartData || chartData.length === 0) return null;
        const ly = chartData[chartData.length - 1].year;
        const fv = (label) => {
            const row = data.find(d => d.label?.toLowerCase().includes(label.toLowerCase()));
            const item = row?.data?.find(p => p.year === ly);
            return item ? Math.abs(parseFloat(item.value)) : 0;
        };
        return [
            { name: 'Cash',        value: fv('Cash & bank balances') || fv('Cash and cash equivalents') },
            { name: 'Receivables', value: fv('Trade debts') || fv('Account receivables') },
            { name: 'Inventory',   value: fv('Stock-in-trade') || fv('Inventory') },
            { name: 'Fixed Assets',value: fv('Property, plant and equipment') },
            { name: 'Investments', value: fv('Long term investments') },
        ].filter(d => d.value > 0);
    }, [data, chartData]);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h2 className="text-xl font-bold text-mint-900" style={{ fontFamily: 'Syne, sans-serif' }}>
                    {title}
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

            {data && <DynamicDataView data={data} title={title} defaultChartType="bar" />}

            {chartData && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <CompositionChart
                        title="Capital Structure"
                        data={chartData}
                        keys={[
                            { key: 'liabilities', name: 'Liabilities', color: '#ef4444' },
                            { key: 'equity',      name: 'Equity',      color: '#2D8C7A' },
                        ]}
                    />
                    <TrendChart
                        title="Asset Composition"
                        data={chartData}
                        metrics={[
                            { key: 'currentAssets',    name: 'Current Assets',     color: '#2D8C7A' },
                            { key: 'nonCurrentAssets', name: 'Non-Current Assets', color: '#4ECDA4' },
                        ]}
                    />
                    <ComparisonChart
                        title="Liquidity Buffer (Cash vs Debt)"
                        data={chartData}
                        bars={[{ key: 'cash',      name: 'Cash',       color: '#2D8C7A' }]}
                        lines={[{ key: 'totalDebt', name: 'Total Debt', color: '#ef4444' }]}
                    />
                    <GroupedBarChart
                        title="Liability Structure"
                        data={chartData}
                        bars={[
                            { key: 'currentLiabilities',    name: 'Current Liab.',     color: '#f59e0b' },
                            { key: 'nonCurrentLiabilities', name: 'Non-Current Liab.', color: '#ef4444' },
                        ]}
                    />
                    {assetMix && assetMix.length > 0 && (
                        <BasicPieChart
                            title={`Asset Mix (${chartData[chartData.length - 1].year})`}
                            data={assetMix}
                        />
                    )}
                </div>
            )}

            <DataTable data={data} loading={loading} />
        </div>
    );
};

export default BalanceSheet;
