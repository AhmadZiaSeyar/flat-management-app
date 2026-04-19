import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

export function LoadingScreen({ label = 'Loading...' }: { label?: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-sand px-8">
      <View className="absolute -top-12 left-0 h-72 w-72 rounded-full bg-addSoft/60" />
      <View className="absolute bottom-12 right-0 h-56 w-56 rounded-full bg-goldSoft/50" />
      <LinearGradient
        colors={['#FFFFFF', '#E9F1FF']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={{
          alignItems: 'center',
          borderColor: 'rgba(255,255,255,0.8)',
          borderRadius: 32,
          borderWidth: 1,
          paddingHorizontal: 32,
          paddingVertical: 28,
        }}>
        <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-addSoft">
          <Ionicons name="wallet" size={36} color="#2563EB" />
        </View>
        <Text className="text-lg font-bold text-ink">{label}</Text>
        <Text className="mt-2 text-center text-sm text-mute">Preparing your flat wallet</Text>
      </LinearGradient>
    </View>
  );
}
