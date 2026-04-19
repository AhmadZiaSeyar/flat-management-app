import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

export function LoadingScreen({ label = 'Loading...' }: { label?: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-sand px-8">
      <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-addSoft">
        <Ionicons name="wallet" size={36} color="#16855D" />
      </View>
      <Text className="text-lg font-bold text-ink">{label}</Text>
      <Text className="mt-2 text-center text-sm text-mute">Preparing your flat wallet</Text>
    </View>
  );
}
