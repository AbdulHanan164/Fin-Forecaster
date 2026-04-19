import React from 'react';
import {
    ResponsiveContainer,
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Area,
    AreaChart,
    BarChart,
    Cell,
    PieChart,
    Pie,
    LineChart
} from 'recharts';

const COLORS = {
    revenue: '#2563eb',
    netIncome: '#16a34a',
    expenses: '#dc2626',
    assets: '#2563eb',
    liabilities: '#dc2626',
    equity: '#16a34a',
    ocf: '#16a34a',
    icf: '#d97706',
    fcf: '#7c3aed',
    margin: '#d97706',
    grid: '#f1f5f9',
    text: '#94a3b8',
    pie: ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed', '#0891b2']
};

const formatValue = (val) => {
    if (Math.abs(val) >= 1000) return `${(val / 1000).toFixed(1)}B`;
    return `${val.toFixed(0)}M`;
};

const CustomTooltip = ({ active, payload, label, unit = '' }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-lg">
                <p className="text-slate-700 font-bold text-xs mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-3 text-[11px] py-0.5">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color || entry.payload?.fill }} />
                        <span className="text-slate-500">{entry.name}:</span>
                        <span className="text-slate-900 font-mono font-bold ml-auto">
                            {unit === '%' ? `${entry.value.toFixed(2)}%` : formatValue(entry.value)}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const chartCard = 'card p-6';
const chartTitle = 'text-sm font-bold text-slate-500 mb-5 uppercase tracking-wider';

export const ComparisonChart = ({ data, title, bars = [], lines = [] }) => (
    <div className={chartCard}>
        <h4 className={chartTitle}>{title}</h4>
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                    <XAxis dataKey="year" stroke={COLORS.text} fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke={COLORS.text} fontSize={10} axisLine={false} tickLine={false} tickFormatter={formatValue} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: 20 }} />
                    {bars.map(bar => (
                        <Bar key={bar.key} name={bar.name} dataKey={bar.key} fill={bar.color || COLORS.revenue} radius={[4, 4, 0, 0]} barSize={30} />
                    ))}
                    {lines.map(line => (
                        <Line key={line.key} type="monotone" name={line.name} dataKey={line.key} stroke={line.color || COLORS.netIncome} strokeWidth={3} dot={{ r: 4, fill: line.color || COLORS.netIncome }} />
                    ))}
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export const TrendChart = ({ data, title, metrics = [], unit = '' }) => (
    <div className={chartCard}>
        <h4 className={chartTitle}>{title}</h4>
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                        {metrics.map(m => (
                            <linearGradient key={`grad-${m.key}`} id={`grad-${m.key}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={m.color} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={m.color} stopOpacity={0} />
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                    <XAxis dataKey="year" stroke={COLORS.text} fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke={COLORS.text} fontSize={10} axisLine={false} tickLine={false} tickFormatter={unit === '%' ? (v) => `${v}%` : formatValue} />
                    <Tooltip content={<CustomTooltip unit={unit} />} />
                    <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: 20 }} />
                    {metrics.map(m => (
                        <Area key={m.key} type="monotone" name={m.name} dataKey={m.key} stroke={m.color} fill={`url(#grad-${m.key})`} strokeWidth={2.5} />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export const CompositionChart = ({ data, title, keys = [] }) => (
    <div className={chartCard}>
        <h4 className={chartTitle}>{title}</h4>
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                    <XAxis dataKey="year" stroke={COLORS.text} fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke={COLORS.text} fontSize={10} axisLine={false} tickLine={false} tickFormatter={formatValue} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: 20 }} />
                    {keys.map(k => (
                        <Bar key={k.key} name={k.name} dataKey={k.key} stackId="a" fill={k.color} barSize={40} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export const GroupedBarChart = ({ data, title, bars = [] }) => (
    <div className={chartCard}>
        <h4 className={chartTitle}>{title}</h4>
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                    <XAxis dataKey="year" stroke={COLORS.text} fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke={COLORS.text} fontSize={10} axisLine={false} tickLine={false} tickFormatter={formatValue} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: 20 }} />
                    {bars.map((bar, idx) => (
                        <Bar key={bar.key} name={bar.name} dataKey={bar.key} fill={bar.color || COLORS.pie[idx % COLORS.pie.length]} radius={[4, 4, 0, 0]} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export const BasicPieChart = ({ data, title }) => (
    <div className={chartCard}>
        <h4 className={chartTitle}>{title}</h4>
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS.pie[index % COLORS.pie.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" align="center" iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export const SimpleLineChart = ({ data, title, metrics = [], unit = '' }) => (
    <div className={chartCard}>
        <h4 className={chartTitle}>{title}</h4>
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                    <XAxis dataKey="year" stroke={COLORS.text} fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke={COLORS.text} fontSize={10} axisLine={false} tickLine={false} tickFormatter={unit === '%' ? (v) => `${v}%` : formatValue} />
                    <Tooltip content={<CustomTooltip unit={unit} />} />
                    <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: 20 }} />
                    {metrics.map(m => (
                        <Line key={m.key} type="monotone" name={m.name} dataKey={m.key} stroke={m.color} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
);
