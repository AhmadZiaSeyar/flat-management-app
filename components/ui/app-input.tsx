import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native';

export function AppInput({
  label,
  icon,
  secureTextEntry = false,
  showPasswordToggle = false,
  ...props
}: TextInputProps & {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  showPasswordToggle?: boolean;
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const canTogglePassword = secureTextEntry || showPasswordToggle;
  const shouldHideText = canTogglePassword && !isPasswordVisible;

  return (
    <View className="gap-2">
      <Text className="text-[11px] font-black uppercase tracking-[1px] text-ink/70">{label}</Text>
      <View className="flex-row items-center rounded-[26px] border border-line/70 bg-white px-4 py-4 shadow-card">
        <View className="h-11 w-11 items-center justify-center rounded-[18px] bg-skySoft/90">
          <Ionicons color="#3B82F6" name={icon} size={20} />
        </View>
        <TextInput
          className="ml-3 flex-1 text-[16px] font-semibold text-ink"
          cursorColor="#2563EB"
          placeholderTextColor="#6B7B93"
          selectionColor="#2563EB"
          secureTextEntry={shouldHideText}
          style={{ color: '#0F1E37', minWidth: 0 }}
          {...props}
        />
        {canTogglePassword ? (
          <Pressable
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            className="ml-3 h-11 w-11 items-center justify-center rounded-[18px] bg-sand"
            onPress={() => setIsPasswordVisible((current) => !current)}>
            <Ionicons
              color="#2563EB"
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
