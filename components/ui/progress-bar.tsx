import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

export function ProgressBar({
  value,
  total,
  colorClassName = 'bg-add',
}: {
  value: number;
  total: number;
  colorClassName?: string;
}) {
  const percentage = total > 0 ? Math.min((value / total) * 100, 100) : 0;

  return (
    <View className="gap-2">
      <View className="h-3 overflow-hidden rounded-full bg-[#DCE8F8]">
        <LinearGradient
          colors={colorClassName === 'bg-white' ? ['#FFFFFF', '#E2ECFF'] : ['#60A5FA', '#2563EB']}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
          style={{ height: 12, width: `${percentage}%` }}
        />
      </View>
      <Text className="text-xs font-semibold text-mute">{percentage.toFixed(0)}% used</Text>
    </View>
  );
}
