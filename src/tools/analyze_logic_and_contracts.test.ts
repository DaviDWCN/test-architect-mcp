import test from "node:test";
import assert from "node:assert";
import { analyzeLogicAndContracts } from "./analyze_logic_and_contracts.js";

test("analyzeLogicAndContracts should find amount invariant and TS zod suggestion", async () => {
  const result = await analyzeLogicAndContracts({
    sourceCode: "function transfer(amount: number) { if (amount == null) return; }",
    language: "typescript"
  });

  const parsed = JSON.parse(result.content?.[0]?.text as string);

  assert.strictEqual(parsed.invariants.includes("Inputs for amounts or balances should likely be non-negative."), true);
  assert.strictEqual(parsed.invariants.includes("Null checks indicate fields that may be absent; ensure defaults or early exits."), true);
  assert.strictEqual(parsed.languageSpecificContracts.suggestion.includes("Zod"), true);
});

test("analyzeLogicAndContracts should handle missing arguments gracefully", async () => {
  try {
    await analyzeLogicAndContracts({ sourceCode: "function a() {}" });
    assert.fail("Should have thrown error for missing language");
  } catch (err: any) {
    assert.match(err.message, /Missing required arguments/);
  }
});
