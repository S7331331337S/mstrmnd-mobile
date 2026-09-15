import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Switch, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/button";
import { Screen } from "@/components/screen";
import { ThemedText } from "@/components/themed-text";
import { usePersonal, type PersonalProfile } from "@/lib/personal-store";
import { fonts, spacing, radius, useTheme, useThemedStyles, type ThemeColors } from "@/theme";

const FIELDS = [
  { key: "name", label: "What should we call you?", placeholder: "Your name", max: 40 },
  { key: "focus", label: "My focus right now", placeholder: "The one thing I want to move forward this week…", max: 300 },
  { key: "ambition", label: "The bigger picture", placeholder: "What I’m building toward in life or work…", max: 1000 },
  { key: "context", label: "A little about me", placeholder: "My work, experience, projects, and what matters to me…", max: 2000 },
  { key: "constraints", label: "My non-negotiables", placeholder: "Time, resources, commitments, or boundaries…", max: 1000 },
] as const;

export function Personal() {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const stored = usePersonal((s) => s.profile);
  const update = usePersonal((s) => s.updateProfile);
  const [draft, setDraft] = useState<PersonalProfile>(stored);
  const [saved, setSaved] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(stored);
  function edit(key: keyof PersonalProfile, value: string | boolean) { setDraft((s) => ({ ...s, [key]: value })); setSaved(false); }
  return <Screen><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}><ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + 110 }]}>
    <View style={styles.heading}><View style={styles.identity}><Ionicons name="finger-print-outline" size={28} color={colors.label} /></View><ThemedText variant="overline">PERSONAL BY DESIGN</ThemedText><ThemedText variant="largeTitle">Your context. Your direction.</ThemedText><ThemedText variant="subhead">The more your board understands you, the more useful its perspective can be.</ThemedText></View>
    {FIELDS.map((f) => <View key={f.key} style={styles.field}><ThemedText variant="headline">{f.label}</ThemedText><TextInput accessibilityLabel={f.label} value={draft[f.key]} onChangeText={(v) => edit(f.key, v)} placeholder={f.placeholder} placeholderTextColor={colors.tertiaryLabel} maxLength={f.max} multiline={f.key !== "name"} style={[styles.input, f.key !== "name" && styles.multiline]} /></View>)}
    <View style={styles.preference}><View style={{ flex: 1, gap: spacing.xs }}><ThemedText variant="headline">Bring my context to the board</ThemedText><ThemedText variant="caption">Included in new sessions. With Claude connected, this context is sent to Anthropic along with your question.</ThemedText></View><Switch accessibilityLabel="Bring my context to the board" value={draft.useInSessions} onValueChange={(v) => edit("useInSessions", v)} trackColor={{ true: colors.ink, false: colors.ink200 }} thumbColor={colors.white} /></View>
    <Button title={saved && !dirty ? "Context saved" : "Save my context"} onPress={() => { update(draft); setSaved(true); }} disabled={!dirty && !saved} size="lg" />
    {saved && !dirty ? <ThemedText accessibilityLiveRegion="polite" variant="caption" style={{ textAlign: "center" }}>Ready for your next session.</ThemedText> : null}
    <View style={styles.inline}><Ionicons name="phone-portrait-outline" size={15} color={colors.tertiaryLabel} /><ThemedText variant="caption" style={{ flex: 1 }}>Stored on this device. Edit or clear these fields whenever you like.</ThemedText></View>
  </ScrollView></KeyboardAvoidingView></Screen>;
}
const makeStyles = (c: ThemeColors) => StyleSheet.create({
  content: { paddingHorizontal: spacing.xl, gap: spacing.xl },
  heading: { gap: spacing.md },
  identity: { width: 58, height: 58, borderRadius: radius.lg, borderWidth: 1, borderColor: c.hairlineStrong, alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  field: { gap: spacing.md },
  input: { color: c.label, backgroundColor: c.surface, borderWidth: 1, borderColor: c.hairline, borderRadius: radius.md, padding: spacing.lg, fontFamily: fonts.regular, fontSize: 16, lineHeight: 24, minHeight: 52 },
  multiline: { minHeight: 104, textAlignVertical: "top" },
  preference: { flexDirection: "row", alignItems: "center", gap: spacing.lg, paddingVertical: spacing.lg, borderTopWidth: 1, borderBottomWidth: 1, borderColor: c.hairline },
  inline: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
});
