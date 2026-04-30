import axios from 'axios';
import { Platform } from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import { showErrorToast } from '@/store/toast-store';
import { AuthResponse } from '@/types/api';

const renderApiBaseUrl = 'https://flat-expense-manager-api.onrender.com';

const fallbackBaseUrl = Platform.select({
  android: 'http://10.0.2.2:3000',
  web: getWebFallbackBaseUrl(),
  default: 'http://localhost:3000',
});

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? fallbackBaseUrl;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let refreshPromise: Promise<string | null> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };

    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    refreshPromise ??= refreshAccessToken().finally(() => {
      refreshPromise = null;
    });

    const newAccessToken = await refreshPromise;

    if (!newAccessToken) {
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

    return api(originalRequest);
  },
);

async function refreshAccessToken() {
  const { refreshToken, setSession, signOut } = useAuthStore.getState();

  if (!refreshToken) {
    await signOut();
    showErrorToast({
      title: 'Signed out',
      message: 'Your session ended. Please sign in again.',
    });
    return null;
  }

  try {
    const { data } = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });

    await setSession(data);

    return data.accessToken;
  } catch {
    await signOut();
    showErrorToast({
      title: 'Signed out',
      message: 'Your session ended. Please sign in again.',
    });
    return null;
  }
}

function getWebFallbackBaseUrl() {
  if (typeof window === 'undefined') {
    return renderApiBaseUrl;
  }

  const isLocalWeb =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  return isLocalWeb ? 'http://localhost:3000' : renderApiBaseUrl;
}
