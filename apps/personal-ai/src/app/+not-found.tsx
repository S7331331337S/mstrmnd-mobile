import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

import { Screen } from "@/components/screen";
import { ThemedText } from "@/components/themed-text";
import { spacing, useTheme, useThemedStyles, type ThemeColors } from "@/theme";

export default function NotFound() {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <Screen>
      <View style={styles.root}>
        <ThemedText variant="title">Nothing here.</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText variant="headline" style={{ color: colors.label }}>
            Back to the table
          </ThemedText>
        </Link>
      </View>
    </Screen>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
  },
  link: {
    padding: spacing.md,
  },
});
