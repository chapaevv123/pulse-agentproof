# Three-minute demo guide

## 0:00–0:25 — the boundary

Open the console and state: “The agent proposes; a deterministic verifier decides whether this exact payload can proceed.” Point to the three separate columns: intent, verification, and Monad receipt.

## 0:25–1:10 — SAFE

Select **Safe action**. Show that policy, evidence, and integrity checks pass; the receipt ID is reproducible; and the UI truthfully labels the proof as local until the real anchor transaction is attached.

## 1:10–1:50 — TAMPERED

Select **Tampered action**. The destination differs from the approved intent. Show `ACTION_HASH_MISMATCH`, `DESTINATION_CHANGED`, and `TARGET_NOT_ALLOWED`; emphasize that no execution path exists.

## 1:50–2:20 — MISSING CONTEXT

Select **Missing context**. The unchanged action still becomes `REVIEW` because required simulation evidence is absent. This is not silently converted into an allow.

## 2:20–2:55 — Monad proof

After owner-approved deployment, show the contract address, SAFE anchor transaction, emitted event, and local reproduction of its hashes. Explain that the chain stores commitments, not private or bulky JSON.

## 2:55–3:00 — close

“AI can explain the outcome. It cannot grade itself.”
