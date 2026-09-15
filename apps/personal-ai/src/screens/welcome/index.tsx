import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/button";
import { Screen } from "@/components/screen";
import { ThemedText } from "@/components/themed-text";
import { Wordmark } from "@/components/wordmark";
import { useHaptics } from "@/hooks/use-haptics";
import { useSettings } from "@/lib/settings-store";
import { radius, shadows, spacing, useThemedStyles, type ThemeColors } from "@/theme";

const PHASES = [
  {
    step: "01",
    title: "Openings",
    body: "Each member you seat gives a position from their single lens — feasibility, demand, risk, numbers.",
  },
  {
    step: "02",
    title: "Crossfire",
    body: "They answer each other by name, sharpening the strongest point or taking it apart.",
  },
  {
    step: "03",
    title: "The ruling",
    body: "The Chair closes with a call, names the real disagreement, and gives you three things to do this week.",
  },
];

/**
 * First run. Without this the app opens on an empty compose field and a notice
 * about API keys, which explains the plumbing before it explains the point.
 */
export function Welcome() {
  
  const styles = useThemedStyles(makeStyles);
  const router = useRouter();
  const haptics = useHaptics();
  const insets = useSafeAreaInsets();

  const setOnboarded = useSettings((s) => s.setOnboarded);

  const finish = (destination: "/" | "/settings") => {
    haptics.heavy();
    setOnboarded(true);
    router.replace(destination);
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(400)} style={styles.masthead}>
          <Wordmark />
          <View>
            <ThemedText variant="hero" style={styles.heroMuted}>
              A board
            </ThemedText>
            <ThemedText variant="hero">that argues</ThemedText>
          </View>
          <ThemedText variant="body" style={styles.lede}>
            Most AI advice collapses into one agreeable voice. This one is built to
            disagree with itself, and with you.
          </ThemedText>
        </Animated.View>

        <View style={styles.phases}>
          {PHASES.map((phase, index) => (
            <Animated.View
              key={phase.step}
              entering={FadeInDown.delay(120 + index * 90).springify().damping(18)}
              style={styles.phase}
            >
              <View style={styles.stepBadge}>
                <ThemedText variant="overline" style={styles.stepText}>
                  {phase.step}
                </ThemedText>
              </View>
              <View style={styles.phaseText}>
                <ThemedText variant="headline">{phase.title}</ThemedText>
                <ThemedText variant="subhead">{phase.body}</ThemedText>
              </View>
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeIn.delay(500)} style={styles.actions}>
          <Button title="Add a Claude key" size="lg" onPress={() => finish("/settings")} />
          <Button
            title="Try the offline board first"
            variant="ghost"
            onPress={() => finish("/")}
          />
          <ThemedText variant="caption" style={styles.fine}>
            Without a key the board runs scripted stand-ins — the format works, but they
            can&apos;t reason about your question. Sessions stay on this device either way.
          </ThemedText>
        </Animated.View>
      </ScrollView>
    </Screen>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xxl,
    flexGrow: 1,
  },
  masthead: {
    gap: spacing.lg,
  },
  heroMuted: {
    color: colors.tertiaryLabel,
  },
  lede: {
    color: colors.secondaryLabel,
    maxWidth: 340,
  },
  phases: {
    gap: spacing.lg,
  },
  phase: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    boxShadow: shadows.card,
    padding: spacing.lg,
  },
  stepBadge: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceInverse,
  },
  stepText: {
    color: colors.onInk,
  },
  phaseText: {
    flex: 1,
    gap: spacing.xs,
  },
  actions: {
    gap: spacing.md,
    marginTop: "auto",
  },
  fine: {
    color: colors.tertiaryLabel,
    textAlign: "center",
  },
});
