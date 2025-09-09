import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('access_token'));

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access_token');
            const userData = localStorage.getItem('user');

            if (token && userData) {
                setToken(token);
                setUser(JSON.parse(userData));
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const data = await authAPI.login(email, password);

            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user', JSON.stringify({ email }));

            setToken(data.access_token);
            setUser({ email });

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (userData) => {
        try {
            const newUser = await authAPI.register(userData);

            // Автоматически логиним после регистрации
            const loginResult = await login(userData.email, userData.password);

            if (!loginResult.success) {
                return loginResult;
            }

            return { success: true, user: newUser };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!token,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};