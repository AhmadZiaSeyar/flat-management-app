import { Ionicons } from '@expo/vector-icons';
import { Text, TextInput, TextInputProps, View } from 'react-native';

export function AppInput({
  label,
  icon,
  ...props
}: TextInputProps & {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-bold text-slate-700">{label}</Text>
      <View className="flex-row items-center rounded-[22px] border border-line bg-panel px-4 py-4">
        <Ionicons color="#716759" name={icon} size={20} />
        <TextInput
          className="ml-3 flex-1 text-base font-semibold text-ink"
          placeholderTextColor="#9A8E7B"
          {...props}
        />
      </View>
    </View>
  );
}
