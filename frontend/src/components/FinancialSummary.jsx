import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const transformFinancials = (financials) => {
    if (!financials || !Array.isArray(financials)) return [];

    const yearMap = {};

    // Extract keys we want to chart
    const keys = ['EPS', 'DPS', 'BVPS'];

    financials.forEach(metric => {
        if (keys.includes(metric.label)) {
            metric.data.forEach(point => {
                if (!yearMap[point.year]) yearMap[point.year] = { year: point.year };
                yearMap[point.year][metric.label] = parseFloat(point.value);
            });
        }
    });

    return Object.values(yearMap).sort((a, b) => parseInt(a.year) - parseInt(b.year));
};

const FinancialSummary = ({ financials }) => {
    const data = useMemo(() => transformFinancials(financials), [financials]);

    if (!data.length) return <div className="card text-slate-500">No financial data available</div>;

    return (
        <div className="card space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Financial Summary</h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                            itemStyle={{ color: '#475569' }}
                            cursor={{ fill: '#f1f5f9', opacity: 0.8 }}
                        />
                        <Legend />
                        <Bar dataKey="EPS" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="DPS" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="BVPS" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default FinancialSummary;
