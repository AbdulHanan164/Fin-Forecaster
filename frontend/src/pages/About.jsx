import React from 'react';
import { Link } from 'react-router-dom';

// ─── Section wrapper ──────────────────────────────────────────────────────────
const InfoSection = ({ icon, title, iconBg = 'bg-mint-100', iconColor = 'text-mint-700', children }) => (
    <div className="card animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center ${iconColor} flex-shrink-0`}>
                {icon}
            </div>
            <h2 className="text-xl font-bold text-mint-900" style={{ fontFamily: 'Syne, sans-serif' }}>
                {title}
            </h2>
        </div>
        {children}
    </div>
);

// ─── Disclaimer clause ────────────────────────────────────────────────────────
const DisclaimerClause = ({ title, children }) => (
    <div className="border-b border-mint-100 pb-4 last:border-0 last:pb-0">
        <h3 className="text-sm font-bold text-mint-800 mb-1.5" style={{ fontFamily: 'Syne, sans-serif' }}>
            {title}
        </h3>
        <div className="text-sm text-mint-600 leading-relaxed space-y-1.5">{children}</div>
    </div>
);

const About = () => {
    return (
        <div className="min-h-screen bg-mint-50">

            {/* Page Header */}
            <div
                className="border-b border-mint-200"
                style={{ background: 'linear-gradient(135deg, #1A3D36 0%, #2D8C7A 100%)' }}
            >
                <div className="container mx-auto px-4 py-12">
                    <nav className="flex items-center gap-2 text-sm text-mint-300 mb-5">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-white font-medium">About</span>
                    </nav>
                    <h1
                        className="text-3xl font-extrabold text-white"
                        style={{ fontFamily: 'Syne, sans-serif' }}
                    >
                        About FinForecaster Analytics
                    </h1>
                    <p className="text-mint-200 mt-2 max-w-2xl">
                        A data-driven platform built to make Pakistan Stock Exchange analysis accessible
                        to every investor and researcher.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-4xl space-y-6">

                {/* Mission */}
                <InfoSection
                    title="Our Mission"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                        </svg>
                    }
                >
                    <p className="text-mint-600 leading-relaxed">
                        FinForecaster Analytics was developed as a Final Year Project to democratize financial
                        analysis for Pakistani retail investors. The Pakistan Stock Exchange presents enormous
                        opportunity, yet institutional-grade analytical tools have historically been inaccessible
                        to the broader public. Our goal is to bridge that gap — providing comprehensive data
                        views, ratio analysis, and portfolio tracking to anyone with an internet connection.
                    </p>
                </InfoSection>

                {/* Platform Features */}
                <InfoSection
                    title="What the Platform Provides"
                    iconBg="bg-mint-100"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    }
                >
                    <ul className="space-y-3 text-mint-600">
                        {[
                            'Complete financial statements — Income Statement, Balance Sheet, and Cash Flow with annual and quarterly periods',
                            'Real-time stock quotes including live price, volume, and day range',
                            'Key financial ratios covering valuation, profitability, liquidity, solvency, and growth metrics',
                            'Industry-level overview with sector comparisons and aggregated market data',
                            'Historical pricing data and real-time quotes',
                            'Interactive charting and performance tracking',
                            'Portfolio management — track holdings, compute real-time P&L, and analyze sector allocation',
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                                <svg className="w-4 h-4 text-mint-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </InfoSection>

                {/* Data Source */}
                <InfoSection
                    title="Data Source"
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-700"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                        </svg>
                    }
                >
                    <div className="bg-mint-50 rounded-xl p-4 border border-mint-100">
                        <div className="font-semibold text-mint-900 mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>
                            Financial Data API
                        </div>
                        <p className="text-sm text-mint-600">
                            All financial statements, historical ratios, stock price data, equity statistics,
                            and charting data are sourced via third-party financial data APIs.
                            This includes income statements, balance sheets, cash flow statements, and
                            comprehensive financial ratio time-series for fundamental analysis.
                        </p>
                    </div>
                </InfoSection>

                {/* Tech Stack */}
                <InfoSection
                    title="Built With"
                    iconBg="bg-violet-50"
                    iconColor="text-violet-700"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                    }
                >
                    <div className="flex flex-wrap gap-2">
                        {['React 18', 'Vite', 'Tailwind CSS', 'FastAPI', 'Python 3',
                          'Recharts', 'React Router', 'Docker'].map(tech => (
                            <span key={tech} className="badge-mint">{tech}</span>
                        ))}
                    </div>
                </InfoSection>

                {/* Disclaimer Section */}
                <div id="disclaimer" className="card border-l-4 border-mint-600 animate-slide-up-delay-1">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-mint-900" style={{ fontFamily: 'Syne, sans-serif' }}>
                            Legal Disclaimer
                        </h2>
                    </div>

                    {/* Primary notice */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                        <p className="font-semibold text-amber-900 text-sm mb-1">Educational Purpose Only</p>
                        <p className="text-sm text-amber-800 leading-relaxed">
                            This platform is strictly for <strong>educational and research purposes</strong>. It does not constitute
                            financial or investment advice. Do not rely solely on any data or algorithm presented here.
                            Always conduct your own thorough research before making any investment decisions.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <DisclaimerClause title="Not Investment Advice">
                            <p>
                                All content, data, tools, charts, and analysis provided on this platform are strictly
                                for informational and educational purposes. Nothing here constitutes, or should be
                                construed as, financial advice, investment advice, trading advice, or any other
                                type of professional advice. Always consult a licensed financial advisor before
                                making investment decisions.
                            </p>
                        </DisclaimerClause>

                        <DisclaimerClause title="Algorithm Limitations">
                            <p>
                                FinForecaster Analytics may present algorithmic calculations, forecasts, ratios, or
                                trend analyses generated from historical data and mathematical models.{' '}
                                <strong className="text-mint-800">Past performance is never a guarantee of future results.</strong>{' '}
                                Algorithms have inherent limitations and can produce incorrect outputs. Do not rely
                                on any automated analysis without independently verifying the underlying data.
                            </p>
                        </DisclaimerClause>

                        <DisclaimerClause title="Data Accuracy">
                            <p>
                                While every effort is made to provide accurate and timely information, FinForecaster
                                Analytics makes no warranty — express or implied — regarding the accuracy,
                                completeness, timeliness, or fitness for purpose of any data displayed. We are not 
                                responsible for errors, omissions, or delays in that data.
                            </p>
                        </DisclaimerClause>

                        <DisclaimerClause title="Investment Risk">
                            <p>
                                Investing in securities involves significant risk, including the possible loss of
                                principal. Stock prices can fluctuate based on company performance, market
                                conditions, economic factors, and geopolitical events. Always be fully aware of the 
                                risks before committing capital.
                            </p>
                        </DisclaimerClause>

                        <DisclaimerClause title="No Affiliation">
                            <p>
                                FinForecaster Analytics is an independent academic project. It is not affiliated
                                with, endorsed by, or sponsored by any stock exchange, brokerage, or financial institution.
                            </p>
                        </DisclaimerClause>

                        <DisclaimerClause title="Liability Waiver">
                            <p>
                                By using this platform, you acknowledge and agree that FinForecaster Analytics,
                                its creators, and contributors shall not be held liable for any financial losses,
                                damages, or adverse outcomes resulting from your use of or reliance on information
                                provided herein. Use this platform at your own risk.
                            </p>
                        </DisclaimerClause>
                    </div>
                </div>

                <div className="text-center pt-2">
                    <Link to="/" className="btn-primary inline-flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>

            </div>

            {/* Footer Disclaimer */}
            <footer className="bg-white border-t border-mint-100 mt-8">
                <div className="container mx-auto px-4 py-6 text-center">
                    <p className="text-xs text-mint-400">
                        FinForecaster Analytics — Educational research tool for PSX analysis.
                        Data via AskAnalyst API. Not investment advice.
                        &copy; {new Date().getFullYear()} FinForecaster Analytics. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default About;
