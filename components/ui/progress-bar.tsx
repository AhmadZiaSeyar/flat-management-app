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
      <View className="h-3 rounded-full bg-[#EFE4D4]">
        <View className={`h-3 rounded-full ${colorClassName}`} style={{ width: `${percentage}%` }} />
      </View>
      <Text className="text-xs font-semibold text-mute">{percentage.toFixed(0)}% used</Text>
    </View>
  );
}
