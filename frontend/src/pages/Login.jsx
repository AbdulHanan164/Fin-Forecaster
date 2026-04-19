import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { login, loginAsDemo } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(formData.email, formData.password);
            navigate('/portfolio');
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Login failed. Check network connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = () => {
        loginAsDemo();
        navigate('/portfolio');
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white border border-mint-100 rounded-[24px] shadow-mint-lg p-8 animate-fade-in relative z-10">
                
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-mint-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-mint-100">
                        <svg className="w-8 h-8 text-mint-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                    </div>
                    <h1 className="text-3xl font-extrabold text-mint-900 tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
                        Welcome Back
                    </h1>
                    <p className="text-sm text-mint-500 mt-2">
                        Log in to view your portfolio and insights.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-6 border border-red-100 flex items-start gap-2 animate-slide-up">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-mint-700 mb-1.5 ml-1" style={{ fontFamily: 'Syne, sans-serif' }}>Email Address</label>
                        <input 
                            required 
                            type="email"
                            className="input-field" 
                            placeholder="you@domain.com" 
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1.5 ml-1 mr-1">
                            <label className="block text-sm font-semibold text-mint-700" style={{ fontFamily: 'Syne, sans-serif' }}>Password</label>
                            <Link to="/forgot-password" className="text-xs font-bold text-emerald-600 hover:text-emerald-800 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <input 
                                required 
                                type={showPassword ? "text" : "password"}
                                className="input-field pr-10" 
                                placeholder="••••••••" 
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-mint-400 hover:text-mint-600 transition-colors">
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-4 relative overflow-hidden group">
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Logging in...
                            </span>
                        ) : 'Log In'}
                    </button>

                    <div className="pt-4 pb-2 border-t border-mint-100 mt-4 text-center">
                        <button 
                            type="button"
                            onClick={handleDemoLogin}
                            className="text-sm font-bold text-mint-500 hover:text-emerald-600 transition-colors w-full p-2"
                        >
                            Or continue as Demo User &rarr;
                        </button>
                    </div>

                    <p className="text-center text-sm text-mint-500 font-medium">
                        Don't have an account yet? <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors">Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
