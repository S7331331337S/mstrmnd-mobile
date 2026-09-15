import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AGENTS, CHAIR, SEATABLE_AGENTS, type Agent } from "@/agents/roster";
import { AgentAvatar } from "@/components/agent-avatar";
import { Screen } from "@/components/screen";
import { ThemedText } from "@/components/themed-text";
import { useHaptics } from "@/hooks/use-haptics";
import { radius, shadows, spacing, useThemedStyles, type ThemeColors } from "@/theme";

export function Roster() {
  
  const styles = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.head}>
          <ThemedText variant="largeTitle">The Board</ThemedText>
          <ThemedText variant="subhead">
            Seven specialist perspectives. One Chair to connect the dots. Choose the voices that fit your question.
          </ThemedText>
        </View>

        {SEATABLE_AGENTS.map((agent) => (
          <MemberCard key={agent.id} agent={agent} />
        ))}

        <ThemedText variant="overline" style={styles.chairLabel}>
          Always seated
        </ThemedText>
        <MemberCard agent={CHAIR} />
      </ScrollView>
    </Screen>
  );
}

function MemberCard({ agent }: { agent: Agent }) {
  
  const styles = useThemedStyles(makeStyles);
  const router = useRouter();
  const haptics = useHaptics();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${agent.name}, ${agent.role}`}
      onPress={() => {
        haptics.tap();
        router.push(`/agent/${agent.id}`);
      }}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <AgentAvatar agent={agent} size="lg" />

      <View style={styles.body}>
        <ThemedText variant="overline">
          {agent.role}
        </ThemedText>
        <ThemedText variant="title">{agent.name}</ThemedText>
        <ThemedText variant="subhead" style={styles.bio}>
          {agent.bio}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  head: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  card: {
    boxShadow: shadows.card,
    flexDirection: "row",
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    padding: spacing.lg,
  },
  body: {
    flex: 1,
    gap: spacing.xs,
  },
  bio: {
    color: colors.tertiaryLabel,
  },
  chairLabel: {
    marginTop: spacing.lg,
  },
  pressed: {
    opacity: 0.7,
  },
});
