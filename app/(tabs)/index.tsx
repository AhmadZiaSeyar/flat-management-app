import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentBudget } from '@/api/budgets';
import { getExpenses } from '@/api/expenses';
import { getMonthlyReport, getWeeklyReport } from '@/api/reports';
import { ExpenseItem } from '@/components/ui/expense-item';
import { ProgressBar } from '@/components/ui/progress-bar';
import { ScreenShell } from '@/components/ui/screen-shell';
import { SectionTitle } from '@/components/ui/section-title';
import { SummaryCard } from '@/components/ui/summary-card';
import { formatAmount, formatLongDateLabel, getFirstName } from '@/lib/format';
import { useAuthStore } from '@/store/auth-store';
import { Expense } from '@/types/api';
import { useState } from 'react';

const filters: ('today' | 'week' | 'month')[] = ['today', 'week', 'month'];

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [range, setRange] = useState<'today' | 'week' | 'month'>('today');

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

  const groupedExpenses = groupExpenses(expensesQuery.data ?? []);

  return (
    <ScreenShell>
      <LinearGradient
        colors={['#16855D', '#0E5A45']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-[34px] p-6">
        <Text className="text-base font-semibold text-white/80">
          Hi {getFirstName(user?.fullName ?? 'friend')}
        </Text>
        <Text className="mt-2 text-4xl font-black text-white">
          {formatAmount(monthlyReportQuery.data?.total ?? 0)}
        </Text>
        <Text className="mt-2 text-sm font-semibold text-white/75">This month spend</Text>

        <View className="mt-6 rounded-[24px] bg-white/12 p-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-base font-black text-white">Budget</Text>
            <Text className="text-sm font-bold text-white/80">
              {formatAmount(budgetQuery.data?.spent ?? 0)} / {formatAmount(budgetQuery.data?.amount ?? 0)}
            </Text>
          </View>
          <ProgressBar
            colorClassName="bg-white"
            total={budgetQuery.data?.amount ?? 0}
            value={budgetQuery.data?.spent ?? 0}
          />
        </View>

        <Pressable
          className="mt-5 flex-row items-center justify-center rounded-[22px] bg-white px-5 py-4"
          onPress={() => router.push('/(tabs)/add')}>
          <Ionicons color="#16855D" name="add-circle" size={22} />
          <Text className="ml-2 text-base font-black text-add">Quick Add</Text>
        </Pressable>
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

      <View className="rounded-[30px] bg-panel p-5">
        <SectionTitle subtitle="Tap a chip to change the list" title="Expenses" />
        <View className="mt-5 flex-row gap-3">
          {filters.map((item) => (
            <Pressable
              key={item}
              className={`rounded-full px-5 py-3 ${range === item ? 'bg-addSoft' : 'bg-sand'}`}
              onPress={() => setRange(item)}>
              <Text className="text-sm font-black capitalize text-ink">{item}</Text>
            </Pressable>
          ))}
        </View>

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
            <View className="rounded-[24px] bg-sand p-5">
              <Text className="text-base font-black text-ink">No spending here yet</Text>
              <Text className="mt-1 text-sm text-mute">Add the first expense with the green button.</Text>
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
