import React, { useEffect, useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getCashFlow } from '../api';
import DataTable from '../components/DataTable';
import { ComparisonChart, TrendChart, BasicPieChart } from '../components/FinancialCharts';
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
const CashFlow = () => {
    const { companyId } = useOutletContext();
    const [period, setPeriod] = useState('annual');

    // Raw API response — fetched ONCE per companyId
    const [rawData, setRawData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [availablePeriods, setAvailablePeriods] = useState({ annual: false, quarter: false });

    // Derived display state
    const [data, setData] = useState(null);

    // ── Fetch once per companyId ──────────────────────────────────────────────
    useEffect(() => {
        if (!companyId) return;
        setLoading(true);
        setRawData(null);
        getCashFlow(companyId)
            .then(res => {
                setRawData(res);
                setAvailablePeriods({
                    annual: hasItems(res.indirect) || hasItems(res.annual),
                    quarter: hasItems(res.quarter),
                });
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [companyId]);

    // ── Derive display data from raw + period (no re-fetch) ───────────────────
    useEffect(() => {
        if (!rawData) return;

        let sel = period;
        const annualExists  = hasItems(rawData.indirect) || hasItems(rawData.annual);
        const quarterExists = hasItems(rawData.quarter);
        if (sel === 'annual' && !annualExists && quarterExists)  sel = 'quarter';
        if (sel === 'quarter' && !quarterExists && annualExists) sel = 'annual';
        if (sel !== period) setPeriod(sel);

        setData(flattenData(sel === 'annual'
            ? (rawData.indirect || rawData.annual)
            : (rawData.quarter  || rawData.indirect)));
    }, [rawData, period]);

    // ── Charts ─────────────────────────────────────────────────────────────────
    const chartData = useMemo(() => {
        if (!data) return null;
        const findRow = (label) => data.find(d => d.label?.toLowerCase().includes(label.toLowerCase()));
        const ocf     = findRow('Operating Cash Flow') || findRow('Net cash flow from operating activities');
        const icf     = findRow('Investing Cash Flow') || findRow('Net cash flow from investing activities');
        const fcf_act = findRow('Financing Cash Flow') || findRow('Net cash flow from financing activities');
        const capex   = findRow('Net capital expenditure') || findRow('fixed assets');

        if (!ocf) return null;

        return ocf.data.map(d => {
            const y = d.year;
            const v = (row) => {
                const item = row?.data?.find(p => p.year === y);
                return item ? parseFloat(item.value) : 0;
            };
            const o = v(ocf), c = Math.abs(v(capex));
            return {
                year: y,
                ocf: o,
                icf: v(icf),
                fcf_act: v(fcf_act),
                capex: c,
                freeCashFlow: o - c,
            };
        }).sort((a, b) => {
            const ya = a.year.includes('-') ? parseInt(a.year.split('-')[1]) : parseInt(a.year);
            const yb = b.year.includes('-') ? parseInt(b.year.split('-')[1]) : parseInt(b.year);
            return isNaN(ya) || isNaN(yb) ? a.year.localeCompare(b.year) : ya - yb;
        }).slice(-5);
    }, [data]);

    const usageMix = useMemo(() => {
        if (!data || !chartData || chartData.length === 0) return null;
        const ly = chartData[chartData.length - 1].year;
        const fv = (label) => {
            const row = data.find(d => d.label?.toLowerCase().includes(label.toLowerCase()));
            const item = row?.data?.find(p => p.year === ly);
            return item ? Math.abs(parseFloat(item.value)) : 0;
        };
        return [
            { name: 'Capex',        value: fv('fixed assets') || fv('Net capital expenditure') },
            { name: 'Dividends',    value: fv('Dividend paid') },
            { name: 'Debt Repayment', value: fv('Repayment of loans') || fv('Long term loans repaid') },
            { name: 'Investments',  value: fv('Investments purchased') || fv('Short term investments') },
        ].filter(d => d.value > 0);
    }, [data, chartData]);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h2 className="text-xl font-bold text-mint-900" style={{ fontFamily: 'Syne, sans-serif' }}>
                    Cash Flow Statement
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

            {data && <DynamicDataView data={data} title="Cash Flow" defaultChartType="line" />}

            {chartData && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <ComparisonChart
                        title="Cash Flow Components"
                        data={chartData}
                        bars={[
                            { key: 'ocf',     name: 'Operating', color: '#2D8C7A' },
                            { key: 'icf',     name: 'Investing', color: '#f59e0b' },
                            { key: 'fcf_act', name: 'Financing', color: '#4ECDA4' },
                        ]}
                    />
                    <TrendChart
                        title="Free Cash Flow Trend"
                        data={chartData}
                        metrics={[
                            { key: 'freeCashFlow', name: 'Free Cash Flow', color: '#2D8C7A' },
                        ]}
                    />
                    <ComparisonChart
                        title="Capex Coverage (OCF vs Capex)"
                        data={chartData}
                        bars={[{ key: 'ocf',   name: 'Op. Cash Flow', color: '#2D8C7A' }]}
                        lines={[{ key: 'capex', name: 'Capex',         color: '#ef4444' }]}
                    />
                    {usageMix && usageMix.length > 0 && (
                        <BasicPieChart
                            title={`Cash Usage Mix (${chartData[chartData.length - 1].year})`}
                            data={usageMix}
                        />
                    )}
                </div>
            )}

            <DataTable data={data} loading={loading} />
        </div>
    );
};

export default CashFlow;
