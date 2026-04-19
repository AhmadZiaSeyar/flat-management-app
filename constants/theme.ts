export const palette = {
  background: '#F2F6FF',
  surface: '#F7FAFF',
  panel: '#FFFFFF',
  border: '#D6E2F3',
  ink: '#0F1E37',
  muted: '#6B7B93',
  green: '#3B82F6',
  greenSoft: '#D9E7FF',
  red: '#EF4444',
  redSoft: '#FFE3E3',
  yellow: '#F59E0B',
  yellowSoft: '#FFF0CD',
  blue: '#2563EB',
  blueSoft: '#E2ECFF',
  slate: '#31445F',
  shadow: 'rgba(37, 99, 235, 0.14)',
};

export const layout = {
  screenPadding: 20,
  radius: 22,
  pillRadius: 999,
};

export const Colors = {
  light: {
    text: palette.ink,
    background: palette.background,
    tint: palette.green,
    icon: palette.muted,
    tabIconDefault: palette.muted,
    tabIconSelected: palette.green,
  },
  dark: {
    text: palette.ink,
    background: palette.background,
    tint: palette.green,
    icon: palette.muted,
    tabIconDefault: palette.muted,
    tabIconSelected: palette.green,
  },
};

export const Fonts = {
  sans: 'System',
  serif: 'System',
  rounded: 'System',
  mono: 'Courier',
};

export const categoryIconMap: Record<string, string> = {
  restaurant: 'restaurant',
  home: 'home',
  flash: 'flash',
  car: 'car-sport',
  sparkles: 'sparkles',
  wifi: 'wifi',
};

export const navTheme = {
  dark: false,
  colors: {
    primary: palette.green,
    background: palette.background,
    card: palette.panel,
    text: palette.ink,
    border: palette.border,
    notification: palette.red,
  },
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500' as const,
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700' as const,
    },
    heavy: {
      fontFamily: 'System',
      fontWeight: '800' as const,
    },
  },
};
