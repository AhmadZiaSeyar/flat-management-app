import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { categoryIconMap } from '@/constants/theme';
import { Category } from '@/types/api';

export function CategoryCard({
  category,
  selected,
  onPress,
}: {
  category: Category;
  selected: boolean;
  onPress: () => void;
}) {
  const iconName =
    (categoryIconMap[category.icon] as keyof typeof Ionicons.glyphMap | undefined) ?? 'wallet';

  return (
    <Pressable
      className={`w-[48%] rounded-[28px] border p-4 shadow-card ${
        selected ? 'border-add bg-skySoft' : 'border-white/80 bg-panel/90'
      }`}
      onPress={onPress}>
      <View
        className="h-14 w-14 items-center justify-center rounded-[20px]"
        style={{ backgroundColor: `${category.color}18` }}>
        <Ionicons color={category.color} name={iconName} size={28} />
      </View>
      <Text className="mt-5 text-lg font-black text-ink">{category.name}</Text>
      <Text className="mt-2 text-xs font-black uppercase tracking-[1.1px] text-mute">
        {selected ? 'Selected' : 'Choose'}
      </Text>
    </Pressable>
  );
}
