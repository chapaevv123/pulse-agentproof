# Architecture

Pulse AgentProof places a deterministic verification boundary between an agent proposal and an EVM transaction.

```text
raw intent ──► canonical normalization ──► intent/action hashes
                                              │
policy + evidence ──► deterministic checks ───┤
                                              ▼
                                    ALLOW / BLOCK / REVIEW
                                              │
                                 reproducible local receipt
                                              │ ALLOW only
                                              ▼
                                   Monad receipt anchor
                                              │ optional approved execution
                                              ▼
                                  execution transaction binding
```

## Trust boundaries

The agent can propose an action and supply context. It cannot choose the verdict. The TypeScript verifier applies exact checks over canonical data and emits stable hashes and reason codes. The registry stores compact immutable anchors; it does not interpret policy and cannot make an unsafe proposal safe.

## Components

- `src/agentproof`: canonical schema, serializer, verifier, receipt builder, and contract encoder.
- `fixtures`: the three auditable demo inputs.
- `contracts/ActionReceiptRegistry.sol`: permissionless decision anchors plus one-time execution binding.
- `app`: a local-first Next.js demonstration using the same verifier library.
- `script`: Foundry deployment and anchoring scripts, deliberately requiring an explicit wallet at invocation time.

## Data separation

Raw agent intent, normalized action, policy snapshot, evidence set, hashes, verdict, reason codes, anchor transaction, optional execution transaction, and final receipt are distinct fields. Large JSON stays offchain; only cryptographic commitments and compact verdict metadata are stored onchain.

