/** MSTRMND: true monochrome, with intentional light and dark pairs. */
export const lightColors = {
  ink: "#101010", ink800: "#282828", ink600: "#555555", ink500: "#686868",
  ink400: "#777777", ink300: "#AAAAAA", ink200: "#D8D8D8", ink100: "#EBEBEB",
  ink50: "#F3F3F3", paper: "#FAFAFA", white: "#FFFFFF",
  canvas: "#FAFAFA", surface: "#FFFFFF", surfaceSunken: "#F1F1F1", surfaceInverse: "#101010",
  hairline: "#E6E6E6", hairlineStrong: "#C9C9C9",
  label: "#101010", secondaryLabel: "#646464", tertiaryLabel: "#777777", quaternaryLabel: "#AAAAAA",
  onInk: "#FFFFFF", onInkMuted: "#BDBDBD",
};
export type ThemeColors = typeof lightColors;
export const darkColors: ThemeColors = {
  ink: "#F5F5F5", ink800: "#DDDDDD", ink600: "#BBBBBB", ink500: "#AAAAAA",
  ink400: "#999999", ink300: "#696969", ink200: "#3C3C3C", ink100: "#252525",
  ink50: "#1A1A1A", paper: "#0C0C0C", white: "#0C0C0C",
  canvas: "#0C0C0C", surface: "#151515", surfaceSunken: "#202020", surfaceInverse: "#EFEFEF",
  hairline: "#2A2A2A", hairlineStrong: "#474747",
  label: "#F5F5F5", secondaryLabel: "#B0B0B0", tertiaryLabel: "#929292", quaternaryLabel: "#696969",
  onInk: "#101010", onInkMuted: "#525252",
};
export const lightWash = ["#FFFFFFFF", "#FFFFFF00"] as const;
export const darkWash = ["#181818B0", "#18181800"] as const;
/** Static palette is for token definitions only. Components use useTheme(). */
export const colors = lightColors;
export const wash = lightWash;
export function alpha(amount: number, hex: string = "#101010"): string {
  return `${hex}${Math.round(Math.max(0, Math.min(1, amount)) * 255).toString(16).padStart(2, "0")}`;
}
