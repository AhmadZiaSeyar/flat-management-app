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
      className={`w-[48%] rounded-[24px] border p-4 ${
        selected ? 'border-add bg-addSoft' : 'border-line bg-panel'
      }`}
      onPress={onPress}>
      <View
        className="h-14 w-14 items-center justify-center rounded-[18px]"
        style={{ backgroundColor: `${category.color}20` }}>
        <Ionicons color={category.color} name={iconName} size={28} />
      </View>
      <Text className="mt-4 text-lg font-black text-ink">{category.name}</Text>
      <Text className="mt-1 text-sm text-mute">{selected ? 'Ready' : 'Tap to pick'}</Text>
    </Pressable>
  );
}
