export const colors = {
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  primarySoft: '#DBEAFE',
  primaryMuted: '#BFDBFE',

  navy: '#1E293B',
  navyDeep: '#1e2533',
  navySoft: '#334155',

  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textOnDark: '#FFFFFF',
  textOnDarkMuted: '#94A3B8',

  background: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceAlt: '#F1F5F9',

  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  success: '#22C55E',
  danger: '#DC2626',
  warning: '#F59E0B',

  priceInput: '#166534',

  tabInactive: '#94A3B8',
  overlay: 'rgba(15, 23, 42, 0.45)',
} as const;

export type ColorKey = keyof typeof colors;
