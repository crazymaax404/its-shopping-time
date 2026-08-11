export { colors } from './colors';
export type { ColorKey } from './colors';

export const fontFamily = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semiBold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extraBold: 'PlusJakartaSans_800ExtraBold',
} as const;

export type FontFamilyKey = keyof typeof fontFamily;

export const fontWeightToFamily: Record<string, string> = {
  '400': fontFamily.regular,
  '500': fontFamily.medium,
  '600': fontFamily.semiBold,
  '700': fontFamily.bold,
  '800': fontFamily.extraBold,
};
