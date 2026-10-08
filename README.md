# Pulse AgentProof

**Deterministic accountability for autonomous AI actions on Monad.**

Pulse AgentProof is a standalone, public-safe hackathon project for Monad Metropolis Track 04 — Trust, Identity & AI Infrastructure. It proves whether an exact proposed blockchain action satisfied an explicit policy and evidence boundary before execution.

> Local MVP status: implementation and simulations only. No wallet is connected, no contract has been broadcast, and placeholders must not be presented as onchain evidence.

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

## Smart contract

`ActionReceiptRegistry` stores immutable decision commitments and emits `ActionReceiptAnchored`. An allowed receipt can later receive a one-time execution transaction hash through `bindExecution`. Large JSON and private context remain offchain.

## Demo scenarios

The UI instantly switches between SAFE (`ALLOW`), TAMPERED (`BLOCK`), and INSUFFICIENT CONTEXT (`REVIEW`). Each fixture passes through the production verifier—no verdict is hard-coded in the interface.

A concise recording sequence is provided in [docs/DEMO.md](docs/DEMO.md).

## Security model

Testnet only. No arbitrary-call executor, private key, automatic spending, or mainnet path is included. Only `ALLOW` receipts may bind execution, and the demo allowlist is explicit. Deployment, transaction broadcast, wallet connection, repository publication, and portal submission remain owner approval gates.

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

No deployment has occurred. Follow [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) only after explicit owner approval. After broadcast, add the verified contract address, deployment transaction, SAFE anchor transaction, and explorer links here.

## Hackathon build disclosure

This repository was created as a new standalone project during the Monad Metropolis hackathon build window. It uses newly written implementation code and general architectural patterns; no private Pulse source, databases, configurations, secrets, owner data, or proprietary files were copied.

## AI tooling disclosure

AI-assisted development tools were used during implementation. They assisted with code generation, review, testing, and documentation; they do not author, own, or control the project.

## External libraries / attribution

The project uses Next.js, React, TypeScript, viem, Vitest, Solidity, Foundry/forge-std, and solc-js under their respective licenses. No third-party visual assets are bundled.

## License

MIT — see [LICENSE](LICENSE).
