import type { Hex } from "viem";

export const VERDICTS = ["ALLOW", "BLOCK", "REVIEW"] as const;
export type Verdict = (typeof VERDICTS)[number];

export const REASON_CODES = [
  "CHAIN_NOT_ALLOWED",
  "TARGET_NOT_ALLOWED",
  "VALUE_LIMIT_EXCEEDED",
  "METHOD_NOT_ALLOWED",
  "ACTION_HASH_MISMATCH",
  "DESTINATION_CHANGED",
  "VALUE_CHANGED",
  "CALLDATA_CHANGED",
  "EVIDENCE_MISSING",
  "POLICY_MISSING",
  "POLICY_VERSION_MISMATCH",
] as const;
export type ReasonCode = (typeof REASON_CODES)[number];

export interface ActionInput {
  chain_id: number;
  to: string;
  value: string;
  function: string;
  args: readonly unknown[];
}

export interface PolicyInput {
  version: string;
  allowed_chains: readonly number[];
  allowed_targets: readonly string[];
  max_value: string;
  allowed_methods: readonly string[];
  required_evidence_types: readonly string[];
}

export interface EvidenceInput {
  type: string;
  source: string;
  claim: string;
}

export interface VerificationInput {
  scenario: "SAFE" | "TAMPERED" | "INSUFFICIENT";
  agent_id: string;
  policy_version: string;
  intent: ActionInput;
  execution_payload: ActionInput;
  policy?: PolicyInput;
  evidence?: readonly EvidenceInput[];
}

export interface NormalizedAction {
  chainId: number;
  to: `0x${string}`;
  value: string;
  method: string;
  args: readonly unknown[];
}

export interface VerificationReceipt {
  schemaVersion: "1.0";
  scenario: VerificationInput["scenario"];
  agentId: string;
  normalizedAction: NormalizedAction;
  executionAction: NormalizedAction;
  intentHash: Hex;
  actionHash: Hex;
  executionActionHash: Hex;
  policyHash: Hex;
  evidenceHash: Hex;
  verdict: Verdict;
  reasonCodes: readonly ReasonCode[];
  reasonCodeHash: Hex;
  receiptId: Hex;
  chainId: 10143;
  registryAddress: `0x${string}` | null;
  anchorTxHash: Hex | null;
  executionTxHash: Hex | null;
}

