import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API_URL = 'http://localhost:8000/api/auth';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Hydrate from localStorage
        const storedUser = localStorage.getItem('ff_user');
        const token = localStorage.getItem('ff_token');
        if (storedUser && token) {
            try {
                setUser(JSON.parse(storedUser));
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } catch {
                localStorage.removeItem('ff_user');
                localStorage.removeItem('ff_token');
            }
        }
        setLoading(false);
    }, []);

    const setSession = (userData, token) => {
        if (userData && token) {
            localStorage.setItem('ff_user', JSON.stringify(userData));
            localStorage.setItem('ff_token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(userData);
        } else {
            localStorage.removeItem('ff_user');
            localStorage.removeItem('ff_token');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
        }
    };

    const registerRequest = async (name, email, password) => {
        const response = await axios.post(`${API_URL}/register`, { name, email, password });
        return response.data;
    };

    const verifyOtp = async (email, otp) => {
        const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
        setSession(response.data.user, response.data.access_token);
        return response.data.user;
    };

    const login = async (email, password) => {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        setSession(response.data.user, response.data.access_token);
        return response.data.user;
    };

    const forgotPassword = async (email) => {
        const response = await axios.post(`${API_URL}/forgot-password`, { email });
        return response.data;
    };

    const resetPassword = async (email, otp, newPassword) => {
        const response = await axios.post(`${API_URL}/reset-password`, { email, otp, new_password: newPassword });
        setSession(response.data.user, response.data.access_token);
        return response.data.user;
    };

    const loginAsDemo = () => {
        const demoUser = { id: 'demo_999', name: 'Demo User', email: 'demo@finforecaster.pk' };
        setSession(demoUser, 'demo_mock_token_12345');
        return demoUser;
    };

    const logout = () => {
        setSession(null, null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            loginAsDemo,
            logout,
            verifyOtp,
            registerRequest,
            forgotPassword,
            resetPassword
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
