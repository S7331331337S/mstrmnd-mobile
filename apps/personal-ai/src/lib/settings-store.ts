import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { create } from "zustand";

import type { Depth } from "@/agents/deliberation";

export const MODELS = [
  { id: "claude-opus-5", label: "Opus 5", hint: "Sharpest board. Slowest." },
  { id: "claude-sonnet-5", label: "Sonnet 5", hint: "Best balance. Recommended." },
  { id: "claude-haiku-4-5-20251001", label: "Haiku 4.5", hint: "Fastest, cheapest." },
] as const;

export type ModelId = (typeof MODELS)[number]["id"];

const PREFS_KEY = "mstrmnd.prefs.v1";
const API_KEY_KEY = "mstrmnd.anthropic.key";

export type Appearance = "dark" | "light" | "system";

type Prefs = {
  appearance: Appearance;
  model: ModelId;
  depth: Depth;
  haptics: boolean;
  /** False until the welcome screen has been dismissed once. */
  onboarded: boolean;
};

const DEFAULT_PREFS: Prefs = {
  model: "claude-sonnet-5",
  depth: "full",
  haptics: true,
  onboarded: true,
  appearance: "dark",
};

type SettingsState = Prefs & {
  apiKey: string | null;
  hydrated: boolean;
  hydrate(): Promise<void>;
  setAppearance(appearance: Appearance): void;
  setModel(model: ModelId): void;
  setDepth(depth: Depth): void;
  setHaptics(haptics: boolean): void;
  setOnboarded(onboarded: boolean): void;
  setApiKey(key: string | null): Promise<void>;
};

/**
 * Native keys use the OS keychain. Web keys stay in the Zustand store for the
 * current tab lifetime and are deliberately not persisted to browser storage.
 */
async function readApiKey(): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      await AsyncStorage.removeItem(API_KEY_KEY);
      return null;
    }
    return await SecureStore.getItemAsync(API_KEY_KEY);
  } catch {
    return null;
  }
}

async function writeApiKey(key: string | null): Promise<void> {
  try {
    if (Platform.OS === "web") {
      await AsyncStorage.removeItem(API_KEY_KEY);
      return;
    }
    if (key) await SecureStore.setItemAsync(API_KEY_KEY, key);
    else await SecureStore.deleteItemAsync(API_KEY_KEY);
  } catch {
    // Storage failure shouldn't crash settings; the key just won't persist.
  }
}

export const useSettings = create<SettingsState>((set, get) => ({
  ...DEFAULT_PREFS,
  apiKey: null,
  hydrated: false,

  async hydrate() {
    if (get().hydrated) return;

    const [raw, apiKey] = await Promise.all([
      AsyncStorage.getItem(PREFS_KEY).catch(() => null),
      readApiKey(),
    ]);

    let prefs = { ...DEFAULT_PREFS };
    if (raw) {
      try {
        const p = JSON.parse(raw) as Partial<Prefs>;
        if (p && typeof p === "object") {
          if (["dark", "light", "system"].includes(p.appearance ?? "")) prefs.appearance = p.appearance!;
          if (MODELS.some((m) => m.id === p.model)) prefs.model = p.model!;
          if (p.depth === "full" || p.depth === "quick") prefs.depth = p.depth;
          if (typeof p.haptics === "boolean") prefs.haptics = p.haptics;
          if (typeof p.onboarded === "boolean") prefs.onboarded = p.onboarded;
        }
      } catch {
        // Corrupt prefs fall back to defaults rather than blocking startup.
      }
    }

    set({ ...prefs, apiKey, hydrated: true });
  },

  setAppearance(appearance) {
    set({ appearance });
    void persist(get());
  },
  setModel(model) {
    set({ model });
    void persist(get());
  },
  setDepth(depth) {
    set({ depth });
    void persist(get());
  },
  setHaptics(haptics) {
    set({ haptics });
    void persist(get());
  },
  setOnboarded(onboarded) {
    set({ onboarded });
    void persist(get());
  },
  async setApiKey(key) {
    const trimmed = key?.trim() || null;
    set({ apiKey: trimmed });
    await writeApiKey(trimmed);
  },
}));

function persist(state: SettingsState): Promise<void> {
  const prefs: Prefs = {
    appearance: state.appearance,
    model: state.model,
    depth: state.depth,
    haptics: state.haptics,
    onboarded: state.onboarded,
  };
  return AsyncStorage.setItem(PREFS_KEY, JSON.stringify(prefs)).catch(() => {});
}
