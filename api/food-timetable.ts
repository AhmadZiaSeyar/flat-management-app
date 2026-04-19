import { api } from './client';
import { FoodTimetableDay } from '@/types/api';

export async function getFoodTimetable() {
  const { data } = await api.get<FoodTimetableDay[]>('/food-timetable');
  return data;
}

export async function upsertFoodTimetable(payload: {
  days: Array<{
    dayOfWeek: number;
    breakfast?: string;
    lunch?: string;
    dinner?: string;
    note?: string;
  }>;
}) {
  const { data } = await api.put<FoodTimetableDay[]>('/food-timetable', payload);
  return data;
}
