import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('ff_user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem('ff_user');
            }
        }
        setLoading(false);
    }, []);

    const signUp = ({ name, email, password }) => {
        // Store registered users list
        const users = JSON.parse(localStorage.getItem('ff_users') || '[]');
        const exists = users.find(u => u.email === email);
        if (exists) {
            throw new Error('An account with this email already exists.');
        }
        const newUser = { id: Date.now(), name, email, createdAt: new Date().toISOString() };
        users.push({ ...newUser, password });
        localStorage.setItem('ff_users', JSON.stringify(users));
        localStorage.setItem('ff_user', JSON.stringify(newUser));
        setUser(newUser);
        return newUser;
    };

    const login = ({ email, password }) => {
        const users = JSON.parse(localStorage.getItem('ff_users') || '[]');
        const match = users.find(u => u.email === email && u.password === password);
        if (!match) {
            throw new Error('Invalid email or password.');
        }
        const { password: _p, ...safeUser } = match;
        localStorage.setItem('ff_user', JSON.stringify(safeUser));
        setUser(safeUser);
        return safeUser;
    };

    const logout = () => {
        localStorage.removeItem('ff_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signUp, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
