import { useMemo } from "react";
import { useColorScheme } from "react-native";
import { useSettings } from "@/lib/settings-store";
import { darkColors, darkWash, lightColors, lightWash, type ThemeColors } from "./colors";

export function useTheme() {
  const preference = useSettings((s) => s.appearance);
  const system = useColorScheme();
  const isDark = preference === "dark" || (preference === "system" && system === "dark");
  return { isDark, colors: isDark ? darkColors : lightColors, wash: isDark ? darkWash : lightWash };
}

export function useThemedStyles<T>(factory: (colors: ThemeColors) => T): T {
  const { colors } = useTheme();
  return useMemo(() => factory(colors), [colors, factory]);
}
