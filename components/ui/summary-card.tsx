import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { formatAmount } from '@/lib/format';

const toneClasses = {
  green: { panel: 'bg-addSoft', icon: '#16855D' },
  red: { panel: 'bg-spendSoft', icon: '#D74C3C' },
  gold: { panel: 'bg-goldSoft', icon: '#D9A21B' },
  blue: { panel: 'bg-skySoft', icon: '#2C69D1' },
};

export function SummaryCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number | string;
  icon: keyof typeof Ionicons.glyphMap;
  tone: keyof typeof toneClasses;
}) {
  const colors = toneClasses[tone];

  return (
    <View className={`flex-1 rounded-[26px] ${colors.panel} p-4`}>
      <Ionicons color={colors.icon} name={icon} size={24} />
      <Text className="mt-4 text-sm font-semibold text-mute">{label}</Text>
      <Text className="mt-1 text-2xl font-black text-ink">
        {typeof value === 'number' ? formatAmount(value) : value}
      </Text>
    </View>
  );
}
