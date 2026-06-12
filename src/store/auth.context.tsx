'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, LoginInput, RegisterInput } from '@/types/auth.types';
import { authService } from '@/lib/services/auth.service';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

type AuthAction =
    | { type: 'LOGIN'; payload: User }
    | { type: 'LOGOUT' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'UPDATE_USER'; payload: User };

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload, isAuthenticated: true, isLoading: false };
        case 'LOGOUT':
            return { ...state, user: null, isAuthenticated: false, isLoading: false };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'UPDATE_USER':
            return { ...state, user: action.payload };
        default:
            return state;
    }
}

interface AuthContextProps extends AuthState {
    login: (data: LoginInput) => Promise<void>;
    register: (data: RegisterInput) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const login = async (data: LoginInput) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await authService.login(data);

            // Persist the real auth state to localStorage so the Axios interceptor can read the token
            if (typeof window !== 'undefined') {
                localStorage.setItem('authState', JSON.stringify({ token: response.token }));
            }

            // Immediately fetch the full user profile since the login endpoint may return partial data
            try {
                const fullUser = await authService.getProfile();
                dispatch({ type: 'LOGIN', payload: fullUser });
            } catch (profileError) {
                console.error('Failed to fetch full profile instantly, using basic login data', profileError);
                dispatch({ type: 'LOGIN', payload: response.user });
            }
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const register = async (data: RegisterInput) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            await authService.register(data);
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const logout = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            await authService.logout();
        } catch (error) {
            console.warn('Logout API failed, continuing local cleanup', error);
        } finally {
            // Destroy any and all locally persisted data to ensure complete wipe on logout
            if (typeof window !== 'undefined') {
                localStorage.removeItem('authState');
                sessionStorage.clear();
            }
            dispatch({ type: 'LOGOUT' });
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            if (typeof window !== 'undefined') {
                const authStateString = localStorage.getItem('authState');
                if (authStateString) {
                    try {
                        const user = await authService.getProfile();
                        dispatch({ type: 'LOGIN', payload: user });
                    } catch (error) {
                        console.error('Error hydrating session on reload', error);
                        // Enforce immediate redirect to login if /users/my fails (e.g. 401)
                        if (typeof window !== 'undefined') {
                            localStorage.removeItem('authState');
                            sessionStorage.clear();
                            dispatch({ type: 'LOGOUT' });
                            if (window.location.pathname !== '/login') {
                                window.location.replace('/login');
                            }
                        }
                    }
                }
            }
            dispatch({ type: 'SET_LOADING', payload: false });
        };

        initAuth();

        const handleUnauthorized = () => {
            console.warn('Unauthorized event received, logging out globally');
            logout();
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('auth:unauthorized', handleUnauthorized);
            return () => {
                window.removeEventListener('auth:unauthorized', handleUnauthorized);
            };
        }
    }, []);

    const updateUser = (user: User) => {
        dispatch({ type: 'UPDATE_USER', payload: user });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
