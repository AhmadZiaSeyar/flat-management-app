import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { categoryIconMap } from '@/constants/theme';
import { formatAmount, getFirstName } from '@/lib/format';
import { Expense } from '@/types/api';

export function ExpenseItem({ expense }: { expense: Expense }) {
  const iconName =
    (categoryIconMap[expense.category.icon] as keyof typeof Ionicons.glyphMap | undefined) ??
    'wallet';

  return (
    <View className="flex-row items-center rounded-[26px] border border-white/80 bg-panel/90 p-4 shadow-card">
      <View
        className="h-14 w-14 items-center justify-center rounded-[20px]"
        style={{ backgroundColor: `${expense.category.color}18` }}>
        <Ionicons color={expense.category.color} name={iconName} size={26} />
      </View>
      <View className="ml-4 flex-1">
        <Text className="text-lg font-black text-ink">{formatAmount(expense.amount)}</Text>
        <Text className="mt-1 text-sm font-bold text-slate-700">{expense.category.name}</Text>
        <Text className="mt-1 text-xs font-semibold text-mute">
          {getFirstName(expense.createdBy.fullName)}
          {expense.note ? ` • ${expense.note}` : ''}
        </Text>
      </View>
      <View className="rounded-full bg-skySoft px-3 py-2">
        <Text className="text-xs font-black uppercase tracking-[1px] text-sky">Spent</Text>
      </View>
    </View>
  );
}
