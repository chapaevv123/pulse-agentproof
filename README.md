# Pulse AgentProof

**Deterministic accountability for autonomous AI actions on Monad.**

Pulse AgentProof is a standalone, public-safe hackathon project for Monad Metropolis Track 04 — Trust, Identity & AI Infrastructure. It proves whether an exact proposed blockchain action satisfied an explicit policy and evidence boundary before execution.

> Real proof status: `ActionReceiptRegistry` is deployed on Monad Testnet and the first deterministic SAFE receipt has been anchored successfully. No arbitrary agent action was executed by that anchor.

## Problem

An AI agent can claim an action is safe, but that claim does not prove what it intended, what evidence it used, whether the payload changed, or why execution was allowed. AgentProof turns those questions into deterministic, reproducible commitments.

## Why deterministic verification

The same canonical input always produces the same normalized action, hashes, verdict, reason codes, and receipt ID. An LLM may propose or explain an action, but it never decides `ALLOW`, `BLOCK`, or `REVIEW`.

## Architecture

The flow is: raw intent → normalized action → policy and evidence checks → verdict → local receipt → Monad anchor → optional approved execution → post-execution binding. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## ALLOW / BLOCK / REVIEW

- `ALLOW`: complete context and policy compliance; eligible for anchoring and separately approved execution.
- `BLOCK`: a policy or intent/payload integrity failure; execution must not occur.
- `REVIEW`: required policy or evidence context is absent or version-incompatible; execution must not occur.

## Monad integration

The registry targets Monad Testnet (`chainId 10143`) and uses its EVM compatibility for standard Solidity, Foundry, and viem workflows. A compact receipt anchor makes the chain part of the accountability boundary rather than a decorative log. Monad's fast-confirming, low-friction environment is a practical fit for frequent agent decisions; this project makes no unsupported performance claims.

The deterministic verifier runs locally, commits the normalized intent, action, policy, evidence, verdict, and reason codes to hashes, and encodes those exact commitments for `ActionReceiptRegistry`. Monad then provides the durable public timestamp, emitting account, block context, and immutable event record. The complete machine-readable proof is in [`MONAD_REAL_ONCHAIN_PROOF_V1.json`](MONAD_REAL_ONCHAIN_PROOF_V1.json), with a human-readable audit record in [`MONAD_REAL_ONCHAIN_PROOF_V1.md`](MONAD_REAL_ONCHAIN_PROOF_V1.md).

### Real Monad Testnet proof

| Record | Value |
| --- | --- |
| Registry contract | [`0x1607Af4E1DA1C06362871443d2e95C367B984Efa`](https://testnet.monadexplorer.com/address/0x1607Af4E1DA1C06362871443d2e95C367B984Efa) |
| Deployment transaction | [`0xeed1eaae5777a17aac05676bdc5bca925f1ae3114204c9aa32485eed08ef35ba`](https://testnet.monadexplorer.com/tx/0xeed1eaae5777a17aac05676bdc5bca925f1ae3114204c9aa32485eed08ef35ba) |
| First real ALLOW receipt | [`0xfa348cb087af2de24df2147270a84702b5b0cf774c5d669b51533f96d50bcf5d`](https://testnet.monadexplorer.com/tx/0xfa348cb087af2de24df2147270a84702b5b0cf774c5d669b51533f96d50bcf5d) |
| Receipt block | `69237676` |
| Proof classification | `REAL_MONAD_ALLOW_RECEIPT_ANCHOR` |

This transaction anchors the verifier's accountability receipt. It is not an arbitrary-call execution transaction. The receipt's `executionTxHash` remains unbound, and the project does not claim that a downstream agent action was executed.

## Smart contract

`ActionReceiptRegistry` stores immutable decision commitments and emits `ActionReceiptAnchored`. An allowed receipt can later receive a one-time execution transaction hash through `bindExecution`. Large JSON and private context remain offchain.

## Demo scenarios

The UI instantly switches between SAFE (`ALLOW`), TAMPERED (`BLOCK`), and INSUFFICIENT CONTEXT (`REVIEW`). Each fixture passes through the production verifier—no verdict is hard-coded in the interface.

A concise recording sequence is provided in [docs/DEMO.md](docs/DEMO.md).

## Security model

Testnet only. No arbitrary-call executor, private key, automatic spending, or mainnet path is included. Only `ALLOW` receipts may bind execution, and the demo allowlist is explicit. Any additional transaction broadcast, wallet connection, repository publication, or portal submission remains an owner approval gate.

## What AgentProof does NOT guarantee

It does not prove evidence is objectively true, secure an agent's host, predict contract behavior, replace wallet simulation, prevent key compromise, or guarantee that an approved downstream contract is safe. It proves that specified deterministic checks produced a verdict for exact committed inputs.

## Local setup

Requirements: Node.js 20+ and npm. Foundry is optional for Solidity-native tests and required for deployment.

```bash
npm install
npm test
npm run dev
```

Copy `.env.example` to `.env.local` only when local chain configuration is needed. Never add secrets.

## Tests

`npm test` covers deterministic normalization and hashing, exact scenario verdicts/reasons, receipt reproduction, ABI encoding, Solidity compilation, chain configuration, frontend scenario rendering, and repository safety checks. With Foundry installed, run `forge test -vvv` for native contract tests.

## Deployment

The registry and first SAFE receipt anchor are deployed at the addresses above. The runbook in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) remains available for reproducibility, but no further broadcast is authorized by this documentation update.

## Hackathon build disclosure

This repository was created as a new standalone project during the Monad Metropolis hackathon build window. It uses newly written implementation code and general architectural patterns; no private Pulse source, databases, configurations, secrets, owner data, or proprietary files were copied.

## AI tooling disclosure

AI-assisted development tools were used during implementation. They assisted with code generation, review, testing, and documentation; they do not author, own, or control the project.

## External libraries / attribution

The project uses Next.js, React, TypeScript, viem, Vitest, Solidity, Foundry/forge-std, and solc-js under their respective licenses. No third-party visual assets are bundled.

## License

MIT — see [LICENSE](LICENSE).
