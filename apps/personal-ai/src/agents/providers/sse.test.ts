/// <reference types="node" />
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { AnthropicError, decodeSse } from "./sse";
function streamOf(...chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({ start(c) { chunks.forEach((s) => c.enqueue(encoder.encode(s))); c.close(); } });
}
function delta(text: string): string {
  return `event: content_block_delta\ndata: ${JSON.stringify({ type: "content_block_delta", delta: { type: "text_delta", text } })}\n\n`;
}
async function collect(stream: ReadableStream<Uint8Array>): Promise<string> {
  let out = "";
  for await (const chunk of decodeSse(stream)) if (chunk.type === "delta") out += chunk.text;
  return out;
}
describe("provider stream decoding", () => {
  it("preserves deltas split across network frames", async () => {
    const frame = delta("bootstrap");
    assert.equal(await collect(streamOf(frame.slice(0, 23), frame.slice(23), delta(" today").trimEnd())), "bootstrap today");
  });
  it("accepts CRLF events even when the separator is split", async () => {
    const frame = delta("one").replaceAll("\n", "\r\n") + delta("two").replaceAll("\n", "\r\n");
    assert.equal(await collect(streamOf(frame.slice(0, 3), frame.slice(3, -1), frame.slice(-1))), "onetwo");
  });
  it("ignores pings and preserves the valid part after malformed frames", async () => {
    assert.equal(await collect(streamOf(": ping\n\n", delta("before"), "data: nope\n\n", delta("after"))), "beforeafter");
  });
  it("surfaces provider error events", async () => {
    await assert.rejects(collect(streamOf('data: {"type":"error","error":{"message":"overloaded"}}\n\n')), AnthropicError);
  });
});
