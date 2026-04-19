import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const from = location.state?.from?.pathname || '/';

    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

    const validate = () => {
        const e = {};
        if (!form.email.trim()) e.email = 'Email address is required.';
        if (!form.password) e.password = 'Password is required.';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length) return;

        setLoading(true);
        try {
            await login({ email: form.email.trim(), password: form.password });
            navigate(from, { replace: true });
        } catch (err) {
            setServerError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-mint-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-slide-up">

                {/* Brand */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex flex-col items-center gap-1">
                        <svg width="44" height="44" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="20" cy="20" r="20" fill="#2D8C7A" />
                            <rect x="9" y="26" width="4" height="8" rx="1" fill="white" opacity="0.7" />
                            <rect x="15" y="20" width="4" height="14" rx="1" fill="white" opacity="0.85" />
                            <rect x="21" y="14" width="4" height="20" rx="1" fill="white" />
                            <polyline points="10,22 16,16 22,18 31,10" stroke="#4ECDA4" strokeWidth="2.5"
                                strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            <polyline points="27,10 31,10 31,14" stroke="#4ECDA4" strokeWidth="2.5"
                                strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                        <span
                            className="text-2xl font-black text-mint-700 tracking-tight"
                            style={{ fontFamily: 'Syne, sans-serif' }}
                        >
                            FinForecaster<span className="text-mint-400">.pk</span>
                        </span>
                    </Link>
                    <p className="text-mint-500 text-sm mt-1">Pakistan Stock Exchange Analysis Platform</p>
                </div>

                <div className="bg-white border border-mint-100 rounded-2xl shadow-mint p-8">
                    <h1
                        className="text-xl font-bold text-mint-900 mb-1"
                        style={{ fontFamily: 'Syne, sans-serif' }}
                    >
                        Welcome back
                    </h1>
                    <p className="text-sm text-mint-500 mb-6">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-mint-600 hover:text-mint-800 font-semibold transition-colors">
                            Sign up free
                        </Link>
                    </p>

                    {serverError && (
                        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
                            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-mint-700 mb-1.5"
                                style={{ fontFamily: 'Syne, sans-serif' }}>
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={form.email}
                                onChange={set('email')}
                                placeholder="you@example.com"
                                autoComplete="email"
                                className={`input-field ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                            />
                            {errors.email && (
                                <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-mint-700 mb-1.5"
                                style={{ fontFamily: 'Syne, sans-serif' }}>
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={set('password')}
                                    placeholder="Your password"
                                    autoComplete="current-password"
                                    className={`input-field pr-10 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(s => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-mint-400 hover:text-mint-700 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Logging in...
                                </>
                            ) : 'Log In'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-mint-400 mt-5">
                    For educational use only.{' '}
                    <Link to="/about#disclaimer" className="hover:text-mint-600 transition-colors">
                        Read our disclaimer.
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
