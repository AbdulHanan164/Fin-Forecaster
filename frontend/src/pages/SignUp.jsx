import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const InputField = ({ label, id, type = 'text', value, onChange, error, placeholder, autoComplete }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-mint-700 mb-1.5"
            style={{ fontFamily: 'Syne, sans-serif' }}>
            {label}
        </label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete={autoComplete}
            className={`input-field ${error ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`}
        />
        {error && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 9v2m0 4h.01M12 3C6.477 3 2 7.477 2 12s4.477 9 10 9 10-4.477 10-9S17.523 3 12 3z" />
                </svg>
                {error}
            </p>
        )}
    </div>
);

const SignUp = () => {
    const navigate = useNavigate();
    const { signUp } = useAuth();

    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Full name is required.';
        if (!form.email.trim()) e.email = 'Email address is required.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
        if (!form.password) e.password = 'Password is required.';
        else if (form.password.length < 8) e.password = 'Password must be at least 8 characters.';
        if (!form.confirm) e.confirm = 'Please confirm your password.';
        else if (form.confirm !== form.password) e.confirm = 'Passwords do not match.';
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
            await signUp({ name: form.name.trim(), email: form.email.trim(), password: form.password });
            setSuccess(true);
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setServerError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-mint-50 flex items-center justify-center p-4">
                <div className="bg-white border border-mint-100 rounded-2xl shadow-mint p-10 max-w-sm w-full text-center animate-fade-in">
                    <div className="w-16 h-16 bg-mint-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-mint-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-mint-900 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                        Account Created
                    </h2>
                    <p className="text-mint-500 text-sm">
                        Welcome to FinForecaster Analytics. Redirecting to the homepage...
                    </p>
                </div>
            </div>
        );
    }

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
                        Create your account
                    </h1>
                    <p className="text-sm text-mint-500 mb-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-mint-600 hover:text-mint-800 font-semibold transition-colors">
                            Log in
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
                        <InputField
                            label="Full Name"
                            id="name"
                            value={form.name}
                            onChange={set('name')}
                            error={errors.name}
                            placeholder="Muhammad Ali"
                            autoComplete="name"
                        />
                        <InputField
                            label="Email Address"
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={set('email')}
                            error={errors.email}
                            placeholder="you@example.com"
                            autoComplete="email"
                        />
                        <InputField
                            label="Password"
                            id="password"
                            type="password"
                            value={form.password}
                            onChange={set('password')}
                            error={errors.password}
                            placeholder="At least 8 characters"
                            autoComplete="new-password"
                        />
                        <InputField
                            label="Confirm Password"
                            id="confirm"
                            type="password"
                            value={form.confirm}
                            onChange={set('confirm')}
                            error={errors.confirm}
                            placeholder="Re-enter your password"
                            autoComplete="new-password"
                        />

                        <p className="text-xs text-mint-400 leading-relaxed pt-1">
                            By creating an account you acknowledge this platform is for{' '}
                            <Link to="/about#disclaimer" className="text-mint-600 hover:underline">
                                educational use only
                            </Link>{' '}
                            and does not provide investment advice.
                        </p>

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
                                    Creating Account...
                                </>
                            ) : 'Create Account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
