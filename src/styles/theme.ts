export type ThemeMode = 'light' | 'dark';

export type ThemeColors = {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  primary: string;
  border: string;
  danger: string;
  success: string;
  inputBackground?: string;
  textMuted?: string;
};

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  radius: {
    sm: number;
    md: number;
    lg: number;
  };
}

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    background: '#FFFFFF',
    card: '#F1F5F9',
    text: '#0F172A',
    textSecondary: '#475569',
    primary: '#F97316',
    border: '#999999ff',
    danger: '#EF4444',
    success: '#22C55E',
    inputBackground: '#FFFFFF',
    textMuted: '#94A3B8',
  },
  radius: { sm: 6, md: 10, lg: 16 },
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    background: '#080c16ff',
    card: '#0f1525ff',
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    primary: '#F97316',
    border: '#000000ff',
    danger: '#EF4444',
    success: '#22C55E',
    inputBackground: '#1E293B',
    textMuted: '#64748B',
  },
  radius: { sm: 6, md: 10, lg: 16 },
};
