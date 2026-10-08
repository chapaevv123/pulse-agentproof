import { encodeFunctionData, keccak256, toHex, type Hex } from "viem";
import type { VerificationReceipt } from "./types";

export const registryAbi = [
  {
    type: "function",
    name: "anchorReceipt",
    stateMutability: "nonpayable",
    inputs: [
      { name: "receiptId", type: "bytes32" },
      { name: "agentId", type: "bytes32" },
      { name: "intentHash", type: "bytes32" },
      { name: "actionHash", type: "bytes32" },
      { name: "policyHash", type: "bytes32" },
      { name: "evidenceHash", type: "bytes32" },
      { name: "verdict", type: "uint8" },
      { name: "reasonCodeHash", type: "bytes32" },
    ],
    outputs: [],
  },
] as const;

const verdictIds = { ALLOW: 1, BLOCK: 2, REVIEW: 3 } as const;

export function receiptContractArgs(receipt: VerificationReceipt) {
  return [
    receipt.receiptId,
    keccak256(toHex(receipt.agentId)),
    receipt.intentHash,
    receipt.actionHash,
    receipt.policyHash,
    receipt.evidenceHash,
    verdictIds[receipt.verdict],
    receipt.reasonCodeHash,
  ] as const;
}

export function encodeAnchorReceipt(receipt: VerificationReceipt): Hex {
  return encodeFunctionData({ abi: registryAbi, functionName: "anchorReceipt", args: receiptContractArgs(receipt) });
}
