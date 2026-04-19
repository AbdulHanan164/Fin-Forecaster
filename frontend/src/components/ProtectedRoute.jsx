import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-mint-100 border-t-mint-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-4 relative overflow-hidden">
                {/* Background blurred representation */}
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
                     style={{ background: 'repeating-linear-gradient(45deg, #1F5148, #1F5148 10px, transparent 10px, transparent 20px)' }}>
                </div>
                
                <div className="bg-white/95 backdrop-blur-sm border border-mint-100 shadow-mint-lg p-10 max-w-lg w-full text-center relative z-10 animate-fade-in" style={{ borderRadius: '24px' }}>
                    
                    <div className="w-20 h-20 bg-mint-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-mint-100">
                        <svg className="w-10 h-10 text-mint-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-extrabold text-mint-900 mb-3 tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
                        Authentication Required
                    </h2>
                    
                    <p className="text-mint-600 mb-8 max-w-sm mx-auto leading-relaxed">
                        Secure access to financial data, live portfolio features, and industry analytics is restricted to verified users. Please log in or verify your email to continue.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
                        <Link to="/login" className="btn-primary w-full sm:w-auto px-8 py-3 text-sm flex-1">
                            Log In
                        </Link>
                        <Link to="/signup" className="btn-secondary w-full sm:w-auto px-8 py-3 text-sm flex-1">
                            Sign Up
                        </Link>
                    </div>

                    <div className="pt-4 border-t border-mint-100">
                        <button 
                            onClick={useAuth().loginAsDemo}
                            className="text-sm font-bold text-mint-500 hover:text-emerald-600 transition-colors"
                        >
                            Or continue as Demo User &rarr;
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
