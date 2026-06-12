import {
    AuthResponse,
    LoginInput,
    RegisterInput,
    User,
    UserProfile,
    UpdateProfileInput,
    ChangePasswordInput,
} from '@/types/auth.types';
import { api } from '@/lib/api/axios.instance';

export const authService = {
    login: async (data: LoginInput): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', data);

        const user = response.data.user;
        const token = response.data.access_token || response.data.token;

        if (user) {
            // Ensure the frontend 'name' property is populated from the backend's 'nombreCompleto' or 'nombre'
            if (!user.name && user.nombreCompleto) {
                user.name = user.nombreCompleto;
            } else if (!user.name && user.nombre) {
                user.name = `${user.nombre} ${user.apellido || ''}`.trim();
            }
        }

        return {
            user,
            token,
        };
    },

    getProfile: async (): Promise<User> => {
        const profileResponse = await api.get('/users/my');
        const data = profileResponse.data;

        let name = data.name || data.nombreCompleto || '';
        if (!name && data.nombre) {
            name = `${data.nombre} ${data.apellido || ''}`.trim();
        }

        return {
            ...data, // Include nombre, apellido, telefono, etc.
            name,
        };
    },

    register: async (data: RegisterInput): Promise<void> => {
        await api.post('/auth/register', data);
    },

    getFullProfile: async (): Promise<UserProfile> => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    confirmEmail: async (token: string): Promise<void> => {
        await api.get(`/auth/confirm-email/${token}`);
    },

    forgotPassword: async (email: string): Promise<void> => {
        await api.post('/auth/forgot-password', { email });
    },

    resetPassword: async (email: string, newPassword: string): Promise<void> => {
        await api.post('/auth/reset-password', { email, newPassword });
    },

    verifyOtp: async (email: string, otp: string): Promise<void> => {
        await api.post('/auth/verify-otp', { email, otp });
    },

    logout: async (): Promise<void> => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            // If it fails (e.g., token already expired), we still want to clear local state.
            console.warn('Logout API failed, continuing local cleanup', error);
        }
    },

    deleteAccount: async (password: string): Promise<void> => {
        await api.delete('/users/me', {
            data: { password },
        });
    },

    updateProfile: async (data: UpdateProfileInput): Promise<User> => {
        const response = await api.patch('/users/profile', data);
        const user = response.data;
        if (user) {
            if (!user.name && user.nombreCompleto) {
                user.name = user.nombreCompleto;
            } else if (!user.name && user.nombre) {
                user.name = `${user.nombre} ${user.apellido || ''}`.trim();
            }
        }
        return user;
    },

    changePassword: async (data: ChangePasswordInput): Promise<void> => {
        await api.post('/users/password/change', data);
    },

    acceptNews: async (): Promise<void> => {
        await api.post('/users/accept-news');
    },
};
