import { api } from './client';
import { ReportResponse } from '@/types/api';

export async function getWeeklyReport() {
  const { data } = await api.get<ReportResponse>('/reports/weekly');
  return data;
}

export async function getMonthlyReport() {
  const { data } = await api.get<ReportResponse>('/reports/monthly');
  return data;
}
