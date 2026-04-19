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
        <View className="flex-1 px-5 pt-4">{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-sand">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 120, gap: 20 }}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
