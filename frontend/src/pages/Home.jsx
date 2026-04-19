import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        title: 'Financial Statements',
        desc: 'Complete income statements, balance sheets, and cash flow reports for 360+ PSX-listed companies with annual and quarterly views.',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
        ),
        title: 'Real-Time Stock Quotes',
        desc: 'Live price data, day ranges, volume, and price change percentages sourced directly from the Pakistan Stock Exchange.',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
        title: 'Industry Analysis',
        desc: 'Compare sectors side by side. View aggregated market data and industry-wide performance metrics for informed decision-making.',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
        ),
        title: 'Key Financial Ratios',
        desc: 'Valuation, profitability, liquidity, and solvency ratios — all in one place to support faster, more confident analysis.',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        ),
        title: 'Company Announcements',
        desc: 'Stay current with the latest regulatory announcements and company disclosures from the Pakistan Stock Exchange portal.',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        ),
        title: 'Portfolio Tracker',
        desc: 'Track your holdings, monitor real-time P&L, and analyze your portfolio composition with live price updates.',
    },
];

const stats = [
    { label: 'Coverage',         value: '360+ Companies' },
    { label: 'Market Segments',  value: 'All Major Sectors' },
];

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-mint-50">

            {/* Hero */}
            <section
                className="relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #1A3D36 0%, #2D8C7A 55%, #4ECDA4 100%)' }}
            >
                {/* Decorative grid overlay */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />

                <div className="relative container mx-auto px-4 py-24 text-center">
                    <span
                        className="inline-block bg-white/15 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/25 backdrop-blur-sm animate-fade-in"
                        style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '0.05em' }}
                    >
                        Pakistan Stock Exchange · 360+ Companies
                    </span>

                    <h1
                        className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-5 text-white animate-slide-up"
                        style={{ fontFamily: 'Syne, sans-serif' }}
                    >
                        Pakistan's Premier<br />
                        <span style={{ color: '#A7F0D8' }}>Stock Analysis Platform</span>
                    </h1>

                    <p className="text-mint-100 text-lg max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up-delay-1">
                        Institutional-grade financial analysis, real-time market data, and interactive
                        charts for every company listed on the Pakistan Stock Exchange — all in one place.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slide-up-delay-2">
                        <Link
                            to="/company/1/overview"
                            className="bg-white text-mint-800 hover:bg-mint-50 font-bold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                            style={{ fontFamily: 'Syne, sans-serif' }}
                        >
                            Explore Companies
                        </Link>
                        {!user && (
                            <Link
                                to="/signup"
                                className="bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-200"
                                style={{ fontFamily: 'Syne, sans-serif' }}
                            >
                                Create Free Account
                            </Link>
                        )}
                        {user && (
                            <Link
                                to="/portfolio"
                                className="bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-200"
                                style={{ fontFamily: 'Syne, sans-serif' }}
                            >
                                My Portfolio
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-white border-b border-mint-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-mint-100">
                        {stats.map((s, i) => (
                            <div key={s.label} className={`flex flex-col items-center py-8 px-4 animate-slide-up-delay-${Math.min(i + 1, 3)}`}>
                                <span
                                    className="text-3xl font-extrabold text-mint-600"
                                    style={{ fontFamily: 'Syne, sans-serif' }}
                                >
                                    {s.value}
                                </span>
                                <span className="text-sm text-mint-500 mt-1 font-medium">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2
                        className="text-2xl md:text-3xl font-bold text-mint-900 mb-3"
                        style={{ fontFamily: 'Syne, sans-serif' }}
                    >
                        Everything You Need to Analyze PSX
                    </h2>
                    <p className="text-mint-600 max-w-xl mx-auto">
                        Comprehensive tools designed to give you a clear, data-driven view of the Pakistani equity market.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((f, i) => (
                        <div
                            key={f.title}
                            className="card-hover cursor-default"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            <div className="w-11 h-11 bg-mint-100 rounded-xl flex items-center justify-center text-mint-700 mb-4">
                                {f.icon}
                            </div>
                            <h3
                                className="font-bold text-mint-900 mb-2"
                                style={{ fontFamily: 'Syne, sans-serif' }}
                            >
                                {f.title}
                            </h3>
                            <p className="text-sm text-mint-600 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            {!user && (
                <section style={{ background: 'linear-gradient(135deg, #1A3D36 0%, #2D8C7A 100%)' }}>
                    <div className="container mx-auto px-4 py-16 text-center">
                        <h2
                            className="text-2xl md:text-3xl font-bold text-white mb-3"
                            style={{ fontFamily: 'Syne, sans-serif' }}
                        >
                            Start Analyzing Today
                        </h2>
                        <p className="text-mint-200 mb-8 max-w-lg mx-auto">
                            Create a free account to track your portfolio and get the most out of FinForecaster Analytics.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                to="/signup"
                                className="bg-white text-mint-800 hover:bg-mint-50 font-bold px-7 py-3 rounded-xl transition-colors"
                                style={{ fontFamily: 'Syne, sans-serif' }}
                            >
                                Sign Up Free
                            </Link>
                            <Link
                                to="/login"
                                className="border border-white/40 hover:bg-white/10 text-white font-bold px-7 py-3 rounded-xl transition-colors"
                                style={{ fontFamily: 'Syne, sans-serif' }}
                            >
                                Log In
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="bg-white border-t border-mint-100">
                <div className="container mx-auto px-4 py-8 text-center space-y-2">
                    <p className="text-xs text-mint-400">
                        Financial data provided for educational and research purposes.
                        FinForecaster Analytics is an independent tool. Not affiliated with any stock exchange or brokerage.
                        &copy; {new Date().getFullYear()} FinForecaster Analytics.
                    </p>
                    <p className="text-xs text-mint-400">
                        <strong className="font-semibold text-mint-500">Educational Disclaimer:</strong>{' '}
                        This platform is for educational purposes only and does not constitute investment advice.
                        Always conduct independent research before making financial decisions.{' '}
                        <Link to="/about#disclaimer" className="underline hover:text-mint-600 transition-colors">
                            Read full disclaimer
                        </Link>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
