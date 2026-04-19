import React from 'react';
import { Link } from 'react-router-dom';

const Section = ({ title, children }) => (
    <div className="card">
        <h2 className="text-lg font-bold text-slate-900 mb-3">{title}</h2>
        <div className="text-slate-600 leading-relaxed space-y-2">{children}</div>
    </div>
);

const Disclaimer = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Page Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 py-10">
                    <nav className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                        <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-slate-900 font-medium">Disclaimer</span>
                    </nav>
                    <h1 className="text-3xl font-extrabold text-slate-900">Disclaimer</h1>
                    <p className="text-slate-500 mt-2">Last updated: {new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-3xl space-y-6">

                {/* Primary Banner */}
                <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold text-amber-900 text-lg mb-1">Educational Purpose Only</p>
                            <p className="text-amber-800 leading-relaxed">
                                This website is intended for <strong>educational purposes only</strong> and does
                                not constitute investment advice. Do not blindly trust any algorithm or data
                                presented here. Always conduct your own thorough research before making any
                                investment decisions.
                            </p>
                        </div>
                    </div>
                </div>

                <Section title="Not Investment Advice">
                    <p>
                        All content, data, tools, charts, and analysis provided on FinForecaster.pk are
                        strictly for informational and educational purposes. Nothing on this website constitutes,
                        or should be construed as, financial advice, investment advice, trading advice, or any
                        other type of advice.
                    </p>
                    <p>
                        You should not make any financial decision based solely on information obtained from
                        this platform. Always consult a licensed financial advisor before making investment
                        decisions.
                    </p>
                </Section>

                <Section title="Algorithm Limitations">
                    <p>
                        FinForecaster.pk may present algorithmic calculations, forecasts, ratios, or trend
                        analyses. These are generated from historical data and mathematical models.
                        <strong className="text-slate-900"> Past performance is never a guarantee of future results.</strong>
                    </p>
                    <p>
                        Algorithms and data models have inherent limitations and can produce incorrect outputs.
                        Do not rely on any automated output without independently verifying the underlying data
                        and assumptions.
                    </p>
                </Section>

                <Section title="Data Accuracy">
                    <p>
                        While we strive to provide accurate and timely information, FinForecaster.pk makes
                        no warranty — express or implied — regarding the accuracy, completeness, timeliness, or
                        fitness for a particular purpose of any data displayed.
                    </p>
                    <p>
                        Market data is sourced from third-party financial providers.
                        We are not responsible for errors, omissions, or delays in such data.
                    </p>
                </Section>

                <Section title="Investment Risk">
                    <p>
                        Investing in securities involves significant risk, including the possible loss of
                        principal. Stock prices can go up or down depending on company performance, market
                        conditions, economic factors, geopolitical events, and other unpredictable circumstances.
                    </p>
                    <p>
                        The Pakistan Stock Exchange (PSX) is subject to market volatility. Always be aware
                        of the risks involved before committing any capital.
                    </p>
                </Section>

                <Section title="Conduct Your Own Research">
                    <p>
                        We strongly encourage every user of this platform to:
                    </p>
                    <ul className="list-none space-y-2 mt-2">
                        {[
                            'Read official company filings and reports published by PSX',
                            'Consult multiple data sources and cross-verify information',
                            'Seek advice from a SECP-licensed investment advisor',
                            'Understand the business model and industry of any company before investing',
                            'Never invest money you cannot afford to lose',
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </Section>

                <Section title="No Affiliation">
                    <p>
                        FinForecaster.pk is an independent academic project. It is not affiliated with,
                        endorsed by, or sponsored by any stock exchange or financial institution.
                        or any brokerage or financial institution.
                    </p>
                </Section>

                <Section title="Liability Waiver">
                    <p>
                        By using this website, you acknowledge and agree that FinForecaster.pk, its creators,
                        and its contributors shall not be held liable for any financial losses, damages, or
                        adverse outcomes resulting from your use of or reliance on information provided herein.
                    </p>
                </Section>

                <div className="text-center pt-4">
                    <Link to="/" className="btn-primary inline-flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Disclaimer;
