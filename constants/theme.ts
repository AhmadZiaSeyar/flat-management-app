export const palette = {
  background: '#F6EFE4',
  surface: '#FFF9F0',
  panel: '#FFFFFF',
  border: '#E7DCCB',
  ink: '#1F1B16',
  muted: '#716759',
  green: '#16855D',
  greenSoft: '#D9F3E8',
  red: '#D74C3C',
  redSoft: '#FCE2DD',
  yellow: '#D9A21B',
  yellowSoft: '#F9EDCA',
  blue: '#2C69D1',
  blueSoft: '#DAE7FF',
  slate: '#514A42',
  shadow: 'rgba(40, 29, 18, 0.08)',
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
