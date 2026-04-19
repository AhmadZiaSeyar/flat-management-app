import { Text, View } from 'react-native';

export function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View className="gap-1">
      <Text className="text-2xl font-black text-ink">{title}</Text>
      {subtitle ? <Text className="text-sm text-mute">{subtitle}</Text> : null}
    </View>
  );
}
