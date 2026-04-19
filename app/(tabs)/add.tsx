import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
      <SectionTitle subtitle="Big buttons, one save" title="Add Expense" />

      <View className="rounded-[30px] bg-panel p-5">
        <Text className="text-sm font-black text-mute">Amount</Text>
        <TextInput
          className="mt-3 rounded-[24px] bg-sand px-5 py-5 text-4xl font-black text-ink"
          keyboardType="number-pad"
          onChangeText={setAmount}
          placeholder="0"
          placeholderTextColor="#9A8E7B"
          value={amount}
        />
        <View className="mt-4 flex-row flex-wrap gap-3">
          {quickAmounts.map((value) => (
            <Pressable
              key={value}
              className="rounded-full bg-addSoft px-5 py-3"
              onPress={() => setAmount(value)}>
              <Text className="text-sm font-black text-add">{value}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="rounded-[30px] bg-panel p-5">
        <Text className="text-xl font-black text-ink">Pick Category</Text>
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

      <View className="rounded-[30px] bg-panel p-5">
        <Text className="text-sm font-black text-mute">Note</Text>
        <TextInput
          className="mt-3 rounded-[24px] bg-sand px-5 py-4 text-base font-semibold text-ink"
          onChangeText={setNote}
          placeholder="Optional detail"
          placeholderTextColor="#9A8E7B"
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
