import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ToastItem, ToastTone, useToastStore } from '@/store/toast-store';

const toneStyles: Record<
  ToastTone,
  {
    accent: string;
    glow: string;
    iconWrap: string;
    iconColor: string;
    pillBackground: string;
    pillText: string;
    title: string;
    message: string;
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
  }
> = {
  success: {
    accent: '#10B981',
    glow: 'rgba(16, 185, 129, 0.18)',
    iconWrap: 'rgba(16, 185, 129, 0.14)',
    iconColor: '#059669',
    pillBackground: 'rgba(16, 185, 129, 0.12)',
    pillText: '#047857',
    title: 'text-ink',
    message: 'text-mute',
    icon: 'checkmark-circle',
    label: 'Success',
  },
  error: {
    accent: '#EF4444',
    glow: 'rgba(239, 68, 68, 0.18)',
    iconWrap: 'rgba(239, 68, 68, 0.14)',
    iconColor: '#DC2626',
    pillBackground: 'rgba(239, 68, 68, 0.12)',
    pillText: '#B91C1C',
    title: 'text-ink',
    message: 'text-mute',
    icon: 'alert-circle',
    label: 'Error',
  },
  info: {
    accent: '#2563EB',
    glow: 'rgba(37, 99, 235, 0.18)',
    iconWrap: 'rgba(37, 99, 235, 0.14)',
    iconColor: '#1D4ED8',
    pillBackground: 'rgba(37, 99, 235, 0.12)',
    pillText: '#1D4ED8',
    title: 'text-ink',
    message: 'text-mute',
    icon: 'information-circle',
    label: 'Notice',
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
  const scale = useRef(new Animated.Value(0.96)).current;
  const tone = toneStyles[toast.tone];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        duration: 220,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        damping: 16,
        mass: 0.9,
        stiffness: 180,
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        damping: 16,
        mass: 0.8,
        stiffness: 220,
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale, translateY]);

  return (
    <Animated.View
      className="mb-3 w-full max-w-[440px]"
      style={{ opacity, transform: [{ translateY }, { scale }] }}>
      <View
        className="overflow-hidden rounded-[30px] border"
        style={{
          backgroundColor: Platform.select({
            web: 'rgba(255, 255, 255, 0.72)',
            default: 'rgba(255, 255, 255, 0.78)',
          }),
          borderColor: 'rgba(255, 255, 255, 0.58)',
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.16,
          shadowRadius: 30,
          elevation: 12,
        }}>
        <LinearGradient
          colors={['rgba(255,255,255,0.82)', 'rgba(255,255,255,0.56)']}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          <View
            className="absolute -right-8 -top-10 h-32 w-32 rounded-full"
            style={{ backgroundColor: tone.glow }}
          />
          <View
            className="absolute left-5 right-5 top-0 h-[1px]"
            style={{ backgroundColor: 'rgba(255,255,255,0.68)' }}
          />

          <View className="flex-row items-start gap-3">
            <View
              className="h-12 w-12 items-center justify-center rounded-[18px]"
              style={{ backgroundColor: tone.iconWrap }}>
              <Ionicons color={tone.iconColor} name={tone.icon} size={24} />
            </View>

            <View className="flex-1">
              <View
                className="self-start rounded-full px-3 py-1"
                style={{ backgroundColor: tone.pillBackground }}>
                <Text className="text-[11px] font-black uppercase tracking-[1.6px]" style={{ color: tone.pillText }}>
                  {tone.label}
                </Text>
              </View>

              <Text className={`mt-3 text-base font-black ${tone.title}`}>{toast.title}</Text>
              {toast.message ? (
                <Text className={`mt-1 text-sm font-semibold ${tone.message}`}>{toast.message}</Text>
              ) : null}
            </View>

            <Pressable
              accessibilityLabel="Dismiss message"
              className="h-10 w-10 items-center justify-center rounded-full"
              hitSlop={8}
              onPress={() => dismissToast(toast.id)}
              style={{ backgroundColor: 'rgba(148, 163, 184, 0.14)' }}>
              <Ionicons color="#475569" name="close" size={18} />
            </Pressable>
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );
}
