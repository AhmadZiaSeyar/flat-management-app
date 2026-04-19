import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { formatAmount } from '@/lib/format';

const toneClasses = {
  green: { panel: 'bg-addSoft', icon: '#2563EB' },
  red: { panel: 'bg-spendSoft', icon: '#EF4444' },
  gold: { panel: 'bg-goldSoft', icon: '#D97706' },
  blue: { panel: 'bg-skySoft', icon: '#1D4ED8' },
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
    <View className={`flex-1 rounded-[28px] border border-white/80 ${colors.panel} p-4 shadow-card`}>
      <View className="h-12 w-12 items-center justify-center rounded-[18px] bg-white/75">
        <Ionicons color={colors.icon} name={icon} size={22} />
      </View>
      <Text className="mt-5 text-xs font-black uppercase tracking-[1.4px] text-mute">{label}</Text>
      <Text className="mt-2 text-[28px] font-black text-ink">
        {typeof value === 'number' ? formatAmount(value) : value}
      </Text>
    </View>
  );
}
