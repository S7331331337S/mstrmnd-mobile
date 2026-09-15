import { StyleSheet, View } from "react-native";

import { fonts, useTheme, useThemedStyles, type ThemeColors } from "@/theme";

import { ThemedText } from "./themed-text";

/** Use the text wordmark until the locked icon asset is supplied. */
export function Wordmark({ size = 17 }: { size?: number }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.row}>

      <ThemedText
        style={{
          fontFamily: fonts.bold,
          fontSize: size,
          letterSpacing: -size * 0.04,
          color: colors.label,
        }}
      >
        MSTRMND
      </ThemedText>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  mark: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ink,
  },
});
