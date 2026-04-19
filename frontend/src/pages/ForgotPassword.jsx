import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
    const { forgotPassword, resetPassword } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            const res = await forgotPassword(email);
            setMessage(res.message);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Failed to request reset');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await resetPassword(email, otp, newPassword);
            navigate('/portfolio');
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Password reset failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white border border-mint-100 rounded-[24px] shadow-mint-lg p-8 animate-fade-in relative z-10">
                
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-extrabold text-mint-900 tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
                        Reset Password
                    </h1>
                    <p className="text-sm text-mint-500 mt-2">
                        {step === 1 ? "Enter your email to receive a reset code." : "Enter the code and your new password."}
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
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-mint-700 mb-1.5 ml-1" style={{ fontFamily: 'Syne, sans-serif' }}>Email Address</label>
                            <input 
                                required 
                                type="email"
                                className="input-field" 
                                placeholder="you@domain.com" 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-6 relative overflow-hidden group">
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Sending Code...
                                </span>
                            ) : 'Send Reset Code'}
                        </button>

                        <p className="text-center text-sm text-mint-500 mt-6 font-medium">
                            Remember your password? <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors">Log In</Link>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleReset} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-mint-700 mb-1.5 ml-1" style={{ fontFamily: 'Syne, sans-serif' }}>
                                6-Digit Email Code
                            </label>
                            <input 
                                required 
                                type="text"
                                maxLength="6"
                                className="input-field text-center text-2xl tracking-[0.5em] font-extrabold text-mint-900" 
                                placeholder="------" 
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-mint-700 mb-1.5 ml-1 mt-4" style={{ fontFamily: 'Syne, sans-serif' }}>New Password</label>
                            <input 
                                required 
                                minLength="6"
                                type="password"
                                className="input-field" 
                                placeholder="At least 6 characters" 
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" disabled={loading || otp.length < 6} className="btn-primary w-full py-3 mt-6 relative overflow-hidden group">
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Resetting...
                                </span>
                            ) : 'Reset Password & Log In'}
                        </button>

                        <p className="text-center text-sm text-mint-500 mt-6 font-medium">
                            <button type="button" onClick={() => setStep(1)} className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors">
                                Back to Email Entry
                            </button>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
