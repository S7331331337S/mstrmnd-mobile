import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type PersonalProfile = {
  name: string;
  focus: string;
  ambition: string;
  context: string;
  constraints: string;
  useInSessions: boolean;
};
export const emptyProfile: PersonalProfile = {
  name: "Master", focus: "", ambition: "", context: "", constraints: "", useInSessions: true,
};
type PersonalState = {
  profile: PersonalProfile;
  updateProfile(profile: Partial<PersonalProfile>): void;
};
export const usePersonal = create<PersonalState>()(persist((set) => ({
  profile: emptyProfile,
  updateProfile: (update) => set((s) => ({ profile: { ...s.profile, ...update } })),
}), {
  name: "mstrmnd.personal.v1",
  storage: createJSONStorage(() => AsyncStorage),
  partialize: (state) => ({ profile: state.profile }),
  merge: (saved, current) => {
    const p = (saved as { profile?: Partial<PersonalProfile> } | undefined)?.profile;
    const profile = { ...emptyProfile };
    for (const k of ["name", "focus", "ambition", "context", "constraints"] as const) {
      if (typeof p?.[k] === "string") profile[k] = p[k].slice(0, 2000);
    }
    if (typeof p?.useInSessions === "boolean") profile.useInSessions = p.useInSessions;
    return { ...current, profile };
  },
}));
/** Snapshot only the context the user chose to bring to this new session. */
export function personalContext(profile: PersonalProfile): string {
  if (!profile.useInSessions) return "";
  return [
    profile.name && `Preferred name: ${profile.name}`,
    profile.focus && `Current focus: ${profile.focus}`,
    profile.ambition && `Long-term ambition: ${profile.ambition}`,
    profile.context && `Background: ${profile.context}`,
    profile.constraints && `Constraints and non-negotiables: ${profile.constraints}`,
  ].filter(Boolean).join("\n");
}
