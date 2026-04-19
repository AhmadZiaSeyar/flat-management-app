import { FoodTimetableDay } from '@/types/api';

export const FOOD_TIMETABLE_DAYS = [
  { value: 1, shortLabel: 'Mon', longLabel: 'Monday' },
  { value: 2, shortLabel: 'Tue', longLabel: 'Tuesday' },
  { value: 3, shortLabel: 'Wed', longLabel: 'Wednesday' },
  { value: 4, shortLabel: 'Thu', longLabel: 'Thursday' },
  { value: 5, shortLabel: 'Fri', longLabel: 'Friday' },
  { value: 6, shortLabel: 'Sat', longLabel: 'Saturday' },
  { value: 7, shortLabel: 'Sun', longLabel: 'Sunday' },
] as const;

export function buildFoodTimetableDraft(days: FoodTimetableDay[] = []) {
  const dayMap = new Map(days.map((day) => [day.dayOfWeek, day]));

  return FOOD_TIMETABLE_DAYS.map(({ value }) => {
    const day = dayMap.get(value);

    return {
      dayOfWeek: value,
      breakfast: day?.breakfast ?? '',
      lunch: day?.lunch ?? '',
      dinner: day?.dinner ?? '',
      note: day?.note ?? '',
      updatedAt: day?.updatedAt ?? null,
      updatedBy: day?.updatedBy ?? null,
    };
  });
}

export function getFoodDayLabel(dayOfWeek: number, variant: 'short' | 'long' = 'short') {
  const day = FOOD_TIMETABLE_DAYS.find((item) => item.value === dayOfWeek);
  return variant === 'long' ? day?.longLabel ?? 'Day' : day?.shortLabel ?? 'Day';
}

export function getTodayFoodDayOfWeek(referenceDate = new Date()) {
  const day = referenceDate.getDay();
  return day === 0 ? 7 : day;
}
