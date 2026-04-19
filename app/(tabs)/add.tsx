import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, TextInput, View } from 'react-native';
import { AppButton } from '@/components/ui/app-button';
import { CategoryCard } from '@/components/ui/category-card';
import { ScreenShell } from '@/components/ui/screen-shell';
import { SectionTitle } from '@/components/ui/section-title';
import { getCategories } from '@/api/categories';
import { createExpense } from '@/api/expenses';
import { getErrorMessage } from '@/lib/api-error';
import { showErrorToast, showInfoToast, showSuccessToast } from '@/store/toast-store';
import { useState } from 'react';

const quickAmounts = ['50', '100', '250', '500'];

export default function AddExpenseScreen() {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const addExpenseMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['expenses'] }),
        queryClient.invalidateQueries({ queryKey: ['reports'] }),
        queryClient.invalidateQueries({ queryKey: ['budget'] }),
      ]);
      setAmount('');
      setSelectedCategoryId(null);
      setNote('');
      showSuccessToast({
        title: 'Expense saved',
        message: 'The shared list is updated.',
      });
    },
    onError: (error) => {
      showErrorToast({
        title: 'Could not save',
        message: getErrorMessage(error, 'Check the amount and category.'),
      });
    },
  });

  const saveExpense = () => {
    const parsedAmount = Number(amount);

    if (!parsedAmount || !selectedCategoryId) {
      showInfoToast({
        title: 'Need more info',
        message: 'Add an amount and choose a category.',
      });
      return;
    }

    addExpenseMutation.mutate({
      amount: parsedAmount,
      categoryId: selectedCategoryId,
      note: note.trim() || undefined,
    });
  };

  return (
    <ScreenShell>
      <LinearGradient
        colors={['#77B9FF', '#2563EB', '#193A7A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="overflow-hidden rounded-[36px] p-6 shadow-float">
        <View className="absolute -left-12 top-0 h-32 w-32 rounded-full bg-white/14" />
        <View className="absolute right-4 top-8 h-24 w-24 rounded-full bg-white/10" />

        <View className="flex-row items-start justify-between">
          <SectionTitle subtitle="Big buttons, one save" title="Add Expense" />
          <View className="h-14 w-14 items-center justify-center rounded-[20px] bg-white/14">
            <Ionicons color="#FFFFFF" name="wallet" size={24} />
          </View>
        </View>

        <View className="mt-6 rounded-[28px] border border-white/15 bg-white/12 p-5">
          <Text className="text-xs font-black uppercase tracking-[2px] text-white/72">Shared amount</Text>
          <TextInput
            className="mt-3 text-[44px] font-black tracking-[-1px] text-white"
            keyboardType="number-pad"
            onChangeText={setAmount}
            placeholder="0"
            placeholderTextColor="rgba(255,255,255,0.42)"
            value={amount}
          />
          <Text className="mt-2 text-sm font-semibold text-white/70">
            Quick chips below help roommates save an expense in one tap.
          </Text>
        </View>

        <View className="mt-4 flex-row flex-wrap gap-3">
          {quickAmounts.map((value) => (
            <Pressable
              key={value}
              className="rounded-full border border-white/15 bg-white/12 px-5 py-3"
              onPress={() => setAmount(value)}>
              <Text className="text-sm font-black text-white">{value}</Text>
            </Pressable>
          ))}
        </View>
      </LinearGradient>

      <View className="rounded-[32px] border border-white/80 bg-panel/90 p-5 shadow-card">
        <View className="flex-row items-start justify-between gap-3">
          <View>
            <Text className="text-[26px] font-black text-ink">Pick Category</Text>
            <Text className="mt-2 text-sm text-mute">
              Large tiles keep the step visual and easy to understand.
            </Text>
          </View>
          <View className="rounded-[20px] bg-skySoft px-4 py-3">
            <Text className="text-xs font-black uppercase tracking-[2px] text-sky">
              {(categoriesQuery.data ?? []).length} ready
            </Text>
          </View>
        </View>

        <View className="mt-5 flex-row flex-wrap justify-between gap-y-3">
          {(categoriesQuery.data ?? []).map((category) => (
            <CategoryCard
              category={category}
              key={category.id}
              onPress={() => setSelectedCategoryId(category.id)}
              selected={selectedCategoryId === category.id}
            />
          ))}
        </View>
      </View>

      <View className="rounded-[32px] border border-white/80 bg-panel/90 p-5 shadow-card">
        <View className="flex-row items-start justify-between gap-3">
          <View>
            <Text className="text-[24px] font-black text-ink">Extra Note</Text>
            <Text className="mt-2 text-sm text-mute">
              Optional, only if the expense needs a short explanation.
            </Text>
          </View>
          <View className="h-12 w-12 items-center justify-center rounded-[18px] bg-sand">
            <Ionicons color="#2563EB" name="document-text" size={22} />
          </View>
        </View>

        <TextInput
          className="mt-5 min-h-[116px] rounded-[28px] border border-white/70 bg-sand/90 px-5 py-4 text-base font-semibold text-ink"
          multiline
          onChangeText={setNote}
          placeholder="Milk, shared taxi, gas refill..."
          placeholderTextColor="#8CA1BC"
          textAlignVertical="top"
          value={note}
        />
      </View>

      <AppButton
        disabled={!amount || !selectedCategoryId || addExpenseMutation.isPending}
        label={addExpenseMutation.isPending ? 'Saving...' : 'Save Expense'}
        onPress={saveExpense}
      />
    </ScreenShell>
  );
}
