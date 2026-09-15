import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/button";
import { Screen } from "@/components/screen";
import { ThemedText } from "@/components/themed-text";
import { useHaptics } from "@/hooks/use-haptics";
import { useSessions } from "@/lib/session-store";
import { MODELS, useSettings } from "@/lib/settings-store";
import { fonts, radius, shadows, spacing, useTheme, useThemedStyles, type ThemeColors } from "@/theme";

export function Settings() {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();

  const { apiKey, model, depth, appearance, setAppearance, haptics: hapticsOn } = useSettings();
  const [confirmingClear, setConfirmingClear] = useState(false);
  const { setApiKey, setModel, setDepth, setHaptics } = useSettings();
  const clearSessions = useSessions((s) => s.clear);
  const sessionCount = useSessions((s) => s.sessions.length);

  const [draftKey, setDraftKey] = useState("");
  const [saving, setSaving] = useState(false);

  const saveKey = async () => {
    setSaving(true);
    await setApiKey(draftKey);
    setSaving(false);
    setDraftKey("");
    haptics.success();
  };

  const removeKey = async () => {
    await setApiKey(null);
    haptics.warn();
  };


  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + 100 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ThemedText variant="largeTitle">Settings</ThemedText>

        <Section title="Appearance">
          <View style={{ flexDirection: "row", gap: spacing.sm }}>
            {([ { id: "dark", label: "Dark", icon: "moon-outline" }, { id: "light", label: "Light", icon: "sunny-outline" }, { id: "system", label: "System", icon: "phone-portrait-outline" } ] as const).map((option) => <Pressable key={option.id} accessibilityRole="radio" accessibilityState={{ selected: appearance === option.id }} onPress={() => setAppearance(option.id)} style={({ pressed }) => [styles.option, { flex: 1, flexDirection: "column", borderColor: appearance === option.id ? colors.label : colors.hairline, opacity: pressed ? 0.65 : 1 }]}><Ionicons name={option.icon} color={colors.label} size={20} /><ThemedText variant="caption">{option.label}</ThemedText></Pressable>)}
          </View>
        </Section>

        <Section title="Intelligence">
          {apiKey ? (
            <View style={styles.keyActive}>
              <View style={styles.keyRow}>
                <Ionicons name="shield-checkmark" size={18} color={colors.ink} />
                <View style={styles.flex}>
                  <ThemedText variant="headline">Claude key added</ThemedText>
                  <ThemedText variant="caption" style={styles.mask}>
                    {maskKey(apiKey)}
                  </ThemedText>
                </View>
              </View>
              <Button title="Remove key" variant="ghost" size="sm" onPress={() => void removeKey()} />
            </View>
          ) : (
            <View style={styles.keyForm}>
              <ThemedText variant="subhead">
                Without a key the app runs an offline board — scripted stand-ins that
                demonstrate the format but cannot reason about your question.
              </ThemedText>
              <TextInput
                value={draftKey}
                onChangeText={setDraftKey}
                accessibilityLabel="Claude API key"
                placeholder="sk-ant-…"
                placeholderTextColor={colors.tertiaryLabel}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                style={styles.input}
              />
              <Button
                title="Connect"
                size="sm"
                loading={saving}
                disabled={draftKey.trim().length < 10}
                onPress={() => void saveKey()}
              />
              <ThemedText variant="caption" style={styles.fine}>
                {Platform.OS === "web"
                  ? "On web, your key stays in memory until you refresh or close the app. API usage is billed to your Anthropic account."
                  : "Your key stays in the device keychain. Questions and included personal context are sent to Anthropic. API usage is billed to your account."}
              </ThemedText>
            </View>
          )}
        </Section>

        <Section title="Model">
          {MODELS.map((option) => {
            const active = option.id === model;
            return (
              <Pressable
                key={option.id}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                onPress={() => {
                  haptics.select();
                  setModel(option.id);
                }}
                style={({ pressed }) => [
                  styles.option,
                  active && styles.optionActive,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.flex}>
                  <ThemedText variant="headline">{option.label}</ThemedText>
                  <ThemedText variant="caption">{option.hint}</ThemedText>
                </View>
                {active ? (
                  <Ionicons name="checkmark-circle" size={20} color={colors.ink} />
                ) : null}
              </Pressable>
            );
          })}
        </Section>

        <Section title="Format">
          {(
            [
              { id: "full", label: "Full debate", hint: "Openings, crossfire, then the ruling." },
              { id: "quick", label: "Quick round", hint: "Openings and the ruling. Faster, cheaper." },
            ] as const
          ).map((option) => {
            const active = option.id === depth;
            return (
              <Pressable
                key={option.id}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                onPress={() => {
                  haptics.select();
                  setDepth(option.id);
                }}
                style={({ pressed }) => [
                  styles.option,
                  active && styles.optionActive,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.flex}>
                  <ThemedText variant="headline">{option.label}</ThemedText>
                  <ThemedText variant="caption">{option.hint}</ThemedText>
                </View>
                {active ? (
                  <Ionicons name="checkmark-circle" size={20} color={colors.ink} />
                ) : null}
              </Pressable>
            );
          })}
        </Section>

        <Section title="Feel">
          <View style={styles.option}>
            <View style={styles.flex}>
              <ThemedText variant="headline">Haptics</ThemedText>
              <ThemedText variant="caption">A tap as each member finishes speaking.</ThemedText>
            </View>
            <Switch
              value={hapticsOn}
              onValueChange={setHaptics}
              trackColor={{ true: colors.ink, false: colors.ink200 }}
              thumbColor={colors.white}
            />
          </View>
        </Section>

        <Section title="Data">
          <View style={styles.option}>
            <View style={styles.flex}>
              <ThemedText variant="headline">Stored sessions</ThemedText>
              <ThemedText variant="caption">
                {sessionCount === 0
                  ? "No sessions saved on this device."
                  : `${sessionCount} saved on this device. Live sessions send your question and context to Anthropic.`}
              </ThemedText>
            </View>
          </View>
          <Button
            title="Delete all sessions"
            variant="ghost"
            size="sm"
            disabled={sessionCount === 0}
            onPress={() => setConfirmingClear(true)}
          />
          {confirmingClear ? <View style={styles.keyForm}><ThemedText variant="headline">Delete all {sessionCount} sessions?</ThemedText><ThemedText variant="subhead">This removes your saved conversations and next moves from this device.</ThemedText><Button title="Keep my sessions" variant="secondary" onPress={() => setConfirmingClear(false)} /><Button title="Confirm delete" variant="ghost" onPress={() => { clearSessions(); setConfirmingClear(false); }} /></View> : null}
        </Section>

        <ThemedText variant="caption" style={styles.footer}>
          MSTRMND / Personal AI · 1.1.0
        </ThemedText>
      </ScrollView>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.section}>
      <ThemedText variant="overline">{title}</ThemedText>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

/** Show enough of the key to recognise it, never enough to use it. */
function maskKey(key: string): string {
  if (key.length <= 12) return "•".repeat(key.length);
  return `${key.slice(0, 7)}…${key.slice(-4)}`;
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xl,
  },
  flex: { flex: 1, gap: 2 },
  section: {
    gap: spacing.md,
  },
  sectionBody: {
    gap: spacing.sm,
  },
  keyActive: {
    gap: spacing.md,
    backgroundColor: colors.surfaceSunken,
    borderRadius: radius.lg,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    padding: spacing.lg,
  },
  keyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  mask: {
    fontFamily: fonts.medium,
    color: colors.tertiaryLabel,
  },
  keyForm: {
    boxShadow: shadows.card,
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    padding: spacing.lg,
  },
  input: {
    backgroundColor: colors.canvas,
    borderRadius: radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    color: colors.label,
    fontFamily: fonts.medium,
    fontSize: 14,
  },
  fine: {
    color: colors.tertiaryLabel,
  },
  option: {
    boxShadow: shadows.card,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  optionActive: {
    borderColor: colors.hairlineStrong,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.7,
  },
  footer: {
    textAlign: "center",
    color: colors.tertiaryLabel,
    marginTop: spacing.lg,
  },
});
