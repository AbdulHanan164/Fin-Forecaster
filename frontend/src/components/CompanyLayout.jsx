import React, { useState, useEffect } from 'react';
import { Outlet, useParams, useNavigate, NavLink } from 'react-router-dom';
import { getCompanies, getCompanyQuote } from '../api';
import Header from './Header';
import SearchBar from './SearchBar';

const CompanyLayout = () => {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [companyInfo, setCompanyInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCompanies().then(setCompanies).catch(console.error);
    }, []);

    useEffect(() => {
        if (companyId && companies.length) {
            const company = companies.find(c => c.value == companyId);
            if (company) {
                setLoading(true);
                getCompanyQuote(company.symbol)
                    .then(quote => setCompanyInfo({ company, quote }))
                    .catch(console.error)
                    .finally(() => setLoading(false));
            }
        }
    }, [companyId, companies]);

    if (!companyId) {
        return (
            <div className="container mx-auto px-4 py-8 text-mint-500">
                Select a company to begin analysis.
            </div>
        );
    }

    const tabs = [
        { path: 'overview',          label: 'Overview' },
        { path: 'income-statement',  label: 'Income Statement' },
        { path: 'balance-sheet',     label: 'Balance Sheet' },
        { path: 'cash-flow',         label: 'Cash Flow' },
        { path: 'ratios',            label: 'Ratios' },
        { path: 'news',              label: 'Announcements' },
    ];

    return (
        <div className="min-h-screen bg-mint-50">
            {/* Company Selector Bar */}
            <div className="bg-white border-b border-mint-100">
                <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <span className="text-sm font-medium text-mint-500 whitespace-nowrap">
                        Switch Company:
                    </span>
                    <div className="w-full max-w-sm">
                        <SearchBar placeholder="Search any company..." />
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="company-select" className="text-xs text-mint-400 whitespace-nowrap">
                            or select:
                        </label>
                        <select
                            id="company-select"
                            className="bg-white border border-mint-200 rounded-xl px-3 py-1.5 text-sm text-mint-800
                                       focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-mint-500
                                       max-w-[220px]"
                            value={companyId}
                            onChange={e => navigate(`/company/${e.target.value}/overview`)}
                        >
                            {companies.map(c => (
                                <option key={c.value} value={c.value}>
                                    {c.label2} — {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 space-y-5 max-w-7xl">

                {/* Loading Skeleton */}
                {loading && (
                    <div className="card animate-pulse">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 skeleton rounded-xl" />
                            <div className="space-y-2">
                                <div className="skeleton h-5 w-48" />
                                <div className="skeleton h-3 w-32" />
                            </div>
                        </div>
                    </div>
                )}

                {companyInfo && (
                    <>
                        <Header company={companyInfo.company} quote={companyInfo.quote} />

                        {/* Navigation Tabs */}
                        <div className="bg-white border border-mint-100 rounded-[14px] overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <div className="flex min-w-max px-2 py-2 gap-1">
                                    {tabs.map(tab => (
                                        <NavLink
                                            key={tab.path}
                                            to={tab.path}
                                            className={({ isActive }) =>
                                                `px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150 whitespace-nowrap ${
                                                    isActive
                                                        ? 'bg-mint-600 text-white shadow-sm'
                                                        : 'text-mint-600 hover:text-mint-900 hover:bg-mint-50'
                                                }`
                                            }
                                            style={{ fontFamily: 'Syne, sans-serif' }}
                                        >
                                            {tab.label}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Page Content */}
                <Outlet context={{ companyId: parseInt(companyId), companyInfo }} />
            </div>
        </div>
    );
};

export default CompanyLayout;
