import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PRESETS, SEATABLE_AGENTS, getAgent, type AgentId } from "@/agents/roster";
import { AgentAvatar } from "@/components/agent-avatar";
import { Screen } from "@/components/screen";
import { ThemedText } from "@/components/themed-text";
import { Wordmark } from "@/components/wordmark";
import { useHaptics } from "@/hooks/use-haptics";
import { usePersonal, personalContext } from "@/lib/personal-store";
import { useSessions } from "@/lib/session-store";
import { useSettings } from "@/lib/settings-store";
import { fonts, radius, spacing, useTheme, useThemedStyles, type ThemeColors } from "@/theme";
import { ActionList } from "@/components/action-list";
import { SeatPicker } from "./seat-picker";

const STARTERS = [
  { icon: "compass-outline", label: "Find my focus", topic: "Help me choose the one thing to focus on this week and what to stop doing." },
  { icon: "bulb-outline", label: "Test an idea", topic: "Pressure-test my new idea. What assumptions should I challenge before I commit?" },
  { icon: "git-branch-outline", label: "Make a decision", topic: "Help me work through a difficult decision. Start by identifying the tradeoffs and missing information." },
] as const;

export function Table() {
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const haptics = useHaptics();
  const field = useRef<TextInput>(null);
  const hasKey = useSettings((s) => Boolean(s.apiKey));
  const { depth, setDepth, setAppearance } = useSettings();
  const profile = usePersonal((s) => s.profile);
  const sessions = useSessions((s) => s.sessions);
  const createSession = useSessions((s) => s.create);
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [showSeats, setShowSeats] = useState(false);
  const [presetId, setPresetId] = useState(PRESETS[0].id);
  const [members, setMembers] = useState<AgentId[]>(PRESETS[0].members);
  const [starting, setStarting] = useState(false);
  const canStart = topic.trim().length >= 8 && members.length > 0 && !starting;
  const activePreset = PRESETS.find((p) => p.id === presetId);
  const actionSessions = sessions.filter((s) => s.actions?.length).slice(0, 3);
  const pendingCount = sessions.flatMap((s) => s.actions ?? []).filter((a) => !a.done).length;
  const turnCount = members.length * (depth === "full" && members.length > 1 ? 2 : 1) + 1;
  const date = new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  function start() {
    if (!canStart) return;
    setStarting(true);
    haptics.heavy();
    const personal = personalContext(profile);
    const combined = [personal && `MY PERSONAL CONTEXT\n${personal}`, context.trim() && `FOR THIS SESSION\n${context.trim()}`].filter(Boolean).join("\n\n");
    const session = createSession({ topic, context: combined, members });
    setTopic("");
    setContext("");
    setStarting(false);
    router.push(`/room/${session.id}`);
  }

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + 100 }]}>
          <View style={styles.masthead}>
            <Wordmark size={19} />
            <Pressable accessibilityRole="button" accessibilityLabel={isDark ? "Switch to light mode" : "Switch to dark mode"} onPress={() => setAppearance(isDark ? "light" : "dark")} style={({ pressed }) => [styles.iconButton, { opacity: pressed ? 0.6 : 1 }]}>
              <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={20} color={colors.label} />
            </Pressable>
          </View>

          <View style={styles.intro}>
            <View style={styles.between}><ThemedText variant="overline">YOUR PERSONAL MASTERMIND</ThemedText><ThemedText variant="caption">{date}</ThemedText></View>
            <ThemedText variant="hero" style={styles.greeting}>What’s on your{"\n"}mind, {profile.name.trim().split(" ")[0] || "Master"}?</ThemedText>
            <ThemedText variant="subhead">A little perspective. A clearer next move.</ThemedText>
          </View>

          <View style={styles.composer}>
            <View style={styles.between}>
              <View style={styles.inline}><View style={styles.dot} /><ThemedText variant="overline">{hasKey ? "YOUR BOARD IS READY" : "EXPLORE YOUR BOARD"}</ThemedText></View>
              <ThemedText variant="caption">{hasKey ? "Claude" : "Demo"}</ThemedText>
            </View>
            <TextInput ref={field} accessibilityLabel="Your question for the board" value={topic} onChangeText={setTopic} multiline maxLength={400} placeholder="An idea, a crossroads, or something you can’t stop thinking about…" placeholderTextColor={colors.tertiaryLabel} style={styles.topicInput} />
            {showContext ? <TextInput accessibilityLabel="Context for this session" value={context} onChangeText={setContext} multiline maxLength={2000} placeholder="What should the board know? Add details, numbers, or constraints." placeholderTextColor={colors.tertiaryLabel} style={styles.contextInput} /> : null}
            <View style={styles.composerFoot}>
              <Pressable accessibilityRole="button" accessibilityState={{ expanded: showContext }} onPress={() => setShowContext(!showContext)} style={({ pressed }) => [styles.inline, { minHeight: 44, opacity: pressed ? 0.6 : 1 }]}>
                <Ionicons name={showContext ? "remove" : "add"} size={18} color={colors.secondaryLabel} />
                <ThemedText variant="caption">Add context</ThemedText>
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel="Start mastermind session" accessibilityState={{ disabled: !canStart }} disabled={!canStart} onPress={start} style={({ pressed }) => [styles.start, { opacity: !canStart ? 0.5 : pressed ? 0.8 : 1 }]}>
                <ThemedText variant="headline" style={{ color: colors.onInk }}>Let’s think</ThemedText>
                <Ionicons name="arrow-up" size={19} color={colors.onInk} />
              </Pressable>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.starters}>
            {STARTERS.map((starter) => <Pressable key={starter.label} accessibilityRole="button" onPress={() => { setTopic(starter.topic); field.current?.focus(); haptics.tap(); }} style={({ pressed }) => [styles.starter, { opacity: pressed ? 0.6 : 1 }]}><Ionicons name={starter.icon} color={colors.secondaryLabel} size={15} /><ThemedText variant="caption">{starter.label}</ThemedText></Pressable>)}
          </ScrollView>

          {!hasKey ? <Pressable accessibilityRole="button" onPress={() => router.push("/settings")} style={styles.demoNotice}><Ionicons name="information-circle-outline" size={15} color={colors.tertiaryLabel} /><ThemedText variant="caption" style={{ flex: 1 }}>Demo uses scripted responses. Connect Claude for live thinking.</ThemedText><Ionicons name="arrow-forward" size={16} color={colors.tertiaryLabel} /></Pressable> : null}

          <View style={styles.section}>
            <View style={styles.between}><ThemedText variant="title">At your table</ThemedText><Pressable accessibilityRole="button" accessibilityState={{ expanded: showSeats }} onPress={() => setShowSeats(!showSeats)} style={styles.textButton}><ThemedText variant="caption">{showSeats ? "Done" : "Customize"}</ThemedText><Ionicons name={showSeats ? "checkmark" : "options-outline"} color={colors.secondaryLabel} size={15} /></Pressable></View>
            <View style={styles.boardCard}>
              <View style={styles.between}><View style={styles.inline}><Ionicons name={(activePreset?.icon || "people-outline") as never} color={colors.label} size={17} /><ThemedText variant="headline">{activePreset?.name || "Your custom board"}</ThemedText></View><ThemedText variant="caption">{members.length} minds + Chair</ThemedText></View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bench}>
                {members.map((id) => { const agent = getAgent(id); return <Pressable key={id} accessibilityRole="button" accessibilityLabel={`About ${agent.name}`} onPress={() => router.push(`/agent/${id}`)} style={({ pressed }) => [styles.member, { opacity: pressed ? 0.6 : 1 }]}><AgentAvatar agent={agent} size="md" /><ThemedText variant="caption">{agent.name.replace("The ", "")}</ThemedText></Pressable>; })}
                {!members.length ? <ThemedText variant="subhead">Choose at least one specialist below.</ThemedText> : null}
              </ScrollView>
              <View style={styles.formatRow}><View style={styles.inline}>{(["quick", "full"] as const).map((d) => <Pressable key={d} accessibilityRole="radio" accessibilityState={{ selected: depth === d }} onPress={() => setDepth(d)} style={[styles.format, depth === d && { backgroundColor: colors.surfaceSunken }]}><ThemedText variant="caption" style={{ color: depth === d ? colors.label : colors.tertiaryLabel }}>{d === "quick" ? "Quick round" : "Full debate"}</ThemedText></Pressable>)}</View><ThemedText variant="caption">{turnCount} turns</ThemedText></View>
            </View>
            {showSeats ? <SeatPicker agents={SEATABLE_AGENTS} presets={PRESETS} presetId={presetId} members={members} onPreset={(id) => { const p = PRESETS.find((x) => x.id === id); if (p) { setPresetId(id); setMembers(p.members); } }} onToggle={(id) => { setPresetId("custom"); setMembers((m) => m.includes(id) ? m.filter((x) => x !== id) : [...m, id]); }} /> : null}
          </View>

          <Pressable accessibilityRole="button" onPress={() => router.push("/personal")} style={({ pressed }) => [styles.focusCard, { opacity: pressed ? 0.65 : 1 }]}>
            <View style={styles.focusIcon}><Ionicons name="scan-outline" size={23} color={colors.label} /></View>
            <View style={{ flex: 1, gap: spacing.xs }}><ThemedText variant="overline">YOUR FOCUS</ThemedText><ThemedText variant="headline" numberOfLines={2}>{profile.focus || "What are you working toward?"}</ThemedText><ThemedText variant="caption">{profile.focus ? (profile.useInSessions ? "Included in your next session" : "Personal context is paused") : "Give your board a little context."}</ThemedText></View>
            <Ionicons name="arrow-forward" size={19} color={colors.secondaryLabel} />
          </Pressable>

          <View style={styles.section}>
            <View style={styles.between}><ThemedText variant="title">Your next moves</ThemedText><ThemedText variant="caption">{pendingCount ? `${pendingCount} open` : "One step at a time"}</ThemedText></View>
            {actionSessions.length ? actionSessions.map((s) => <View key={s.id} style={styles.actionCard}><Pressable accessibilityRole="button" onPress={() => router.push(`/room/${s.id}`)}><ThemedText variant="caption" numberOfLines={1}>{s.engine === "demo" ? "DEMO · " : ""}{s.topic}</ThemedText></Pressable><ActionList sessionId={s.id} /></View>) : <View style={styles.empty}><Ionicons name="checkmark-done-outline" size={23} color={colors.tertiaryLabel} /><ThemedText variant="subhead" style={{ flex: 1 }}>The Chair’s next steps will land here after your first session.</ThemedText></View>}
          </View>

          {sessions.length ? <View style={styles.section}><View style={styles.between}><ThemedText variant="title">Recent thinking</ThemedText><Pressable accessibilityRole="button" onPress={() => router.push("/sessions")} style={styles.textButton}><ThemedText variant="caption">View all</ThemedText><Ionicons name="arrow-forward" size={15} color={colors.secondaryLabel} /></Pressable></View>{sessions.slice(0, 2).map((s) => <Pressable key={s.id} accessibilityRole="button" onPress={() => router.push(`/room/${s.id}`)} style={({ pressed }) => [styles.recent, { opacity: pressed ? 0.6 : 1 }]}><Ionicons name="chatbubbles-outline" size={21} color={colors.tertiaryLabel} /><View style={{ flex: 1, gap: spacing.xs }}><ThemedText variant="headline" numberOfLines={2}>{s.topic}</ThemedText><ThemedText variant="caption">{s.engine === "demo" ? "Demo · " : ""}{s.status === "complete" ? "Decision ready" : s.status}</ThemedText></View><Ionicons name="chevron-forward" size={16} color={colors.tertiaryLabel} /></Pressable>)}</View> : null}
          <ThemedText variant="overline" style={styles.footer}>INDEPENDENT MINDS. SHARED MOMENTUM.</ThemedText>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const makeStyles = (c: ThemeColors) => StyleSheet.create({
  content: { paddingHorizontal: spacing.xl, gap: spacing.xl },
  masthead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: spacing.sm },
  iconButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: radius.full, borderWidth: 1, borderColor: c.hairline },
  intro: { gap: spacing.md },
  greeting: { fontSize: 38, lineHeight: 42, letterSpacing: -1.7 },
  between: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm, flexWrap: "wrap" },
  inline: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  composer: { padding: spacing.lg, borderWidth: 1, borderColor: c.hairlineStrong, borderRadius: radius.xl, backgroundColor: c.surface, gap: spacing.sm },
  dot: { width: 5, height: 5, borderRadius: radius.full, backgroundColor: c.label },
  topicInput: { color: c.label, fontFamily: fonts.regular, fontSize: 18, lineHeight: 27, paddingVertical: spacing.lg, minHeight: 130, textAlignVertical: "top" },
  contextInput: { color: c.label, fontFamily: fonts.regular, fontSize: 14, lineHeight: 22, padding: spacing.md, minHeight: 88, borderRadius: radius.md, backgroundColor: c.surfaceSunken, textAlignVertical: "top" },
  composerFoot: { borderTopWidth: 1, borderTopColor: c.hairline, paddingTop: spacing.md, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  start: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.md, paddingHorizontal: spacing.lg, minHeight: 46, borderRadius: radius.full, backgroundColor: c.ink },
  starters: { flexDirection: "row", gap: spacing.sm },
  starter: { minHeight: 40, flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: c.hairline, borderRadius: radius.full },
  demoNotice: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: -spacing.md },
  section: { gap: spacing.md },
  textButton: { minHeight: 44, flexDirection: "row", alignItems: "center", gap: spacing.sm },
  boardCard: { padding: spacing.lg, borderWidth: 1, borderColor: c.hairline, borderRadius: radius.lg, backgroundColor: c.surface, gap: spacing.xl },
  bench: { flexDirection: "row", gap: spacing.xl },
  member: { minWidth: 56, alignItems: "center", gap: spacing.sm },
  formatRow: { paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: c.hairline, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.xs, flexWrap: "wrap" },
  format: { paddingHorizontal: spacing.md, minHeight: 40, justifyContent: "center", borderRadius: radius.sm },
  focusCard: { flexDirection: "row", alignItems: "center", gap: spacing.lg, paddingVertical: spacing.xl, borderTopWidth: 1, borderBottomWidth: 1, borderColor: c.hairline },
  focusIcon: { width: 46, height: 46, borderRadius: radius.md, backgroundColor: c.surfaceSunken, alignItems: "center", justifyContent: "center" },
  empty: { flexDirection: "row", alignItems: "center", gap: spacing.lg, padding: spacing.lg, borderWidth: 1, borderColor: c.hairline, borderStyle: "dashed", borderRadius: radius.lg },
  actionCard: { padding: spacing.lg, backgroundColor: c.surface, borderWidth: 1, borderColor: c.hairline, borderRadius: radius.lg, gap: spacing.md },
  recent: { paddingVertical: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.lg, borderBottomWidth: 1, borderBottomColor: c.hairline },
  footer: { textAlign: "center", marginTop: spacing.lg },
});
