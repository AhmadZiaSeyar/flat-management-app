import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { AppUser, AuthResponse } from '@/types/api';

const ACCESS_TOKEN_KEY = 'flat-access-token';
const REFRESH_TOKEN_KEY = 'flat-refresh-token';
const USER_KEY = 'flat-user';

async function getStoredItem(key: string) {
  if (Platform.OS === 'web') {
    return typeof window === 'undefined' ? null : window.localStorage.getItem(key);
  }

  return SecureStore.getItemAsync(key);
}

async function setStoredItem(key: string, value: string) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
    }
    return;
  }

  await SecureStore.setItemAsync(key, value);
}

async function deleteStoredItem(key: string) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
    return;
  }

  await SecureStore.deleteItemAsync(key);
}

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AppUser | null;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  setSession: (session: AuthResponse) => Promise<void>;
  updateUser: (user: AppUser) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isHydrated: false,
  hydrate: async () => {
    const [accessToken, refreshToken, userJson] = await Promise.all([
      getStoredItem(ACCESS_TOKEN_KEY),
      getStoredItem(REFRESH_TOKEN_KEY),
      getStoredItem(USER_KEY),
    ]);

    set({
      accessToken,
      refreshToken,
      user: userJson ? (JSON.parse(userJson) as AppUser) : null,
      isHydrated: true,
    });
  },
  setSession: async (session) => {
    await Promise.all([
      setStoredItem(ACCESS_TOKEN_KEY, session.accessToken),
      setStoredItem(REFRESH_TOKEN_KEY, session.refreshToken),
      setStoredItem(USER_KEY, JSON.stringify(session.user)),
    ]);

    set({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      user: session.user,
      isHydrated: true,
    });
  },
  updateUser: async (user) => {
    await setStoredItem(USER_KEY, JSON.stringify(user));
    set({ user });
  },
  signOut: async () => {
    await Promise.all([
      deleteStoredItem(ACCESS_TOKEN_KEY),
      deleteStoredItem(REFRESH_TOKEN_KEY),
      deleteStoredItem(USER_KEY),
    ]);

    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isHydrated: true,
    });
  },
}));
