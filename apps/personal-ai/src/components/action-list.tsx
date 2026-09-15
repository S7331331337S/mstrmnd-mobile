import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, View } from "react-native";
import { useSessions } from "@/lib/session-store";
import { ThemedText } from "./themed-text";
import { radius, spacing, useTheme, useThemedStyles, type ThemeColors } from "@/theme";

export function ActionList({ sessionId }: { sessionId: string }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const actions = useSessions((s) => s.sessions.find((x) => x.id === sessionId)?.actions);
  const toggle = useSessions((s) => s.toggleAction);
  return <View style={{ gap: spacing.sm }}>{actions?.map((a) => <Pressable key={a.id} accessibilityRole="checkbox" accessibilityLabel={a.text} accessibilityState={{ checked: a.done }} onPress={() => toggle(sessionId, a.id)} style={({ pressed }) => [styles.row, { opacity: pressed ? 0.65 : 1 }]}>
    <View style={[styles.check, a.done && { backgroundColor: colors.ink, borderColor: colors.ink }]}>{a.done ? <Ionicons name="checkmark" size={15} color={colors.onInk} /> : null}</View>
    <ThemedText variant="subhead" style={{ flex: 1, color: a.done ? colors.tertiaryLabel : colors.label, textDecorationLine: a.done ? "line-through" : "none" }}>{a.text}</ThemedText>
  </Pressable>)}</View>;
}
const makeStyles = (c: ThemeColors) => StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.md, alignItems: "flex-start", minHeight: 44, paddingVertical: spacing.sm },
  check: { width: 23, height: 23, borderRadius: radius.sm, borderWidth: 1, borderColor: c.hairlineStrong, justifyContent: "center", alignItems: "center" },
});
