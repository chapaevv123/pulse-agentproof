"use client";

import React, { useState } from "react";
import type { VerificationInput, VerificationReceipt } from "@/src/agentproof/types";

type Scenario = { input: VerificationInput; receipt: VerificationReceipt };

const labels = { SAFE: "Safe action", TAMPERED: "Tampered action", INSUFFICIENT: "Missing context" } as const;
const verdictCopy = {
  ALLOW: "Exact payload approved",
  BLOCK: "Execution prevented",
  REVIEW: "Human context required",
} as const;

const short = (value: string) => `${value.slice(0, 10)}…${value.slice(-8)}`;
const mon = (value: string) => `${Number(BigInt(value)) / 1e18} MON`;

export function ProofConsole({ scenarios }: { scenarios: Scenario[] }) {
  const [active, setActive] = useState(0);
  const { input, receipt } = scenarios[active];
  const isLive = receipt.anchorTxHash !== null;

  return (
    <section className="console" aria-label="AgentProof scenario console">
      <div className="scenario-tabs" role="tablist" aria-label="Demo scenarios">
        {scenarios.map((scenario, index) => (
          <button
            key={scenario.input.scenario}
            className={active === index ? "active" : ""}
            onClick={() => setActive(index)}
            role="tab"
            aria-selected={active === index}
          >
            <span>0{index + 1}</span>{labels[scenario.input.scenario]}
            <b className={`mini ${scenario.receipt.verdict.toLowerCase()}`}>{scenario.receipt.verdict}</b>
          </button>
        ))}
      </div>

      <div className={`proof-grid verdict-${receipt.verdict.toLowerCase()}`}>
        <article className="panel intent-panel">
          <header><span>01</span><div><small>INPUT</small><h2>Agent intent</h2></div><b>RAW → NORMALIZED</b></header>
          <div className="action-target">
            <small>DESTINATION</small>
            <code>{short(receipt.normalizedAction.to)}</code>
          </div>
          <dl>
            <div><dt>Network</dt><dd>Monad Testnet <small>10143</small></dd></div>
            <div><dt>Value</dt><dd>{mon(receipt.normalizedAction.value)}</dd></div>
            <div><dt>Method</dt><dd><code>{receipt.normalizedAction.method}</code></dd></div>
            <div><dt>Evidence</dt><dd>{input.evidence?.length ?? 0} item{input.evidence?.length === 1 ? "" : "s"}</dd></div>
          </dl>
          {input.scenario === "TAMPERED" && (
            <div className="mutation"><span>PAYLOAD MUTATION</span><code>{short(receipt.executionAction.to)}</code></div>
          )}
          <div className="hash-line"><span>INTENT HASH</span><code title={receipt.intentHash}>{short(receipt.intentHash)}</code></div>
        </article>

        <article className="panel verify-panel">
          <header><span>02</span><div><small>BOUNDARY</small><h2>Deterministic verification</h2></div><b>NO LLM</b></header>
          <div className="gate-visual" aria-hidden="true"><i /><i /><div><span /><span /><span /></div></div>
          <div className={`verdict ${receipt.verdict.toLowerCase()}`}>
            <small>VERDICT</small><strong>{receipt.verdict}</strong><p>{verdictCopy[receipt.verdict]}</p>
          </div>
          <div className="reason-block">
            <small>REASON CODES</small>
            {receipt.reasonCodes.length ? receipt.reasonCodes.map((reason) => <code key={reason}>{reason}</code>) : <code className="clear">ALL_CHECKS_PASSED</code>}
          </div>
          <div className="checks">
            <span>POLICY <b>{input.policy ? "✓" : "—"}</b></span>
            <span>EVIDENCE <b>{input.evidence?.length ? "✓" : "—"}</b></span>
            <span>INTEGRITY <b>{receipt.actionHash === receipt.executionActionHash ? "✓" : "×"}</b></span>
          </div>
        </article>

        <article className="panel receipt-panel">
          <header><span>03</span><div><small>OUTPUT</small><h2>Monad receipt</h2></div><b>{isLive ? "ANCHORED" : "LOCAL PROOF"}</b></header>
          <div className="receipt-id">
            <small>RECEIPT ID</small><code title={receipt.receiptId}>{short(receipt.receiptId)}</code>
          </div>
          <div className="block-stack" aria-hidden="true"><i /><i /><i /><span>10143</span></div>
          <dl>
            <div><dt>Action hash</dt><dd><code>{short(receipt.actionHash)}</code></dd></div>
            <div><dt>Policy hash</dt><dd><code>{short(receipt.policyHash)}</code></dd></div>
            <div><dt>Evidence hash</dt><dd><code>{short(receipt.evidenceHash)}</code></dd></div>
            <div><dt>Execution tx</dt><dd>{receipt.verdict === "ALLOW" ? "Awaiting owner approval" : "Not permitted"}</dd></div>
          </dl>
          <div className="anchor-state"><span className={isLive ? "live" : ""} />{isLive ? "CONFIRMED ON MONAD" : "NOT YET BROADCAST"}</div>
        </article>
      </div>

      <div className="console-note">
        <span>DEMO FIXTURE / {input.scenario}</span>
        <p>{receipt.verdict === "ALLOW" ? "Eligible to anchor. Execution remains a separate owner-approved step." : "No execution transaction can be created for this decision."}</p>
      </div>
    </section>
  );
}
