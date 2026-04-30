import { api } from './client';
import { Expense } from '@/types/api';

export async function getExpenses(range: 'today' | 'week' | 'month') {
  const { data } = await api.get<Expense[]>('/expenses', {
    params: { range },
  });
  return data;
}

export async function createExpense(payload: {
  amount: number;
  categoryId: string;
  note?: string;
}) {
  const { data } = await api.post<Expense>('/expenses', payload);
  return data;
}

export async function clearExpenses() {
  const { data } = await api.delete<{ deletedCount: number }>('/expenses');
  return data;
}
