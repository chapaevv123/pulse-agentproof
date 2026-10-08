import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import safe from "../fixtures/safe.json";
import tampered from "../fixtures/tampered.json";
import insufficient from "../fixtures/insufficient.json";
import { ProofConsole } from "../app/proof-console";
import { OnchainProof } from "../app/onchain-proof";
import { verify } from "../src/agentproof/verifier";
import type { VerificationInput } from "../src/agentproof/types";

describe("three-state demo", () => {
  it("renders all selectable scenario states and the safe proof", () => {
    const inputs = [safe, tampered, insufficient] as VerificationInput[];
    const html = renderToStaticMarkup(<ProofConsole scenarios={inputs.map((input) => ({ input, receipt: verify(input) }))} />);
    expect(html).toContain("Safe action");
    expect(html).toContain("Tampered action");
    expect(html).toContain("Missing context");
    expect(html).toContain("ALLOW");
    expect(html).toContain("ALL_CHECKS_PASSED");
    expect(html).toContain("NOT YET BROADCAST");
  });

  it("renders the real Monad proof with explorer-ready evidence", () => {
    const html = renderToStaticMarkup(<OnchainProof />);
    expect(html).toContain("REAL MONAD PROOF");
    expect(html).toContain("REAL_MONAD_ALLOW_RECEIPT_ANCHOR");
    expect(html).toContain("0x1607Af4E");
    expect(html).toContain("0xfa348cb0");
    expect(html).toContain("VIEW RECEIPT TX");
  });
});
