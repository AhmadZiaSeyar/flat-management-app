import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useEffect, useState } from 'react';
import { getCurrentBudget, upsertCurrentBudget } from '@/api/budgets';
import { getFoodTimetable, upsertFoodTimetable } from '@/api/food-timetable';
import { getMonthlyReport, getWeeklyReport } from '@/api/reports';
import { AppButton } from '@/components/ui/app-button';
import { AppInput } from '@/components/ui/app-input';
import { ProgressBar } from '@/components/ui/progress-bar';
import { ScreenShell } from '@/components/ui/screen-shell';
import { SectionTitle } from '@/components/ui/section-title';
import { SummaryCard } from '@/components/ui/summary-card';
import { getErrorMessage } from '@/lib/api-error';
import {
  buildFoodTimetableDraft,
  FOOD_TIMETABLE_DAYS,
  getFoodDayLabel,
  getTodayFoodDayOfWeek,
} from '@/lib/food-timetable';
import { formatAmount, formatDateLabel, formatLongDateLabel, formatMonthLabel } from '@/lib/format';
import { useAuthStore } from '@/store/auth-store';
import { showErrorToast, showInfoToast, showSuccessToast } from '@/store/toast-store';
import { FoodTimetableDay } from '@/types/api';

export default function ReportsScreen() {
  const queryClient = useQueryClient();
  const [scope, setScope] = useState<'weekly' | 'monthly'>('weekly');
  const [budgetAmount, setBudgetAmount] = useState('');
  const user = useAuthStore((state) => state.user);
  const canSetBudget = user?.roles.includes('Admin');
  const canViewFoodTimetable = user?.permissions.includes('view_food_timetable');
  const canEditFoodTimetable = user?.roles.includes('Admin');
  const [selectedFoodDay, setSelectedFoodDay] = useState(getTodayFoodDayOfWeek());
  const [foodTimetableDraft, setFoodTimetableDraft] = useState<
    (FoodTimetableDay & { breakfast: string; lunch: string; dinner: string; note: string })[]
  >([]);

  const weeklyReportQuery = useQuery({
    queryKey: ['reports', 'weekly'],
    queryFn: getWeeklyReport,
  });
  const monthlyReportQuery = useQuery({
    queryKey: ['reports', 'monthly'],
    queryFn: getMonthlyReport,
  });
  const budgetQuery = useQuery({
    queryKey: ['budget', 'current'],
    queryFn: getCurrentBudget,
  });
  const foodTimetableQuery = useQuery({
    queryKey: ['food-timetable'],
    queryFn: getFoodTimetable,
    enabled: Boolean(canViewFoodTimetable),
  });

  const report = scope === 'weekly' ? weeklyReportQuery.data : monthlyReportQuery.data;

  useEffect(() => {
    if (budgetQuery.data) {
      setBudgetAmount(
        budgetQuery.data.amount > 0 ? String(Math.round(budgetQuery.data.amount)) : '',
      );
    }
  }, [budgetQuery.data]);

  useEffect(() => {
    if (foodTimetableQuery.data) {
      setFoodTimetableDraft(buildFoodTimetableDraft(foodTimetableQuery.data));
    }
  }, [foodTimetableQuery.data]);

  const budgetMutation = useMutation({
    mutationFn: upsertCurrentBudget,
    onSuccess: async (budget) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['budget'] }),
        queryClient.invalidateQueries({ queryKey: ['reports'] }),
      ]);
      showSuccessToast({
        title: 'Budget updated',
        message: `${formatAmount(budget.amount)} is now set for this month.`,
      });
      setBudgetAmount(String(Math.round(budget.amount)));
    },
    onError: (error) => {
      showErrorToast({
        title: 'Budget not updated',
        message: getErrorMessage(error, 'Try again in a moment.'),
      });
    },
  });

  const foodTimetableMutation = useMutation({
    mutationFn: upsertFoodTimetable,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['food-timetable'] });
      showSuccessToast({
        title: 'Food time table saved',
        message: 'The weekly meal times are updated for everyone.',
      });
    },
    onError: (error) => {
      showErrorToast({
        title: 'Food time table not saved',
        message: getErrorMessage(error, 'Try again in a moment.'),
      });
    },
  });

  const setBudgetQuick = () => {
    const currentAmount = Number(budgetAmount || 0);
    setBudgetAmount(String(currentAmount ? currentAmount + 500 : 5000));
  };

  const saveBudget = () => {
    const parsedAmount = Number(budgetAmount);

    if (!parsedAmount || parsedAmount < 1) {
      showInfoToast({
        title: 'Enter a budget',
        message: 'Add a budget amount before saving.',
      });
      return;
    }

    const now = new Date();

    budgetMutation.mutate({
      amount: parsedAmount,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });
  };

  const selectedFoodPlan =
    foodTimetableDraft.find((day) => day.dayOfWeek === selectedFoodDay) ??
    buildFoodTimetableDraft([]).find((day) => day.dayOfWeek === selectedFoodDay)!;
  const reportTopCategory = report?.byCategory?.[0];

  const updateSelectedFoodField = (
    field: 'breakfast' | 'lunch' | 'dinner' | 'note',
    value: string,
  ) => {
    setFoodTimetableDraft((current) =>
      current.map((day) =>
        day.dayOfWeek === selectedFoodDay
          ? {
              ...day,
              [field]: value,
            }
          : day,
      ),
    );
  };

  const saveFoodTimetable = () => {
    foodTimetableMutation.mutate({
      days: foodTimetableDraft.map((day) => ({
        dayOfWeek: day.dayOfWeek,
        breakfast: day.breakfast.trim() || undefined,
        lunch: day.lunch.trim() || undefined,
        dinner: day.dinner.trim() || undefined,
        note: day.note.trim() || undefined,
      })),
    });
  };

  return (
    <ScreenShell>
      <LinearGradient
        colors={['#72B6FF', '#2563EB', '#132B62']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="overflow-hidden rounded-[38px] p-6 shadow-float">
        <View className="absolute -left-10 top-3 h-28 w-28 rounded-full bg-white/14" />
        <View className="absolute right-3 top-8 h-24 w-24 rounded-full bg-white/10" />
        <View className="absolute -bottom-10 right-16 h-32 w-32 rounded-full bg-white/10" />

        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-xs font-black uppercase tracking-[2px] text-white/74">
              Shared analytics
            </Text>
            <Text className="mt-3 text-[36px] font-black leading-10 text-white">Reports</Text>
            <Text className="mt-2 text-sm font-semibold text-white/72">
              Track the flat together with one calm view.
            </Text>
          </View>
          <View className="h-14 w-14 items-center justify-center rounded-[20px] bg-white/14">
            <Ionicons color="#FFFFFF" name="pie-chart" size={24} />
          </View>
        </View>

        <View className="mt-6 flex-row gap-3">
          <Pressable
            className={`flex-1 rounded-[24px] px-4 py-4 ${
              scope === 'weekly' ? 'bg-white' : 'border border-white/15 bg-white/10'
            }`}
            onPress={() => setScope('weekly')}>
            <Text
              className={`text-center text-base font-black ${
                scope === 'weekly' ? 'text-sky' : 'text-white'
              }`}>
              Week
            </Text>
          </Pressable>
          <Pressable
            className={`flex-1 rounded-[24px] px-4 py-4 ${
              scope === 'monthly' ? 'bg-white' : 'border border-white/15 bg-white/10'
            }`}
            onPress={() => setScope('monthly')}>
            <Text
              className={`text-center text-base font-black ${
                scope === 'monthly' ? 'text-sky' : 'text-white'
              }`}>
              Month
            </Text>
          </Pressable>
        </View>

        <View className="mt-6 rounded-[28px] border border-white/15 bg-white/12 p-5">
          <Text className="text-xs font-black uppercase tracking-[2px] text-white/72">
            Best category
          </Text>
          <Text className="mt-3 text-2xl font-black text-white">
            {reportTopCategory?.name ?? 'Waiting for data'}
          </Text>
          <Text className="mt-2 text-sm font-semibold text-white/74">
            {reportTopCategory
              ? `${formatAmount(reportTopCategory.total)} leads this ${
                  scope === 'weekly' ? 'week' : 'month'
                }`
              : 'Add a few expenses to unlock the breakdown'}
          </Text>
        </View>
      </LinearGradient>

      <View className="flex-row gap-3">
        <SummaryCard icon="cash" label="Total" tone="blue" value={report?.total ?? 0} />
        <SummaryCard
          icon="stats-chart"
          label="Entries"
          tone="gold"
          value={report?.expenseCount ?? 0}
        />
      </View>

      <View className="rounded-[32px] border border-white/80 bg-panel/90 p-5 shadow-card">
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-[26px] font-black text-ink">Budget Progress</Text>
            <Text className="mt-2 text-sm text-mute">
              {budgetQuery.data
                ? formatMonthLabel(budgetQuery.data.month, budgetQuery.data.year)
                : 'Current month'}
            </Text>
          </View>
          <View className="rounded-full bg-skySoft px-4 py-2">
            <Text className="text-sm font-black text-sky">
              {Math.round(budgetQuery.data?.percentageUsed ?? 0)}%
            </Text>
          </View>
        </View>

        <View className="mt-5 gap-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-bold text-mute">Budget</Text>
            <Text className="text-base font-black text-ink">
              {formatAmount(budgetQuery.data?.spent ?? 0)} / {formatAmount(budgetQuery.data?.amount ?? 0)}
            </Text>
          </View>
          <ProgressBar total={budgetQuery.data?.amount ?? 0} value={budgetQuery.data?.spent ?? 0} />
        </View>

        <View className="mt-4 rounded-[26px] border border-white/70 bg-sand/90 p-4">
          <Text className="text-xs font-black uppercase tracking-[2px] text-sky">Budget Owner</Text>
          <Text className="mt-2 text-sm font-black text-ink">
            {budgetQuery.data?.setBy?.fullName
              ? `Set by ${budgetQuery.data.setBy.fullName}`
              : 'No one has set this month’s budget yet'}
          </Text>
          <Text className="mt-1 text-sm text-mute">
            {budgetQuery.data?.updatedAt
              ? `Last updated ${formatLongDateLabel(budgetQuery.data.updatedAt)}`
              : 'Add a number below to start tracking it.'}
          </Text>
        </View>

        {canSetBudget ? (
          <View className="mt-5 gap-3">
            <Text className="text-xs font-black uppercase tracking-[2px] text-mute">
              Monthly budget amount
            </Text>
            <TextInput
              className="rounded-[28px] border border-white/70 bg-sand/90 px-5 py-5 text-3xl font-black text-ink shadow-card"
              keyboardType="number-pad"
              onChangeText={setBudgetAmount}
              placeholder="5000"
              placeholderTextColor="#8CA1BC"
              value={budgetAmount}
            />
            <Pressable className="self-start rounded-full bg-skySoft px-4 py-3" onPress={setBudgetQuick}>
              <Text className="text-sm font-black text-sky">Suggest +500</Text>
            </Pressable>
            <AppButton
              label={budgetMutation.isPending ? 'Saving...' : 'Save Budget'}
              onPress={saveBudget}
            />
          </View>
        ) : null}
      </View>

      {canViewFoodTimetable ? (
        <View className="rounded-[32px] border border-white/80 bg-panel/90 p-5 shadow-card">
          <SectionTitle
            subtitle="Admin sets the weekly meal times, everyone can view them"
            title="Food Time Table"
          />

          <View className="mt-5 gap-3">
            {(foodTimetableQuery.data ?? buildFoodTimetableDraft([])).map((day) => (
              <View
                className={`rounded-[26px] border border-white/70 p-4 ${
                  day.dayOfWeek === getTodayFoodDayOfWeek() ? 'bg-skySoft/90' : 'bg-sand/90'
                }`}
                key={day.dayOfWeek}>
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-black text-ink">
                    {getFoodDayLabel(day.dayOfWeek, 'long')}
                  </Text>
                  <Text className="text-xs font-bold uppercase tracking-widest text-mute">
                    {day.updatedBy?.fullName ? `by ${day.updatedBy.fullName}` : 'admin'}
                  </Text>
                </View>

                <View className="mt-3 gap-2">
                  <FoodTimeRow label="Breakfast" value={day.breakfast} />
                  <FoodTimeRow label="Lunch" value={day.lunch} />
                  <FoodTimeRow label="Dinner" value={day.dinner} />
                </View>

                {day.note ? (
                  <Text className="mt-3 text-sm font-semibold text-mute">{day.note}</Text>
                ) : null}
              </View>
            ))}
          </View>

          {canEditFoodTimetable ? (
            <View className="mt-6 rounded-[30px] border border-white/70 bg-sand/90 p-4">
              <Text className="text-lg font-black text-ink">Edit Weekly Plan</Text>
              <Text className="mt-1 text-sm text-mute">
                Pick a day, update the meal times, then save the week.
              </Text>

              <View className="mt-4 flex-row flex-wrap gap-2">
                {FOOD_TIMETABLE_DAYS.map((day) => (
                  <Pressable
                    className={`rounded-full px-4 py-3 ${
                      selectedFoodDay === day.value ? 'bg-sky' : 'bg-panel'
                    }`}
                    key={day.value}
                    onPress={() => setSelectedFoodDay(day.value)}>
                    <Text
                      className={`text-sm font-black ${
                        selectedFoodDay === day.value ? 'text-white' : 'text-ink'
                      }`}>
                      {day.shortLabel}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View className="mt-4 gap-3">
                <AppInput
                  icon="sunny"
                  label="Breakfast"
                  onChangeText={(value) => updateSelectedFoodField('breakfast', value)}
                  placeholder="7:30 AM"
                  value={selectedFoodPlan.breakfast}
                />
                <AppInput
                  icon="partly-sunny"
                  label="Lunch"
                  onChangeText={(value) => updateSelectedFoodField('lunch', value)}
                  placeholder="1:00 PM"
                  value={selectedFoodPlan.lunch}
                />
                <AppInput
                  icon="moon"
                  label="Dinner"
                  onChangeText={(value) => updateSelectedFoodField('dinner', value)}
                  placeholder="8:00 PM"
                  value={selectedFoodPlan.dinner}
                />

                <View className="gap-2">
                  <Text className="text-xs font-black uppercase tracking-[2px] text-mute">Note</Text>
                  <TextInput
                    className="min-h-[100px] rounded-[26px] border border-white/70 bg-panel/90 px-4 py-4 text-base font-semibold text-ink"
                    multiline
                    onChangeText={(value) => updateSelectedFoodField('note', value)}
                    placeholder="Soup night, Friday biryani, fasting adjustments..."
                    placeholderTextColor="#8CA1BC"
                    textAlignVertical="top"
                    value={selectedFoodPlan.note}
                  />
                </View>

                <AppButton
                  disabled={foodTimetableMutation.isPending}
                  label={foodTimetableMutation.isPending ? 'Saving...' : 'Save Food Time Table'}
                  onPress={saveFoodTimetable}
                />
              </View>
            </View>
          ) : null}
        </View>
      ) : null}

      <View className="rounded-[32px] border border-white/80 bg-panel/90 p-5 shadow-card">
        <SectionTitle subtitle="Top spenders in the shared wallet" title="People" />
        <View className="mt-5 gap-4">
          {(report?.byUser ?? []).map((item) => (
            <View className="rounded-[26px] border border-white/70 bg-sand/90 p-4" key={item.id}>
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-black text-ink">{item.fullName}</Text>
                <Text className="text-base font-black text-ink">{formatAmount(item.total)}</Text>
              </View>
              <View className="mt-3 h-3 rounded-full bg-white">
                <View
                  className="h-3 rounded-full bg-sky"
                  style={{ width: `${report?.total ? (item.total / report.total) * 100 : 0}%` }}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className="rounded-[32px] border border-white/80 bg-panel/90 p-5 shadow-card">
        <SectionTitle subtitle="Where the money goes most" title="Categories" />
        <View className="mt-5 gap-4">
          {(report?.byCategory ?? []).map((item) => (
            <View className="rounded-[26px] border border-white/70 bg-sand/90 p-4" key={item.id}>
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-black text-ink">{item.name}</Text>
                <Text className="text-base font-black text-ink">{formatAmount(item.total)}</Text>
              </View>
              <View className="mt-3 h-3 rounded-full bg-white">
                <View
                  className="h-3 rounded-full"
                  style={{
                    backgroundColor: item.color,
                    width: `${report?.total ? (item.total / report.total) * 100 : 0}%`,
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className="rounded-[32px] border border-white/80 bg-panel/90 p-5 shadow-card">
        <SectionTitle subtitle="A lighter daily breakdown" title="Daily View" />
        <View className="mt-5 gap-3">
          {(report?.dailyTotals ?? []).map((item) => (
            <View
              className="flex-row items-center justify-between rounded-[24px] border border-white/70 bg-sand/90 px-4 py-4"
              key={item.date}>
              <Text className="text-sm font-bold text-mute">{formatDateLabel(item.date)}</Text>
              <Text className="text-base font-black text-ink">{formatAmount(item.total)}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScreenShell>
  );
}

function FoodTimeRow({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <View className="flex-row items-center justify-between rounded-[18px] border border-white/70 bg-panel/90 px-4 py-3">
      <Text className="text-sm font-black text-mute">{label}</Text>
      <Text className="text-sm font-black text-ink">{value || 'Not set'}</Text>
    </View>
  );
}
