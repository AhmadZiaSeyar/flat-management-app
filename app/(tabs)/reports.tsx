import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pressable, Text, View } from 'react-native';
import { useState } from 'react';
import { getCurrentBudget, upsertCurrentBudget } from '@/api/budgets';
import { getMonthlyReport, getWeeklyReport } from '@/api/reports';
import { AppButton } from '@/components/ui/app-button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { ScreenShell } from '@/components/ui/screen-shell';
import { SectionTitle } from '@/components/ui/section-title';
import { SummaryCard } from '@/components/ui/summary-card';
import { formatAmount, formatDateLabel, formatMonthLabel } from '@/lib/format';
import { useAuthStore } from '@/store/auth-store';

export default function ReportsScreen() {
  const queryClient = useQueryClient();
  const [scope, setScope] = useState<'weekly' | 'monthly'>('weekly');
  const user = useAuthStore((state) => state.user);
  const canSetBudget = user?.roles.includes('Admin');

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

  const report = scope === 'weekly' ? weeklyReportQuery.data : monthlyReportQuery.data;

  const budgetMutation = useMutation({
    mutationFn: upsertCurrentBudget,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['budget'] }),
        queryClient.invalidateQueries({ queryKey: ['reports'] }),
      ]);
    },
  });

  const setBudgetQuick = () => {
    const now = new Date();
    const currentAmount = budgetQuery.data?.amount ?? 0;
    const nextAmount = currentAmount ? currentAmount + 500 : 5000;

    budgetMutation.mutate({
      amount: nextAmount,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });
  };

  return (
    <ScreenShell>
      <SectionTitle subtitle="Track the flat together" title="Reports" />

      <View className="flex-row gap-3">
        <Pressable
          className={`flex-1 rounded-[22px] px-4 py-4 ${scope === 'weekly' ? 'bg-addSoft' : 'bg-panel'}`}
          onPress={() => setScope('weekly')}>
          <Text className="text-center text-base font-black text-ink">Week</Text>
        </Pressable>
        <Pressable
          className={`flex-1 rounded-[22px] px-4 py-4 ${scope === 'monthly' ? 'bg-addSoft' : 'bg-panel'}`}
          onPress={() => setScope('monthly')}>
          <Text className="text-center text-base font-black text-ink">Month</Text>
        </Pressable>
      </View>

      <View className="flex-row gap-3">
        <SummaryCard icon="cash" label="Total" tone="green" value={report?.total ?? 0} />
        <SummaryCard
          icon="stats-chart"
          label="Entries"
          tone="blue"
          value={report?.expenseCount ?? 0}
        />
      </View>

      <View className="rounded-[30px] bg-panel p-5">
        <Text className="text-xl font-black text-ink">Budget Progress</Text>
        <Text className="mt-1 text-sm text-mute">
          {budgetQuery.data
            ? formatMonthLabel(budgetQuery.data.month, budgetQuery.data.year)
            : 'Current month'}
        </Text>
        <View className="mt-5 gap-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-bold text-mute">Budget</Text>
            <Text className="text-base font-black text-ink">
              {formatAmount(budgetQuery.data?.spent ?? 0)} / {formatAmount(budgetQuery.data?.amount ?? 0)}
            </Text>
          </View>
          <ProgressBar total={budgetQuery.data?.amount ?? 0} value={budgetQuery.data?.spent ?? 0} />
        </View>
        {canSetBudget ? (
          <View className="mt-5">
            <AppButton
              label={budgetMutation.isPending ? 'Updating...' : 'Quick Budget +500'}
              onPress={setBudgetQuick}
            />
          </View>
        ) : null}
      </View>

      <View className="rounded-[30px] bg-panel p-5">
        <Text className="text-xl font-black text-ink">People</Text>
        <View className="mt-5 gap-4">
          {(report?.byUser ?? []).map((item) => (
            <View key={item.id}>
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-black text-ink">{item.fullName}</Text>
                <Text className="text-base font-black text-ink">{formatAmount(item.total)}</Text>
              </View>
              <View className="mt-2 h-3 rounded-full bg-sand">
                <View
                  className="h-3 rounded-full bg-sky"
                  style={{ width: `${report?.total ? (item.total / report.total) * 100 : 0}%` }}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className="rounded-[30px] bg-panel p-5">
        <Text className="text-xl font-black text-ink">Categories</Text>
        <View className="mt-5 gap-4">
          {(report?.byCategory ?? []).map((item) => (
            <View key={item.id}>
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-black text-ink">{item.name}</Text>
                <Text className="text-base font-black text-ink">{formatAmount(item.total)}</Text>
              </View>
              <View className="mt-2 h-3 rounded-full bg-sand">
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

      <View className="rounded-[30px] bg-panel p-5">
        <Text className="text-xl font-black text-ink">Daily View</Text>
        <View className="mt-5 gap-3">
          {(report?.dailyTotals ?? []).map((item) => (
            <View className="flex-row items-center justify-between" key={item.date}>
              <Text className="text-sm font-bold text-mute">{formatDateLabel(item.date)}</Text>
              <Text className="text-base font-black text-ink">{formatAmount(item.total)}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScreenShell>
  );
}
