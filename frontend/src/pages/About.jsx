import React from 'react';
import { Link } from 'react-router-dom';

// ─── Section wrapper ──────────────────────────────────────────────────────────
const InfoSection = ({ icon, title, iconBg = 'bg-mint-100', iconColor = 'text-mint-700', children }) => (
    <div className="card animate-slide-up bg-white rounded-2xl shadow-mint-lg border border-mint-100 p-8 mb-6 transition-transform hover:-translate-y-1">
        <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center ${iconColor} flex-shrink-0 shadow-sm border border-mint-50`}>
                {icon}
            </div>
            <h2 className="text-xl font-bold text-mint-900 tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
                {title}
            </h2>
        </div>
        <div className="text-mint-600 leading-relaxed space-y-4">
            {children}
        </div>
    </div>
);

const About = () => {
    return (
        <div className="min-h-screen bg-mint-50">

            {/* Page Header */}
            <div
                className="border-b border-mint-200 shadow-sm relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #1A3D36 0%, #2D8C7A 100%)' }}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                     style={{ background: 'repeating-linear-gradient(45deg, #1F5148, #1F5148 10px, transparent 10px, transparent 20px)' }}>
                </div>
                
                <div className="container mx-auto px-4 py-16 relative z-10 text-center">
                    <h1
                        className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 animate-fade-in"
                        style={{ fontFamily: 'Syne, sans-serif' }}
                    >
                        About FinForecaster Analytics
                    </h1>
                    <p className="text-mint-100 text-lg sm:text-xl max-w-2xl mx-auto font-medium animate-slide-up">
                        Empowering investors with institutional-grade insights, comprehensive market analytics, and intelligent portfolio tracking.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-4xl">

                <div className="grid gap-8">
                    {/* The Vision */}
                    <InfoSection
                        title="Our Vision"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        }
                    >
                        <p>
                            FinForecaster Analytics was founded on a simple premise: professional-grade financial intelligence should be accessible to everyone. Historically, the tools required to deeply analyze corporate financial health, manage portfolios in real-time, and track broader market movements have been locked behind complex platforms and institutional subscriptions. 
                        </p>
                        <p>
                            We aim to democratize the financial markets. By transforming opaque financial statements into clear, actionable insights, we help retail investors, students, and financial analysts make informed, data-driven decisions with confidence.
                        </p>
                    </InfoSection>

                    {/* What We Provide */}
                    <InfoSection
                        title="Comprehensive Market Intelligence"
                        iconBg="bg-emerald-50"
                        iconColor="text-emerald-700"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        }
                    >
                        <p>
                            Our platform is a centralized hub for all your investment research needs. We aggregate vast amounts of corporate data and present it through beautifully organized, intuitive interfaces. 
                        </p>
                        <ul className="grid sm:grid-cols-2 gap-4 mt-4 text-mint-700 font-medium tracking-wide">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Complete Financial Statements
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Live Pricing & Quotes
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                In-depth Valuation Ratios
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Interactive Performance Charts
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Real-time Sector Tracking
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                AI-Powered News Summaries
                            </li>
                        </ul>
                    </InfoSection>

                    {/* Portfolio Management */}
                    <InfoSection
                        title="Intelligent Portfolio Tracking"
                        iconBg="bg-teal-50"
                        iconColor="text-teal-700"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        }
                    >
                        <p>
                            We go beyond static data entirely. The FinForecaster Portfolio suite allows investors to actively track their personal holdings in a simulated live environment.
                        </p>
                        <p>
                            Log custom buy and sell transactions securely, monitor your sector allocation through dynamic visualization, and watch your unrealized and realized profit boundaries shift seamlessly in accordance with live market rates.
                        </p>
                    </InfoSection>
                    
                </div>

                <div className="text-center pt-8">
                    <Link to="/signup" className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-sm tracking-wide shadow-md hover:-translate-y-0.5 transition-transform">
                        Create Your Free Account
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>

            </div>

            {/* Clean Professional Footer */}
            <footer className="bg-white border-t border-mint-100 mt-12">
                <div className="container mx-auto px-4 py-8 text-center flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm font-bold text-mint-900 tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
                        FinForecaster<span className="text-mint-500">.pk</span>
                    </p>
                    <p className="text-xs text-mint-400 font-medium">
                        &copy; {new Date().getFullYear()} FinForecaster Analytics. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default About;
