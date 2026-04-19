import { LinearGradient } from 'expo-linear-gradient';
import { PropsWithChildren } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function ScreenShell({
  children,
  scroll = true,
}: PropsWithChildren<{ scroll?: boolean }>) {
  if (!scroll) {
    return (
      <SafeAreaView className="flex-1 bg-sand">
        <FinanceBackdrop />
        <View className="flex-1 px-5 pt-4">{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-sand">
      <FinanceBackdrop />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 132, gap: 22 }}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

function FinanceBackdrop() {
  return (
    <View className="absolute inset-0">
      <LinearGradient
        colors={['#F7FAFF', '#EEF4FF', '#F2F6FF']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={{ flex: 1 }}
      />
      <View
        className="absolute -left-16 top-14 h-52 w-52 rounded-full"
        style={{ backgroundColor: 'rgba(59,130,246,0.14)' }}
      />
      <View
        className="absolute -right-10 top-28 h-44 w-44 rounded-full"
        style={{ backgroundColor: 'rgba(245,158,11,0.08)' }}
      />
      <View
        className="absolute left-16 top-56 h-24 w-24 rounded-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.48)' }}
      />
    </View>
  );
}
