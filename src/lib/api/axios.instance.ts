import axios from 'axios';

// Create a configured instance of Axios pointing to the backend API defined in .env
export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Auto-inject the JWT Bearer Token into headers
api.interceptors.request.use(
    (config) => {
        // We only try to access localStorage if we are in the browser (client-side)
        if (typeof window !== 'undefined') {
            const authStateString = localStorage.getItem('authState');
            if (authStateString) {
                try {
                    const authState = JSON.parse(authStateString);
                    if (authState.token) {
                        config.headers.Authorization = `Bearer ${authState.token}`;
                    }
                } catch (error) {
                    console.error('Error parsing token from storage:', error);
                }
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Catch Global Errors like 401 Unauthorized
api.interceptors.response.use(
    (response) => {
        // Any status code within the range 2xx triggers this function
        return response;
    },
    (error) => {
        const originalUrl = error.config?.url || '';
        // Any status codes outside the range 2xx trigger this function
        // If it's a 401 and not an explicit auth action (like login/logout which handle their own 401s), dispatch logout
        if (error.response?.status === 401 && !originalUrl.includes('/auth/')) {
            // A 401 error means the token is expired or invalid.
            console.error('API Unauthorized Error: Forcing logout session wipe.');
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('auth:unauthorized'));
            }
        }

        // Normalize error message for the frontend components
        if (error.response?.data?.message) {
            const apiMessage = Array.isArray(error.response.data.message)
                ? error.response.data.message[0]
                : error.response.data.message;
            error.message = apiMessage;
        } else if (error.response?.data?.error) {
            error.message = error.response.data.error;
        }

        return Promise.reject(error);
    }
);
