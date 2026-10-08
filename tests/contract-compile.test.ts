import { readFileSync } from "node:fs";
import solc from "solc";
import { describe, expect, it } from "vitest";

describe("ActionReceiptRegistry", () => {
  it("compiles without Solidity errors", () => {
    const input = {
      language: "Solidity",
      sources: { "ActionReceiptRegistry.sol": { content: readFileSync("contracts/ActionReceiptRegistry.sol", "utf8") } },
      settings: { outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } } },
    };
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    const errors = (output.errors ?? []).filter((entry: { severity: string }) => entry.severity === "error");
    expect(errors).toEqual([]);
    const artifact = output.contracts["ActionReceiptRegistry.sol"].ActionReceiptRegistry;
    expect(artifact.abi.some((item: { name?: string }) => item.name === "anchorReceipt")).toBe(true);
    expect(artifact.evm.bytecode.object.length).toBeGreaterThan(100);
  });
});
