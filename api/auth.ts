import { api } from './client';
import { AppUser, AuthResponse } from '@/types/api';

export async function login(payload: {
  identifier: string;
  password?: string;
  pin?: string;
}) {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  return data;
}

export async function getProfile() {
  const { data } = await api.get<AppUser>('/auth/me');
  return data;
}
