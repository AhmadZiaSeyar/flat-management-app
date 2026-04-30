import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Alert, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentBudget } from '@/api/budgets';
import { clearExpenses, getExpenses } from '@/api/expenses';
import { getFoodTimetable } from '@/api/food-timetable';
import { getMonthlyReport, getWeeklyReport } from '@/api/reports';
import { ExpenseItem } from '@/components/ui/expense-item';
import { ProgressBar } from '@/components/ui/progress-bar';
import { ScreenShell } from '@/components/ui/screen-shell';
import { SectionTitle } from '@/components/ui/section-title';
import { SummaryCard } from '@/components/ui/summary-card';
import { getErrorMessage } from '@/lib/api-error';
import { getFoodDayLabel, getTodayFoodDayOfWeek } from '@/lib/food-timetable';
import { formatAmount, formatLongDateLabel, getFirstName } from '@/lib/format';
import { useAuthStore } from '@/store/auth-store';
import { showErrorToast, showInfoToast, showSuccessToast } from '@/store/toast-store';
import { Expense } from '@/types/api';
import { useState } from 'react';

const filters: ('today' | 'week' | 'month')[] = ['today', 'week', 'month'];

export default function HomeScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const [range, setRange] = useState<'today' | 'week' | 'month'>('today');
  const canViewFoodTimetable = user?.permissions.includes('view_food_timetable');
  const canClearExpenses = user?.permissions.includes('clear_expenses');

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
  const expensesQuery = useQuery({
    queryKey: ['expenses', range],
    queryFn: () => getExpenses(range),
  });
  const foodTimetableQuery = useQuery({
    queryKey: ['food-timetable'],
    queryFn: getFoodTimetable,
    enabled: Boolean(canViewFoodTimetable),
  });
  const clearExpensesMutation = useMutation({
    mutationFn: clearExpenses,
    onSuccess: async ({ deletedCount }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['expenses'] }),
        queryClient.invalidateQueries({ queryKey: ['reports'] }),
        queryClient.invalidateQueries({ queryKey: ['budget'] }),
        queryClient.invalidateQueries({ queryKey: ['users'] }),
      ]);
      showSuccessToast({
        title: 'Expenses cleared',
        message: deletedCount
          ? `${deletedCount} expense${deletedCount === 1 ? '' : 's'} removed.`
          : 'There were no expenses to remove.',
      });
    },
    onError: (error) => {
      showErrorToast({
        title: 'Could not clear expenses',
        message: getErrorMessage(error, 'Please try again in a moment.'),
      });
    },
  });

  const groupedExpenses = groupExpenses(expensesQuery.data ?? []);
  const todayFoodPlan = foodTimetableQuery.data?.find(
    (day) => day.dayOfWeek === getTodayFoodDayOfWeek(),
  );
  const budgetPercentage = Math.round(budgetQuery.data?.percentageUsed ?? 0);
  const topContributor = monthlyReportQuery.data?.byUser?.[0];
  const dailyAverage =
    monthlyReportQuery.data?.expenseCount && monthlyReportQuery.data.expenseCount > 0
      ? Math.round((monthlyReportQuery.data.total ?? 0) / monthlyReportQuery.data.expenseCount)
      : 0;

  const handleSignOut = async () => {
    await signOut();
    showInfoToast({
      title: 'Signed out',
      message: 'See you again soon.',
    });
  };

  const confirmClearExpenses = () => {
    Alert.alert(
      'Clear all expenses?',
      'This removes every expense from the shared wallet. Users, categories, budgets, and food timetable stay unchanged.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear all',
          style: 'destructive',
          onPress: () => clearExpensesMutation.mutate(),
        },
      ],
    );
  };

  return (
    <ScreenShell>
      <LinearGradient
        colors={['#70B4FF', '#2563EB', '#132B62']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="overflow-hidden rounded-[38px] p-6 shadow-float">
        <View className="absolute -left-10 -top-12 h-36 w-36 rounded-full bg-white/16" />
        <View className="absolute right-0 top-10 h-28 w-28 rounded-full bg-white/10" />
        <View className="absolute -bottom-8 right-14 h-24 w-24 rounded-full bg-white/10" />

        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-base font-semibold text-white/78">
              Hi {getFirstName(user?.fullName ?? 'friend')}
            </Text>
            <Text className="mt-2 text-[34px] font-black leading-10 text-white">
              Flat wallet
            </Text>
            <View className="mt-3 self-start rounded-full bg-white/14 px-4 py-2">
              <Text className="text-xs font-black uppercase tracking-[2px] text-white/80">
                Live shared budget
              </Text>
            </View>
          </View>

          <Pressable
            accessibilityLabel="Log out"
            className="h-12 w-12 items-center justify-center rounded-[18px] border border-white/15 bg-white/12"
            onPress={() => {
              void handleSignOut();
            }}>
            <Ionicons color="#FFFFFF" name="log-out-outline" size={22} />
          </Pressable>
        </View>

        <View className="mt-8 flex-row items-end justify-between">
          <View className="flex-1">
            <Text className="text-[40px] font-black tracking-[-1px] text-white">
              {formatAmount(monthlyReportQuery.data?.total ?? 0)}
            </Text>
            <Text className="mt-2 text-sm font-semibold text-white/74">
              Total spending this month
            </Text>
          </View>

          <View className="rounded-[24px] border border-white/15 bg-white/10 px-4 py-4">
            <Text className="text-xs font-black uppercase tracking-[2px] text-white/70">Daily Avg</Text>
            <Text className="mt-2 text-2xl font-black text-white">{formatAmount(dailyAverage)}</Text>
          </View>
        </View>

        <View className="mt-6 flex-row gap-3">
          <View className="flex-1 rounded-[26px] border border-white/15 bg-white/10 p-4">
            <Text className="text-xs font-black uppercase tracking-[2px] text-white/70">Week Flow</Text>
            <Text className="mt-2 text-2xl font-black text-white">
              {formatAmount(weeklyReportQuery.data?.total ?? 0)}
            </Text>
            <Text className="mt-1 text-xs font-semibold text-white/72">Seven-day shared total</Text>
          </View>

          <View className="flex-1 rounded-[26px] border border-white/15 bg-white/10 p-4">
            <Text className="text-xs font-black uppercase tracking-[2px] text-white/70">Top User</Text>
            <Text className="mt-2 text-lg font-black text-white">
              {topContributor?.fullName ?? 'No data'}
            </Text>
            <Text className="mt-1 text-xs font-semibold text-white/72">
              {topContributor ? `${formatAmount(topContributor.total)} added` : 'Waiting for entries'}
            </Text>
          </View>
        </View>

        <View className="mt-6 rounded-[28px] border border-white/15 bg-white/12 p-5">
          <View className="mb-4 flex-row items-start justify-between">
            <View>
              <Text className="text-base font-black text-white">Budget Track</Text>
              <Text className="mt-1 text-sm font-semibold text-white/72">
                Smooth view of the shared spending limit
              </Text>
            </View>
            <View className="rounded-full bg-white/14 px-4 py-2">
              <Text className="text-xs font-black uppercase tracking-[2px] text-white">
                {budgetPercentage}% used
              </Text>
            </View>
          </View>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-sm font-bold text-white/72">Budget</Text>
            <Text className="text-sm font-bold text-white/80">
              {formatAmount(budgetQuery.data?.spent ?? 0)} / {formatAmount(budgetQuery.data?.amount ?? 0)}
            </Text>
          </View>
          <ProgressBar
            colorClassName="bg-white"
            total={budgetQuery.data?.amount ?? 0}
            value={budgetQuery.data?.spent ?? 0}
          />
          <View className="mt-4 flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-white/75">
              {budgetQuery.data?.setBy?.fullName
                ? `Budget by ${budgetQuery.data.setBy.fullName}`
                : 'Budget still waiting to be set'}
            </Text>
            <Text className="text-xs font-black uppercase tracking-[2px] text-white/60">
              Shared wallet
            </Text>
          </View>
        </View>

        <View className="mt-5 flex-row gap-3">
          <Pressable
            className="flex-1 flex-row items-center justify-center rounded-[24px] bg-white px-5 py-4"
            onPress={() => router.push('/(tabs)/add')}>
            <Ionicons color="#2563EB" name="add-circle" size={22} />
            <Text className="ml-2 text-base font-black text-add">Quick Add</Text>
          </Pressable>

          <Pressable
            className="items-center justify-center rounded-[24px] border border-white/15 bg-white/10 px-5 py-4"
            onPress={() => router.push('/(tabs)/reports')}>
            <Ionicons color="#FFFFFF" name="stats-chart" size={22} />
          </Pressable>
        </View>
      </LinearGradient>

      <View className="flex-row gap-3">
        <SummaryCard
          icon="calendar"
          label="Week"
          tone="gold"
          value={weeklyReportQuery.data?.total ?? 0}
        />
        <SummaryCard
          icon="receipt"
          label="Bills"
          tone="red"
          value={monthlyReportQuery.data?.expenseCount ?? 0}
        />
      </View>

      {canViewFoodTimetable ? (
        <View className="rounded-[32px] border border-white/80 bg-panel/90 p-5 shadow-card">
          <SectionTitle
            subtitle={`Today • ${getFoodDayLabel(getTodayFoodDayOfWeek(), 'long')}`}
            title="Food Time Table"
          />

          {todayFoodPlan ? (
            <View className="mt-5 gap-3">
              <FoodSlotRow icon="sunny" label="Breakfast" value={todayFoodPlan.breakfast} />
              <FoodSlotRow icon="partly-sunny" label="Lunch" value={todayFoodPlan.lunch} />
              <FoodSlotRow icon="moon" label="Dinner" value={todayFoodPlan.dinner} />

              {todayFoodPlan.note ? (
                <View className="rounded-[26px] border border-white/70 bg-sand/90 p-4">
                  <Text className="text-xs font-black uppercase tracking-[2px] text-sky">Kitchen Note</Text>
                  <Text className="mt-2 text-sm text-mute">{todayFoodPlan.note}</Text>
                </View>
              ) : null}

              <Text className="text-xs font-bold text-mute">
                {todayFoodPlan.updatedBy?.fullName
                  ? `Updated by ${todayFoodPlan.updatedBy.fullName}`
                  : 'Waiting for admin update'}
              </Text>
            </View>
          ) : (
            <View className="mt-5 rounded-[24px] bg-sand p-5">
              <Text className="text-base font-black text-ink">No food plan posted yet</Text>
              <Text className="mt-1 text-sm text-mute">
                The admin can add breakfast, lunch, and dinner times from Reports.
              </Text>
            </View>
          )}
        </View>
      ) : null}

      <View className="rounded-[32px] border border-white/80 bg-panel/90 p-5 shadow-card">
        <View className="flex-row items-start justify-between gap-3">
          <SectionTitle subtitle="Tap a chip to change the list" title="Expenses" />
          <View className="rounded-[20px] bg-skySoft px-4 py-3">
            <Text className="text-xs font-black uppercase tracking-[2px] text-sky">
              {groupedExpenses.length} day groups
            </Text>
          </View>
        </View>
        <View className="mt-5 flex-row gap-3">
          {filters.map((item) => (
            <Pressable
              key={item}
              className={`rounded-full px-5 py-3 ${range === item ? 'bg-sky text-white shadow-card' : 'bg-sand'}`}
              onPress={() => setRange(item)}>
              <Text
                className={`text-sm font-black capitalize ${
                  range === item ? 'text-white' : 'text-ink'
                }`}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        {canClearExpenses ? (
          <Pressable
            className={`mt-4 flex-row items-center justify-center rounded-[24px] border px-5 py-4 ${
              clearExpensesMutation.isPending
                ? 'border-red-200 bg-red-50/60'
                : 'border-red-100 bg-red-50'
            }`}
            disabled={clearExpensesMutation.isPending}
            onPress={confirmClearExpenses}>
            <Ionicons color="#D64550" name="trash-outline" size={20} />
            <Text className="ml-2 text-sm font-black text-red-600">
              {clearExpensesMutation.isPending ? 'Clearing expenses...' : 'Clear all expenses'}
            </Text>
          </Pressable>
        ) : null}

        <View className="mt-5 gap-3">
          {groupedExpenses.length ? (
            groupedExpenses.map((group) => (
              <View className="gap-3" key={group.date}>
                <Text className="text-sm font-black text-mute">{formatLongDateLabel(group.date)}</Text>
                {group.items.map((expense) => (
                  <ExpenseItem expense={expense} key={expense.id} />
                ))}
              </View>
            ))
          ) : (
            <View className="rounded-[26px] border border-white/70 bg-sand/90 p-5">
              <Text className="text-base font-black text-ink">No spending here yet</Text>
              <Text className="mt-1 text-sm text-mute">Add the first expense with the blue button.</Text>
            </View>
          )}
        </View>
      </View>
    </ScreenShell>
  );
}

function groupExpenses(expenses: Expense[]) {
  const groups = new Map<string, Expense[]>();

  for (const expense of expenses) {
    const key = expense.expenseDate.slice(0, 10);
    const items = groups.get(key) ?? [];
    items.push(expense);
    groups.set(key, items);
  }

  return Array.from(groups.entries()).map(([date, items]) => ({
    date,
    items,
  }));
}

function FoodSlotRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <View className="flex-row items-center rounded-[26px] border border-white/70 bg-sand/90 p-4">
      <View className="h-12 w-12 items-center justify-center rounded-[18px] bg-panel shadow-card">
        <Ionicons color="#2563EB" name={icon} size={22} />
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-xs font-black uppercase tracking-[2px] text-mute">{label}</Text>
        <Text className="mt-1 text-base font-black text-ink">{value || 'Not set yet'}</Text>
      </View>
      <View className="rounded-full bg-white px-3 py-2">
        <Text className="text-[10px] font-black uppercase tracking-[2px] text-sky">Today</Text>
      </View>
    </View>
  );
}
