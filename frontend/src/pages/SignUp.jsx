import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Basic password strength checker
const calculateStrength = (password) => {
    let score = 0;
    if (!password) return { score: 0, label: '', color: 'bg-mint-100' };
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score < 2) return { score, label: 'Weak', color: 'bg-red-400', w: 'w-1/3' };
    if (score < 4) return { score, label: 'Medium', color: 'bg-amber-400', w: 'w-2/3' };
    return { score, label: 'Strong', color: 'bg-emerald-500', w: 'w-full' };
};

const SignUp = () => {
    const { registerRequest, verifyOtp, loginAsDemo } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: Details, 2: OTP
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    
    // UI states
    const [showPassword, setShowPassword] = useState(false);
    
    const strength = calculateStrength(formData.password);

    const handleNext = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (strength.label === 'Weak') {
            setError('Please use a stronger password');
            return;
        }

        setLoading(true);
        try {
            await registerRequest(formData.name, formData.email, formData.password);
            setMessage('A verification code has been sent to your email.');
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Registration failed. Check network connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await verifyOtp(formData.email, otp);
            navigate('/portfolio');
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'OTP verification failed');
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
                
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold text-mint-900 tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
                        Create Account
                    </h1>
                    <p className="text-sm text-mint-500 mt-2">
                        {step === 1 ? 'Start analyzing the market today.' : 'Verify your email address.'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-6 border border-red-100 flex items-start gap-2 animate-slide-up">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}
                
                {message && (
                    <div className="bg-emerald-50 text-emerald-700 text-sm p-3 rounded-xl mb-6 border border-emerald-100 flex items-start gap-2 animate-slide-up">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {message}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleNext} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-mint-700 mb-1.5 ml-1" style={{ fontFamily: 'Syne, sans-serif' }}>Full Name</label>
                            <input 
                                required 
                                type="text"
                                className="input-field" 
                                placeholder="e.g. Ali Khan" 
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
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
                            <label className="block text-sm font-semibold text-mint-700 mb-1.5 ml-1" style={{ fontFamily: 'Syne, sans-serif' }}>Password</label>
                            <div className="relative">
                                <input 
                                    required 
                                    minLength="6"
                                    type={showPassword ? "text" : "password"}
                                    className="input-field pr-10" 
                                    placeholder="At least 6 characters" 
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
                            
                            {/* Password Strength Bar */}
                            {formData.password && (
                                <div className="mt-2 ml-1">
                                    <div className="h-1.5 w-full bg-mint-100 rounded-full overflow-hidden flex">
                                        <div className={`h-full ${strength.color} ${strength.w} transition-all duration-300`}></div>
                                    </div>
                                    <p className={`text-[10px] mt-1 font-semibold ${strength.color.replace('bg-', 'text-')}`}>
                                        Password Strength: {strength.label}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-mint-700 mb-1.5 ml-1 mt-2" style={{ fontFamily: 'Syne, sans-serif' }}>Confirm Password</label>
                            <input 
                                required 
                                minLength="6"
                                type={showPassword ? "text" : "password"}
                                className="input-field" 
                                placeholder="Re-enter password" 
                                value={formData.confirmPassword}
                                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-4 relative overflow-hidden group">
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Sending Code...
                                </span>
                            ) : 'Continue'}
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
                            Already have an account? <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors">Log In</Link>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleVerify} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-mint-700 mb-1.5 ml-1 text-center" style={{ fontFamily: 'Syne, sans-serif' }}>
                                A 6-digit code was sent to <br/><span className="text-emerald-700 font-extrabold">{formData.email}</span>
                            </label>
                            <input 
                                required 
                                type="text"
                                maxLength="6"
                                className="input-field text-center text-2xl tracking-[0.5em] font-extrabold text-mint-900 mt-2" 
                                placeholder="------" 
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                            />
                        </div>

                        <button type="submit" disabled={loading || otp.length < 6} className="btn-primary w-full py-3 mt-6 relative overflow-hidden group">
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Verifying...
                                </span>
                            ) : 'Verify & Create Account'}
                        </button>

                        <p className="text-center text-sm text-mint-500 mt-6 font-medium">
                            <button type="button" onClick={() => setStep(1)} className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors">
                                Change Email Address
                            </button>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SignUp;
