import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PortfolioProvider } from './context/PortfolioContext';
import SearchBar from './components/SearchBar';
import CompanyLayout from './components/CompanyLayout';
import CompanyOverview from './pages/CompanyOverview';
import IncomeStatement from './pages/IncomeStatement';
import BalanceSheet from './pages/BalanceSheet';
import CashFlow from './pages/CashFlow';
import Ratios from './pages/Ratios';
import News from './pages/News';
import IndustryOverview from './pages/IndustryOverview';
import Home from './pages/Home';
import About from './pages/About';
import Portfolio from './pages/Portfolio';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ErrorBoundary from './components/ErrorBoundary';

// ─── Brand Logo SVG (matches FinForecaster Analytics logo style) ──────────────
const BrandLogo = ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="#2D8C7A" />
        <rect x="9" y="26" width="4" height="8" rx="1" fill="white" opacity="0.7" />
        <rect x="15" y="20" width="4" height="14" rx="1" fill="white" opacity="0.85" />
        <rect x="21" y="14" width="4" height="20" rx="1" fill="white" />
        <polyline points="10,22 16,16 22,18 31,10" stroke="#4ECDA4" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <polyline points="27,10 31,10 31,14" stroke="#4ECDA4" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
);

// ─── Navbar ──────────────────────────────────────────────────────────────────
const Navbar = () => {
    const { user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = [
        { to: '/', label: 'Home', exact: true },
        { to: '/company/1/overview', label: 'Companies' },
        { to: '/industry-overview', label: 'Industry' },
        { to: '/portfolio', label: 'Portfolio' },
        { to: '/about', label: 'About' },
    ];

    return (
        <nav className="bg-white border-b border-mint-100 sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="h-16 flex items-center justify-between gap-4">

                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2.5 flex-shrink-0 group"
                    >
                        <BrandLogo size={34} />
                        <div className="flex flex-col leading-tight">
                            <span
                                className="text-base font-bold text-mint-900 tracking-tight"
                                style={{ fontFamily: 'Syne, sans-serif' }}
                            >
                                FinForecaster
                                <span className="text-mint-600">.pk</span>
                            </span>
                            <span className="text-[9px] font-medium text-mint-500 uppercase tracking-widest hidden sm:block">
                                Analytics
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-0.5">
                        {navItems.map(item => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.exact}
                                className={({ isActive }) =>
                                    isActive ? 'nav-link-active' : 'nav-link'
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Search + Auth */}
                    <div className="flex items-center gap-3 flex-1 justify-end max-w-sm md:max-w-xs lg:max-w-sm">
                        <div className="flex-1 min-w-0">
                            <SearchBar placeholder="Search company or symbol..." />
                        </div>

                        {/* Auth Buttons */}
                        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                            {user ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-mint-100 rounded-full flex items-center justify-center border border-mint-200">
                                        <span className="text-xs font-bold text-mint-700">
                                            {user.name?.charAt(0)?.toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-sm text-mint-700 font-medium max-w-[80px] truncate hidden lg:block"
                                        style={{ fontFamily: 'Syne, sans-serif' }}>
                                        {user.name.split(' ')[0]}
                                    </span>
                                    <button
                                        onClick={logout}
                                        className="text-sm text-mint-500 hover:text-red-600 px-2 py-1 rounded-lg transition-colors"
                                        title="Log out"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Link to="/login" className="btn-secondary text-xs py-1.5 px-3">
                                        Log In
                                    </Link>
                                    <Link to="/signup" className="btn-primary text-xs py-1.5 px-3">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        className="md:hidden p-2 text-mint-600 hover:text-mint-900 rounded-lg hover:bg-mint-50"
                        onClick={() => setMobileOpen(o => !o)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden border-t border-mint-100 py-3 space-y-1 pb-4 animate-slide-up">
                        {navItems.map(item => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.exact}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded-lg text-sm font-medium ${
                                        isActive
                                            ? 'text-mint-700 bg-mint-100'
                                            : 'text-mint-700 hover:text-mint-900 hover:bg-mint-50'
                                    }`
                                }
                                style={{ fontFamily: 'Syne, sans-serif' }}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                        <div className="border-t border-mint-100 pt-3 mt-2 flex gap-2 px-3">
                            {user ? (
                                <button onClick={() => { logout(); setMobileOpen(false); }}
                                    className="text-sm text-red-600 font-medium">
                                    Log Out ({user.name.split(' ')[0]})
                                </button>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setMobileOpen(false)}
                                        className="btn-secondary text-sm py-2">Log In</Link>
                                    <Link to="/signup" onClick={() => setMobileOpen(false)}
                                        className="btn-primary text-sm py-2">Sign Up</Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

// ─── App Shell ────────────────────────────────────────────────────────────────
const AppShell = () => (
    <div className="min-h-screen bg-mint-50 text-mint-900 font-sans">
        <Navbar />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/disclaimer" element={<Navigate to="/about" replace />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/industry-overview" element={<ErrorBoundary><IndustryOverview /></ErrorBoundary>} />

            <Route path="/company/:companyId" element={<CompanyLayout />}>
                <Route path="overview" element={<ErrorBoundary><CompanyOverview /></ErrorBoundary>} />
                <Route path="income-statement" element={<ErrorBoundary><IncomeStatement /></ErrorBoundary>} />
                <Route path="balance-sheet" element={<ErrorBoundary><BalanceSheet /></ErrorBoundary>} />
                <Route path="cash-flow" element={<ErrorBoundary><CashFlow /></ErrorBoundary>} />
                <Route path="ratios" element={<ErrorBoundary><Ratios /></ErrorBoundary>} />
                <Route path="news" element={<ErrorBoundary><News /></ErrorBoundary>} />
                <Route index element={<Navigate to="overview" replace />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </div>
);

// ─── Root ─────────────────────────────────────────────────────────────────────
function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <PortfolioProvider>
                    <AppShell />
                </PortfolioProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
