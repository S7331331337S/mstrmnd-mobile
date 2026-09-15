import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { extractVerdict, runDeliberation } from "@/agents/deliberation";
import { createAnthropicProvider } from "@/agents/providers/anthropic";
import { createDemoProvider } from "@/agents/providers/demo";
import { SEATABLE_AGENTS, type AgentId } from "@/agents/roster";
import { createId } from "@/lib/id";
import { useSettings } from "@/lib/settings-store";
import { extractNextMoves } from "@/lib/next-moves";
import type { Session, Turn } from "@/lib/types";

const SESSIONS_KEY = "mstrmnd.sessions.v1";
const MAX_STORED = 50;
type SessionState = {
  sessions: Session[];
  hydrated: boolean;
  runningId: string | null;
  hydrate(): Promise<void>;
  create(input: { topic: string; context: string; members: AgentId[] }): Session;
  get(id: string): Session | undefined;
  run(id: string): Promise<void>;
  stop(): void;
  remove(id: string): void;
  clear(): void;
  toggleAction(sessionId: string, actionId: string): void;
};
let activeRun: { id: string; controller: AbortController } | null = null;
const interruptedTurns = (turns: Turn[]): Turn[] => turns.map((t) => ["thinking", "speaking"].includes(t.status) ? { ...t, status: "stopped" } : t);

export const useSessions = create<SessionState>((set, get) => {
  const patch = (id: string, update: (s: Session) => Session) => {
    set((state) => ({ sessions: state.sessions.map((s) => s.id === id ? { ...update(s), updatedAt: Date.now() } : s) }));
    persist(get().sessions);
  };
  const patchTurn = (id: string, turnId: string, update: (t: Turn) => Turn) => patch(id, (s) => ({ ...s, turns: s.turns.map((t) => t.id === turnId ? update(t) : t) }));
  return {
    sessions: [], hydrated: false, runningId: null,
    async hydrate() {
      if (get().hydrated) return;
      const raw = await AsyncStorage.getItem(SESSIONS_KEY).catch(() => null);
      let sessions: Session[] = [];
      try {
        const parsed: unknown = JSON.parse(raw ?? "[]");
        if (Array.isArray(parsed)) sessions = parsed.filter((s) => s && typeof s.id === "string" && typeof s.topic === "string" && typeof s.context === "string" && Array.isArray(s.members) && s.members.every((id: unknown) => SEATABLE_AGENTS.some((a) => a.id === id)) && Array.isArray(s.turns)).slice(0, MAX_STORED);
      } catch { /* Keep a corrupt saved value from blocking launch. */ }
      sessions = sessions.map((s) => s.status === "running" ? { ...s, status: "stopped", turns: interruptedTurns(s.turns) } : s);
      set({ sessions, hydrated: true });
    },
    create({ topic, context, members }) {
      const settings = useSettings.getState();
      const session: Session = {
        id: createId("s_"), topic: topic.trim(), context: context.trim(),
        members: [...new Set(members)].filter((id) => SEATABLE_AGENTS.some((a) => a.id === id)),
        turns: [], actions: [], status: "draft", createdAt: Date.now(), updatedAt: Date.now(),
        engine: settings.apiKey ? "claude" : "demo", depth: settings.depth,
      };
      set((s) => ({ sessions: [session, ...s.sessions].slice(0, MAX_STORED) }));
      persist(get().sessions, true);
      return session;
    },
    get: (id) => get().sessions.find((s) => s.id === id),
    async run(id) {
      const session = get().get(id);
      if (!session || activeRun) return;
      const { apiKey, model, depth } = useSettings.getState();
      const provider = apiKey ? createAnthropicProvider(apiKey, model) : createDemoProvider();
      const handle = { id, controller: new AbortController() };
      activeRun = handle;
      set({ runningId: id });
      patch(id, (s) => ({ ...s, status: "running", turns: [], actions: [], verdict: undefined, engine: provider.kind }));
      try {
        await runDeliberation({ session, provider, depth: session.depth ?? depth, signal: handle.controller.signal, events: {
          onTurnStart: (turn) => { if (activeRun === handle) patch(id, (s) => ({ ...s, turns: [...s.turns, turn] })); },
          onDelta: (turnId, text) => { if (activeRun === handle) patchTurn(id, turnId, (t) => ({ ...t, status: "speaking", text: t.text + text })); },
          onTurnEnd: (turnId, text) => { if (activeRun === handle) patchTurn(id, turnId, (t) => ({ ...t, status: "done", text })); },
          onTurnError: (turnId, error) => { if (activeRun === handle) patchTurn(id, turnId, (t) => ({ ...t, status: "error", error })); },
        }});
        if (activeRun !== handle) return;
        patch(id, (s) => {
          const ruling = s.turns.find((t) => t.round === "ruling" && t.status === "done");
          return {
            ...s, status: handle.controller.signal.aborted ? "stopped" : ruling ? "complete" : "error",
            verdict: ruling ? extractVerdict(ruling.text) : undefined,
            actions: ruling ? extractNextMoves(ruling.text).map((text, i) => ({ id: `${id}_action_${i}`, text, done: false })) : [],
          };
        });
      } catch {
        if (activeRun === handle) patch(id, (s) => ({ ...s, status: handle.controller.signal.aborted ? "stopped" : "error", turns: interruptedTurns(s.turns) }));
      } finally {
        // A previous aborted request must never clear a newer run's controller.
        if (activeRun === handle) { activeRun = null; set({ runningId: null }); }
        persist(get().sessions, true);
      }
    },
    stop() {
      const handle = activeRun;
      if (!handle) return;
      handle.controller.abort();
      activeRun = null;
      set({ runningId: null });
      patch(handle.id, (s) => ({ ...s, status: "stopped", turns: interruptedTurns(s.turns) }));
      persist(get().sessions, true);
    },
    remove(id) {
      if (get().runningId === id) get().stop();
      set((s) => ({ sessions: s.sessions.filter((s) => s.id !== id) }));
      persist(get().sessions, true);
    },
    clear() { get().stop(); set({ sessions: [] }); persist([], true); },
    toggleAction(sessionId, actionId) {
      patch(sessionId, (s) => ({ ...s, actions: s.actions?.map((a) => a.id === actionId ? { ...a, done: !a.done } : a) }));
      persist(get().sessions, true);
    },
  };
});
let timer: ReturnType<typeof setTimeout> | null = null;
let pending: Session[] | null = null;
let writeQueue: Promise<void> = Promise.resolve();
/** Coalesce token updates and serialize terminal writes so older snapshots cannot win. */
function persist(sessions: Session[], immediate = false): void {
  pending = sessions;
  const flush = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    const snapshot = JSON.stringify((pending ?? []).slice(0, MAX_STORED));
    pending = null;
    writeQueue = writeQueue.then(() => AsyncStorage.setItem(SESSIONS_KEY, snapshot)).catch(() => {});
  };
  if (immediate) flush();
  else if (!timer) timer = setTimeout(flush, 350);
}
