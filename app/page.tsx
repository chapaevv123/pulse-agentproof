import safe from "@/fixtures/safe.json";
import tampered from "@/fixtures/tampered.json";
import insufficient from "@/fixtures/insufficient.json";
import { verify } from "@/src/agentproof/verifier";
import type { VerificationInput } from "@/src/agentproof/types";
import { ProofConsole } from "./proof-console";

export default function Home() {
  const scenarios = [safe, tampered, insufficient].map((fixture) => ({
    input: fixture as VerificationInput,
    receipt: verify(fixture as VerificationInput),
  }));

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Pulse AgentProof home">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>Pulse <strong>AgentProof</strong></span>
        </a>
        <div className="network"><span /> MONAD TESTNET <b>10143</b></div>
      </header>

      <section className="hero" id="top">
        <p className="eyebrow">TRUST, IDENTITY &amp; AI INFRASTRUCTURE / 04</p>
        <h1>The agent proposes.<br /><em>The proof decides.</em></h1>
        <p className="lede">A deterministic accountability boundary for autonomous actions—before they touch Monad.</p>
        <div className="hero-rule"><span>RAW INTENT</span><i /><span>VERIFICATION</span><i /><span>ONCHAIN PROOF</span></div>
      </section>

      <ProofConsole scenarios={scenarios} />

      <section className="trust-strip">
        <div><span>01</span><h2>Exact intent</h2><p>Canonical serialization commits to chain, destination, value, method, and arguments.</p></div>
        <div><span>02</span><h2>Independent gate</h2><p>Policy and evidence checks are deterministic. No model participates in the verdict.</p></div>
        <div><span>03</span><h2>Monad anchor</h2><p>Compact immutable commitments make decisions independently reproducible.</p></div>
      </section>

      <footer><span>PULSE AGENTPROOF / LOCAL MVP</span><span>TESTNET ONLY · NO AUTOMATIC EXECUTION</span></footer>
    </main>
  );
}

