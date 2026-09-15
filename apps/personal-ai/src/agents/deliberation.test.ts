/// <reference types="node" />
import { it } from "node:test";
import assert from "node:assert/strict";
import { runDeliberation, extractVerdict, buildPrompt, type DeliberationEvents } from "./deliberation";
import type { Provider, Session } from "../lib/types";
const session: Session = { id: "test", topic: "What should I build first?", context: "Current focus: a small personal product", members: ["architect", "operator"], turns: [], engine: "demo", status: "draft", createdAt: 0, updatedAt: 0 };
const events: DeliberationEvents = { onTurnStart() {}, onDelta() {}, onTurnEnd() {}, onTurnError() {} };
it("runs openings, reverse-order crossfire, then the Chair", async () => {
  const calls: string[] = [];
  const provider: Provider = { kind: "demo", async *stream(r) { calls.push(`${r.meta.agentId}:${r.meta.round}`); yield { type: "delta", text: "A perspective." }; } };
  await runDeliberation({ session, provider, depth: "full", events, signal: new AbortController().signal });
  assert.deepEqual(calls, ["architect:opening", "operator:opening", "operator:crossfire", "architect:crossfire", "chair:ruling"]);
});
it("stops without starting additional members when cancelled", async () => {
  const controller = new AbortController();
  let calls = 0;
  const provider: Provider = { kind: "demo", async *stream() { calls++; yield { type: "delta", text: "Before stop" }; controller.abort(); } };
  await runDeliberation({ session, provider, depth: "full", events, signal: controller.signal });
  assert.equal(calls, 1);
});
it("isolates a failed specialist and still asks the Chair", async () => {
  let failures = 0; let ruled = false;
  const provider: Provider = { kind: "demo", async *stream(r) { if (r.meta.agentId === "architect") throw new Error("offline"); if (r.meta.agentId === "chair") ruled = true; yield { type: "delta", text: "Available." }; } };
  await runDeliberation({ session, provider, depth: "quick", events: { ...events, onTurnError() { failures++; } }, signal: new AbortController().signal });
  assert.equal(failures, 1); assert.equal(ruled, true);
});
it("includes the session's personal context snapshot in prompts", () => {
  assert.match(buildPrompt(session, "opening", "The Architect", []), /Current focus: a small personal product/);
  assert.equal(extractVerdict("## **THE CALL**:\nBuild a small prototype.\n\nWHY\nLearn first."), "Build a small prototype.");
});
