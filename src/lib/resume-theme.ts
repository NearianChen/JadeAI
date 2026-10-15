import type { ThemeConfig } from '@/types/resume';

export const MAPLE_FONT_FAMILY = 'Maple Mono NF CN';

export const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#1a1a1a',
  accentColor: '#3b82f6',
  fontFamily: 'Inter',
  fontSize: 'medium',
  lineSpacing: 1.5,
  margin: { top: 20, right: 20, bottom: 20, left: 20 },
  sectionSpacing: 16,
  avatarStyle: 'oneInch',
};

/** Quote a selected family so spaces and CSS metacharacters stay literal. */
export function resumeFontStack(fontFamily: string): string {
  return `${JSON.stringify(fontFamily)}, 'Noto Sans SC', sans-serif`;
}
