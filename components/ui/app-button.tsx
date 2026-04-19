import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text } from 'react-native';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

const containerStyles: Record<Variant, string> = {
  primary: 'bg-add shadow-card',
  secondary: 'bg-panel border border-line',
  danger: 'bg-spend shadow-card',
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
      className={`overflow-hidden rounded-[22px] ${containerStyles[variant]} ${disabled ? 'opacity-50' : ''}`}
      disabled={disabled}
      onPress={onPress}>
      {variant === 'primary' ? (
        <LinearGradient
          colors={['#4C8DFF', '#2563EB', '#1E40AF']}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={{ paddingHorizontal: 20, paddingVertical: 18 }}>
          <Text className={`text-center text-base font-extrabold ${textStyles[variant]}`}>
            {label}
          </Text>
        </LinearGradient>
      ) : (
        <Text className={`px-5 py-4 text-center text-base font-extrabold ${textStyles[variant]}`}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
