import { encodeAbiParameters, keccak256, toHex, type Hex } from "viem";
import { describe, expect, it } from "vitest";
import proof from "../MONAD_REAL_ONCHAIN_PROOF_V1.json";
import safe from "../fixtures/safe.json";
import { receiptContractArgs } from "../src/agentproof/contract";
import type { VerificationInput } from "../src/agentproof/types";
import { verify } from "../src/agentproof/verifier";

describe("real Monad proof provenance", () => {
  const receipt = verify(safe as VerificationInput);

  it("binds the unchanged local SAFE receipt to the recorded anchor", () => {
    expect(proof.proof_classification).toBe("REAL_MONAD_ALLOW_RECEIPT_ANCHOR");
    expect(proof.network.chain_id).toBe(10143);
    expect(proof.anchor.verdict).toBe("ALLOW");
    expect(proof.anchor.execution_transaction_hash).toBeNull();
    expect(proof.local_safe_receipt_commitments).toMatchObject({
      receipt_id: receipt.receiptId,
      intent_hash: receipt.intentHash,
      action_hash: receipt.actionHash,
      execution_action_hash: receipt.executionActionHash,
      policy_hash: receipt.policyHash,
      evidence_hash: receipt.evidenceHash,
      reason_code_hash: receipt.reasonCodeHash,
      reason_codes: receipt.reasonCodes,
    });
  });

  it("recovers the event topics and data from the ABI commitments", () => {
    const args = receiptContractArgs(receipt);
    const topic0 = keccak256(toHex("ActionReceiptAnchored(bytes32,bytes32,bytes32,uint8,bytes32)"));
    const data = encodeAbiParameters(
      [{ type: "bytes32" }, { type: "uint8" }, { type: "bytes32" }],
      [receipt.actionHash, 1, receipt.reasonCodeHash],
    );

    expect(proof.emitted_event.topics).toEqual([topic0, receipt.receiptId, args[1]]);
    expect(proof.emitted_event.data as Hex).toBe(data);
    expect(proof.emitted_event.decoded).toEqual({
      receipt_id: receipt.receiptId,
      agent_id: args[1],
      action_hash: receipt.actionHash,
      verdict: 1,
      reason_code_hash: receipt.reasonCodeHash,
    });
  });

  it("provides explorer-ready links for the registry and both real transactions", () => {
    expect(proof.explorer_links.contract).toContain(proof.registry.contract_address);
    expect(proof.explorer_links.deployment_transaction).toContain(proof.registry.deployment_tx);
    expect(proof.explorer_links.safe_receipt_transaction).toContain(proof.anchor.transaction_hash);
  });
});
