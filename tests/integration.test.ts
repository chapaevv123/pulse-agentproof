import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import safe from "../fixtures/safe.json";
import { encodeAnchorReceipt, receiptContractArgs } from "../src/agentproof/contract";
import { monadTestnet } from "../src/agentproof/chain";
import { verify } from "../src/agentproof/verifier";
import type { VerificationInput } from "../src/agentproof/types";

describe("local integration", () => {
  const receipt = verify(safe as VerificationInput);

  it("encodes a verifier receipt for the registry ABI", () => {
    const args = receiptContractArgs(receipt);
    expect(args[0]).toBe(receipt.receiptId);
    expect(args[6]).toBe(1);
    expect(encodeAnchorReceipt(receipt)).toMatch(/^0x[0-9a-f]+$/);
  });

  it("uses the exact Monad Testnet configuration", () => {
    expect(monadTestnet.id).toBe(10143);
    expect(monadTestnet.rpcUrls.default.http).toEqual(["https://testnet-rpc.monad.xyz"]);
    expect(monadTestnet.testnet).toBe(true);
  });

  it("has no mainnet or automatic execution route in application source", () => {
    const sources = ["app/page.tsx", "app/proof-console.tsx", "src/agentproof/chain.ts"].map((path) => readFileSync(path, "utf8")).join("\n");
    expect(sources).not.toMatch(/mainnet/i);
    expect(sources).not.toMatch(/sendTransaction|writeContract|createWalletClient/);
  });
});

