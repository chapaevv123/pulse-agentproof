import { zeroHash } from "viem";
import { canonicalize, hashCanonical, normalizeAction } from "./canonical";
import type { ReasonCode, VerificationInput, VerificationReceipt, Verdict } from "./types";

const SUPPORTED_POLICY_VERSION = "1.0";

export function verify(input: VerificationInput): VerificationReceipt {
  const intended = normalizeAction(input.intent);
  const executed = normalizeAction(input.execution_payload);
  const intentHash = hashCanonical({ agentId: input.agent_id, action: intended });
  const actionHash = hashCanonical(intended);
  const executionActionHash = hashCanonical(executed);
  const policyHash = input.policy ? hashCanonical(input.policy) : zeroHash;
  const evidenceHash = input.evidence?.length ? hashCanonical(input.evidence) : zeroHash;
  const reasons: ReasonCode[] = [];
  let verdict: Verdict;

  if (!input.policy) reasons.push("POLICY_MISSING");
  if (input.policy && (input.policy.version !== SUPPORTED_POLICY_VERSION || input.policy_version !== input.policy.version)) {
    reasons.push("POLICY_VERSION_MISMATCH");
  }
  if (!input.evidence?.length) reasons.push("EVIDENCE_MISSING");
  if (input.policy) {
    const evidenceTypes = new Set((input.evidence ?? []).map((item) => item.type));
    if (input.policy.required_evidence_types.some((type) => !evidenceTypes.has(type)) && !reasons.includes("EVIDENCE_MISSING")) {
      reasons.push("EVIDENCE_MISSING");
    }
  }

  if (reasons.length) {
    verdict = "REVIEW";
  } else {
    if (actionHash !== executionActionHash) {
      reasons.push("ACTION_HASH_MISMATCH");
      if (intended.to !== executed.to) reasons.push("DESTINATION_CHANGED");
      if (intended.value !== executed.value) reasons.push("VALUE_CHANGED");
      if (intended.method !== executed.method || canonicalize(intended.args) !== canonicalize(executed.args)) {
        reasons.push("CALLDATA_CHANGED");
      }
    }

    const policy = input.policy!;
    if (!policy.allowed_chains.includes(executed.chainId)) reasons.push("CHAIN_NOT_ALLOWED");
    if (!policy.allowed_targets.map((target) => target.toLowerCase()).includes(executed.to)) reasons.push("TARGET_NOT_ALLOWED");
    if (BigInt(executed.value) > BigInt(policy.max_value)) reasons.push("VALUE_LIMIT_EXCEEDED");
    if (!policy.allowed_methods.includes(executed.method)) reasons.push("METHOD_NOT_ALLOWED");
    verdict = reasons.length ? "BLOCK" : "ALLOW";
  }

  const reasonCodeHash = hashCanonical(reasons);
  const receiptCore = {
    schemaVersion: "1.0",
    agentId: input.agent_id,
    intentHash,
    actionHash,
    policyHash,
    evidenceHash,
    verdict,
    reasonCodeHash,
  } as const;

  return {
    ...receiptCore,
    schemaVersion: "1.0",
    scenario: input.scenario,
    normalizedAction: intended,
    executionAction: executed,
    executionActionHash,
    reasonCodes: reasons,
    receiptId: hashCanonical(receiptCore),
    chainId: 10143,
    registryAddress: null,
    anchorTxHash: null,
    executionTxHash: null,
  };
}

