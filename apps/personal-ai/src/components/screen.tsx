import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { useTheme, useThemedStyles, type ThemeColors } from "@/theme";

/**
 * Shared page ground.
 *
 * A single soft gradient bleeds down from the top — the monochrome substitute
 * for a colored glow. It's barely perceptible on its own; what it does is stop
 * a large flat field from looking like undesigned default grey.
 */
export function Screen({ children }: { children: ReactNode }) {
  const { colors, wash } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[...wash]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.wash}
        pointerEvents="none"
      />
      {children}
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  wash: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 420,
  },
});
