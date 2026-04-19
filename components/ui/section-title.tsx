import { Text, View } from 'react-native';

export function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View className="gap-2">
      {subtitle ? (
        <View className="self-start rounded-full bg-panel/80 px-3 py-1 shadow-card">
          <Text className="text-[11px] font-black uppercase tracking-[1.6px] text-sky">
            {subtitle}
          </Text>
        </View>
      ) : null}
      <Text className="text-[30px] font-black leading-9 text-ink">{title}</Text>
    </View>
  );
}
