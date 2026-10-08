import { describe, expect, it } from "vitest";
import safe from "../fixtures/safe.json";
import tampered from "../fixtures/tampered.json";
import insufficient from "../fixtures/insufficient.json";
import { canonicalize, hashCanonical, normalizeAction } from "../src/agentproof/canonical";
import { verify } from "../src/agentproof/verifier";
import type { VerificationInput } from "../src/agentproof/types";

const fixtures = {
  safe: safe as VerificationInput,
  tampered: tampered as VerificationInput,
  insufficient: insufficient as VerificationInput,
};

describe("canonical representation", () => {
  it("sorts object keys recursively", () => {
    expect(canonicalize({ z: 1, a: { y: 2, b: 3 } })).toBe('{"a":{"b":3,"y":2},"z":1}');
    expect(hashCanonical({ z: 1, a: 2 })).toBe(hashCanonical({ a: 2, z: 1 }));
  });

  it("normalizes address casing and numeric value strings", () => {
    const normalized = normalizeAction({ ...fixtures.safe.intent, value: "001000000000000000" });
    expect(normalized.to).toBe(normalized.to.toLowerCase());
    expect(normalized.value).toBe("1000000000000000");
  });
});

describe("three primary scenarios", () => {
  it("allows the exact safe action", () => {
    const receipt = verify(fixtures.safe);
    expect(receipt.verdict).toBe("ALLOW");
    expect(receipt.reasonCodes).toEqual([]);
    expect(receipt.actionHash).toBe(receipt.executionActionHash);
  });

  it("blocks the changed destination with exact reason codes", () => {
    const receipt = verify(fixtures.tampered);
    expect(receipt.verdict).toBe("BLOCK");
    expect(receipt.reasonCodes).toEqual(["ACTION_HASH_MISMATCH", "DESTINATION_CHANGED", "TARGET_NOT_ALLOWED"]);
    expect(receipt.actionHash).not.toBe(receipt.executionActionHash);
  });

  it("routes missing evidence to review", () => {
    const receipt = verify(fixtures.insufficient);
    expect(receipt.verdict).toBe("REVIEW");
    expect(receipt.reasonCodes).toEqual(["EVIDENCE_MISSING"]);
    expect(receipt.anchorTxHash).toBeNull();
    expect(receipt.executionTxHash).toBeNull();
  });

  it("reproduces a byte-identical receipt for repeated input", () => {
    expect(verify(fixtures.safe)).toEqual(verify(structuredClone(fixtures.safe)));
  });

  it("changes the material action hash when value or calldata changes", () => {
    const baseline = verify(fixtures.safe);
    const valueChange = structuredClone(fixtures.safe);
    valueChange.intent.value = "2";
    const calldataChange = structuredClone(fixtures.safe);
    calldataChange.intent.args = ["different"];
    expect(verify(valueChange).actionHash).not.toBe(baseline.actionHash);
    expect(verify(calldataChange).actionHash).not.toBe(baseline.actionHash);
  });
});

