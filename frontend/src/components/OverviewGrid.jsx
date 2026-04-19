import React from 'react';

const OverviewGrid = ({ title, data, columns = 2 }) => {
    if (!data) return null;

    const items = Array.isArray(data)
        ? data
        : Object.entries(data).map(([label, value]) => ({ label, value }));

    return (
        <div className="bg-white rounded-[14px] shadow-sm border border-mint-100 overflow-hidden">
            <h3
                className="px-4 py-3 text-sm font-bold text-white border-b border-mint-500"
                style={{
                    background: 'linear-gradient(90deg, #2D8C7A 0%, #4ECDA4 100%)',
                    fontFamily: 'Syne, sans-serif',
                }}
            >
                {title}
            </h3>
            <div className={`grid grid-cols-1 md:grid-cols-${columns} divide-y md:divide-y-0 md:gap-px bg-mint-100`}>
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center bg-white p-3 hover:bg-mint-50 transition-colors"
                    >
                        <span className="text-sm text-mint-500 font-medium">{item.label}</span>
                        <span className="text-sm font-semibold text-mint-900">{item.value || '—'}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OverviewGrid;
