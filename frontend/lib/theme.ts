import { request } from '@/lib/api';
import { ThemePalette } from '@/types';

const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/;

export const DEFAULT_THEME: ThemePalette = {
  primary: '#E30613',
  primaryDark: '#B8050F',
  secondary: '#0F4AA6',
  dark: '#071C3A',
  surface: '#F4F6F8',
  muted: '#5B6470',
};

const CSS_VAR_NAMES: Record<keyof ThemePalette, string> = {
  primary: '--color-primary',
  primaryDark: '--color-primary-dark',
  secondary: '--color-secondary',
  dark: '--color-dark',
  surface: '--color-surface',
  muted: '--color-muted',
};

export const isValidHex = (value: unknown): value is string =>
  typeof value === 'string' && HEX_PATTERN.test(value);

export function themeToCssVars(theme: Partial<ThemePalette>): string {
  const declarations = (Object.keys(CSS_VAR_NAMES) as (keyof ThemePalette)[]).map((key) => {
    const value = isValidHex(theme[key]) ? (theme[key] as string) : DEFAULT_THEME[key];
    return `${CSS_VAR_NAMES[key]}:${value};`;
  });
  return `:root{${declarations.join('')}}`;
}

// No revalidate window here on purpose: a published brand color should show
// up on the very next page load, not up to 60s later. `next` must be
// explicitly cleared too — Next.js fetch rejects/ignores `cache: 'no-store'`
// when the shared `request()` helper's default `next: { revalidate: 60 }`
// is still present underneath.
export const getLiveTheme = () => request<ThemePalette>('/theme', { cache: 'no-store', next: undefined });
