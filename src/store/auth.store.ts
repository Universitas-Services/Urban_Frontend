'use client';

import { create } from 'zustand';
import type { User, UpdateProfileInput, ChangePasswordInput } from '@/types/auth.types';
import type { LoginInput, RegisterInput } from '@/types/auth.types';
import {
    loginAction,
    logoutAction,
    hasSessionHint,
    ensureSessionAction,
    clearLocalSessionAction,
    enrichSessionRoleAction,
} from '@/lib/auth/auth';
import {
    registerService,
    getProfileService,
    getFullProfileService,
    updateProfileService,
    changePasswordService,
    acceptNewsService,
    deleteAccountService,
} from '@/lib/services/auth.service';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

interface AuthActions {
    initAuth: () => Promise<void>;
    login: (data: LoginInput) => Promise<void>;
    register: (data: RegisterInput) => Promise<{ message: string }>;
    logout: () => Promise<void>;
    updateUser: (user: User) => void;
    updateProfile: (data: UpdateProfileInput) => Promise<User>;
    changePassword: (data: ChangePasswordInput) => Promise<{ message: string }>;
    acceptNews: () => Promise<void>;
    deleteAccount: (password: string) => Promise<void>;
    getFullProfile: () => ReturnType<typeof getFullProfileService>;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    initAuth: async () => {
        set({ isLoading: true });

        const hint = await hasSessionHint();
        if (!hint) {
            set({ user: null, isAuthenticated: false, isLoading: false });
            return;
        }

        try {
            // Renueva access con /auth/refresh si está vencido o por vencer
            const ok = await ensureSessionAction();
            if (!ok) {
                await clearLocalSessionAction();
                set({ user: null, isAuthenticated: false, isLoading: false });
                return;
            }

            const user = await getProfileService();
            if (user.role) {
                await enrichSessionRoleAction({
                    role: user.role,
                    sub: user.id,
                    email: user.email,
                });
            }
            set({ user, isAuthenticated: true, isLoading: false });
        } catch {
            // Último intento: clear local only (no forzar logout remoto si el token ya murió)
            await clearLocalSessionAction();
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },

    login: async (data) => {
        set({ isLoading: true });
        try {
            const result = await loginAction(data);
            if (!result.ok) {
                set({ isLoading: false });
                throw new Error(result.error);
            }
            set({ user: result.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    register: async (data) => {
        set({ isLoading: true });
        try {
            return await registerService(data);
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            await logoutAction();
        } catch {
            // Si el servidor falla, igual limpiamos el estado local
        } finally {
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },

    updateUser: (user) => set({ user }),

    updateProfile: async (data) => {
        const updated = await updateProfileService(data);
        set({ user: updated });
        return updated;
    },

    changePassword: async (data) => {
        return changePasswordService(data);
    },

    acceptNews: async () => {
        await acceptNewsService();
        set((state) => ({
            user: state.user ? { ...state.user, hasUnreadNews: false, latestNews: null } : null,
        }));
    },

    deleteAccount: async (password) => {
        await deleteAccountService(password);
        await logoutAction();
        set({ user: null, isAuthenticated: false });
    },

    getFullProfile: async () => {
        const profile = await getFullProfileService();
        set((state) => ({
            user: state.user
                ? {
                      ...state.user,
                      hasUnreadNews: profile.hasUnreadNews ?? state.user.hasUnreadNews,
                      latestNews: profile.latestNews,
                  }
                : null,
        }));
        return profile;
    },
}));
