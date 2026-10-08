import React from "react";
import monadProof from "../MONAD_REAL_ONCHAIN_PROOF_V1.json";

export function OnchainProof() {
  return (
    <section className="real-proof" aria-labelledby="real-proof-title">
      <div className="real-proof-lead">
        <div className="proof-kicker"><span /> REAL MONAD PROOF</div>
        <h2 id="real-proof-title">One decision.<br /><em>Permanently anchored.</em></h2>
        <p>The deterministic SAFE receipt is now a real Monad Testnet record. The anchor proves the decision commitments—not an arbitrary downstream execution.</p>
        <div className="proof-verdict"><small>VERDICT</small><strong>ALLOW</strong><span>BLOCK {monadProof.anchor.block_number}</span></div>
      </div>
      <div className="chain-record">
        <header><span>ON-CHAIN RECEIPT</span><b>CONFIRMED</b></header>
        <dl>
          <div><dt>Network</dt><dd>Monad Testnet <small>10143</small></dd></div>
          <div><dt>Registry</dt><dd><code>{shortProof(monadProof.registry.contract_address)}</code></dd></div>
          <div><dt>Receipt tx</dt><dd><code>{shortProof(monadProof.anchor.transaction_hash)}</code></dd></div>
          <div><dt>Receipt ID</dt><dd><code>{shortProof(monadProof.local_safe_receipt_commitments.receipt_id)}</code></dd></div>
        </dl>
        <div className="proof-links">
          <a href={monadProof.explorer_links.contract} target="_blank" rel="noreferrer">VIEW CONTRACT <span>↗</span></a>
          <a href={monadProof.explorer_links.safe_receipt_transaction} target="_blank" rel="noreferrer">VIEW RECEIPT TX <span>↗</span></a>
        </div>
        <p className="proof-classification">{monadProof.proof_classification}</p>
      </div>
    </section>
  );
}

function shortProof(value: string) {
  return `${value.slice(0, 10)}…${value.slice(-8)}`;
}
