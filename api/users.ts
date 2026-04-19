import { api } from './client';
import { ManagedUser, RoleName, RoleOption } from '@/types/api';

export async function getUsers() {
  const { data } = await api.get<ManagedUser[]>('/users');
  return data;
}

export async function getRoles() {
  const { data } = await api.get<RoleOption[]>('/users/roles');
  return data;
}

export async function createUser(payload: {
  fullName: string;
  username?: string;
  phone?: string;
  password: string;
  pin?: string;
  roleNames?: RoleName[];
}) {
  const { data } = await api.post<ManagedUser>('/users', payload);
  return data;
}

export async function updateUserRoles(userId: string, roleNames: RoleName[]) {
  const { data } = await api.patch<ManagedUser>(`/users/${userId}/role`, {
    roleNames,
  });
  return data;
}

export async function updateUserStatus(userId: string, isActive: boolean) {
  const { data } = await api.patch<ManagedUser>(`/users/${userId}/status`, {
    isActive,
  });
  return data;
}
