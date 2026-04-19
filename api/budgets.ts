import { api } from './client';
import { BudgetSummary } from '@/types/api';

export async function getCurrentBudget() {
  const { data } = await api.get<BudgetSummary>('/budgets/current');
  return data;
}

export async function upsertCurrentBudget(payload: {
  amount: number;
  month: number;
  year: number;
}) {
  const { data } = await api.put<BudgetSummary>('/budgets/current', payload);
  return data;
}
