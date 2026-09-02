/** MSTRMND v1 monochrome tokens. Keep semantic values theme-aware. */
export const palette = {
  black: '#000000',
  white: '#FFFFFF',
  light: { background: '#F7F7F5', surface: '#FFFFFF', raised: '#F1F1EF', foreground: '#111111', muted: '#666666', subtle: '#969696', line: '#D9D9D6', lineStrong: '#BDBDBA' },
  dark: { background: '#050505', surface: '#0B0B0B', raised: '#111111', foreground: '#F5F5F5', muted: '#A3A3A3', subtle: '#707070', line: '#292929', lineStrong: '#444444' },
  metallic: ['#FFFFFF', '#BFC1C3', '#F4F4F4'],
  status: { warning: '#B7791F', danger: '#B42318', success: '#3F6B4A' },
} as const;

export const radii = { sm: 8, md: 10, lg: 14, pill: 999 } as const;
export const spacing = { '2xs': 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 24, '2xl': 32, '3xl': 40, '4xl': 48, '5xl': 64, '6xl': 80 } as const;
export const motion = { instant: 90, fast: 150, base: 220, slow: 340 } as const;
export const iconSize = { xs: 14, sm: 16, md: 20, lg: 24, xl: 32 } as const;
export const border = { width: 1 } as const;
export const touchTarget = 44;

export type Palette = typeof palette;
