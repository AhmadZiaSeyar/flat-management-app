import { Pressable, Text } from 'react-native';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

const containerStyles: Record<Variant, string> = {
  primary: 'bg-add',
  secondary: 'bg-panel border border-line',
  danger: 'bg-spend',
  ghost: 'bg-transparent',
};

const textStyles: Record<Variant, string> = {
  primary: 'text-white',
  secondary: 'text-ink',
  danger: 'text-white',
  ghost: 'text-mute',
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
}) {
  return (
    <Pressable
      className={`items-center justify-center rounded-[20px] px-5 py-4 ${
        containerStyles[variant]
      } ${disabled ? 'opacity-50' : ''}`}
      disabled={disabled}
      onPress={onPress}>
      <Text className={`text-base font-extrabold ${textStyles[variant]}`}>{label}</Text>
    </Pressable>
  );
}
