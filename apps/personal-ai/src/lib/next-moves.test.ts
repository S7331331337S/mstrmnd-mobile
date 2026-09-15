/// <reference types="node" />
import { it } from "node:test";
import assert from "node:assert/strict";
import { extractNextMoves } from "./next-moves";
it("extracts numbered action items and preserves wrapped lines", () => {
  assert.deepEqual(extractNextMoves("THE CALL\nTest the idea.\n\n## **DO THIS WEEK**:\n1. Interview three users.\n   Ask what they tried before.\n2) Build a small prototype.\n3. Review the evidence."), ["Interview three users. Ask what they tried before.", "Build a small prototype.", "Review the evidence."]);
});
it("does not invent actions when a ruling lacks the expected section", () => {
  assert.deepEqual(extractNextMoves("1. This numbered opening is not a ruling."), []);
});
