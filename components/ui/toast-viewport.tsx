import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ToastItem, ToastTone, useToastStore } from '@/store/toast-store';

const toneStyles: Record<
  ToastTone,
  {
    container: string;
    iconWrap: string;
    title: string;
    message: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
  }
> = {
  success: {
    container: 'bg-add',
    iconWrap: 'bg-white/15',
    title: 'text-white',
    message: 'text-white/80',
    icon: 'checkmark-circle',
    iconColor: '#FFFFFF',
  },
  error: {
    container: 'bg-spend',
    iconWrap: 'bg-white/15',
    title: 'text-white',
    message: 'text-white/80',
    icon: 'alert-circle',
    iconColor: '#FFFFFF',
  },
  info: {
    container: 'bg-ink',
    iconWrap: 'bg-white/10',
    title: 'text-white',
    message: 'text-white/75',
    icon: 'information-circle',
    iconColor: '#FFFFFF',
  },
};

export function ToastViewport() {
  const insets = useSafeAreaInsets();
  const toasts = useToastStore((state) => state.toasts);

  if (!toasts.length) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 z-50"
      style={{ top: insets.top + 12 }}>
      <View className="items-center px-5">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} />
        ))}
      </View>
    </View>
  );
}

function ToastCard({ toast }: { toast: ToastItem }) {
  const dismissToast = useToastStore((state) => state.dismissToast);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-16)).current;
  const tone = toneStyles[toast.tone];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        duration: 180,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        duration: 180,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <Animated.View
      className="mb-3 w-full max-w-[440px]"
      style={{ opacity, transform: [{ translateY }] }}>
      <View className={`rounded-[26px] px-4 py-4 shadow-card ${tone.container}`}>
        <View className="flex-row items-start gap-3">
          <View className={`h-12 w-12 items-center justify-center rounded-[18px] ${tone.iconWrap}`}>
            <Ionicons color={tone.iconColor} name={tone.icon} size={24} />
          </View>

          <View className="flex-1">
            <Text className={`text-base font-black ${tone.title}`}>{toast.title}</Text>
            {toast.message ? (
              <Text className={`mt-1 text-sm font-semibold ${tone.message}`}>{toast.message}</Text>
            ) : null}
          </View>

          <Pressable
            accessibilityLabel="Dismiss message"
            className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
            hitSlop={8}
            onPress={() => dismissToast(toast.id)}>
            <Ionicons color="#FFFFFF" name="close" size={18} />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}
