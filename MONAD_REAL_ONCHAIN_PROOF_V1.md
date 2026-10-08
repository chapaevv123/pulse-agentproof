# Monad real onchain proof V1

**Classification:** `REAL_MONAD_ALLOW_RECEIPT_ANCHOR`

Pulse AgentProof has one real, successful `ALLOW` receipt anchor on Monad Testnet. This is an accountability-receipt transaction, not an arbitrary agent action execution.

## Chain record

| Field | Value |
| --- | --- |
| Network | Monad Testnet |
| Chain ID | `10143` |
| Registry | [`0x1607…4Efa`](https://testnet.monadexplorer.com/address/0x1607Af4E1DA1C06362871443d2e95C367B984Efa) |
| Deployment transaction | [`0xeed1…5ba`](https://testnet.monadexplorer.com/tx/0xeed1eaae5777a17aac05676bdc5bca925f1ae3114204c9aa32485eed08ef35ba) |
| Deployment block | `69236960` |
| SAFE receipt transaction | [`0xfa34…cf5d`](https://testnet.monadexplorer.com/tx/0xfa348cb087af2de24df2147270a84702b5b0cf774c5d669b51533f96d50bcf5d) |
| SAFE receipt block | `69237676` |
| Sender | `0x765fb7e6a0BdDDc29f57eeCE34AEda0Fb318805d` |
| Status | `SUCCESS` |
| Verdict | `ALLOW` (`1`) |

## Bound local commitments

| Commitment | Value |
| --- | --- |
| Receipt ID | `0x79a9a5682a2aea39e179de4af0871d50a6b0b07dc507c5b82b299b05547509ec` |
| Agent hash | `0x4e6be90aa268bbd8f3a0fb95205d5015be0c0d3157e4c20c8667d8a9441acf89` |
| Intent hash | `0x9c98af89382980532613c294edfe4b63af12bced206543893611a47885368657` |
| Action hash | `0x6239f17b40740ae2d041f2e5efac314917dbc75c6e87fc035f41f1e664d7d6d9` |
| Policy hash | `0x621db527d576407724d90bb6325414afbbd0c4a48f370f21d3409243d9991708` |
| Evidence hash | `0xc32a09c4928d4b2494059a477bb27a4b4c0c1935f5b7416b6b673b3e79c2a94d` |
| Reason-code hash | `0x518674ab2b227e5f11e9084f615d57663cde47bce1ba168b4c19c7ee22a73d70` |

The local action hash equals the execution-payload hash for the SAFE fixture. The deterministic reason-code list is empty.

## Emitted event recovery

```text
ActionReceiptAnchored(
  receiptId:     0x79a9a5682a2aea39e179de4af0871d50a6b0b07dc507c5b82b299b05547509ec,
  agentId:       0x4e6be90aa268bbd8f3a0fb95205d5015be0c0d3157e4c20c8667d8a9441acf89,
  actionHash:    0x6239f17b40740ae2d041f2e5efac314917dbc75c6e87fc035f41f1e664d7d6d9,
  verdict:       1,
  reasonCodeHash: 0x518674ab2b227e5f11e9084f615d57663cde47bce1ba168b4c19c7ee22a73d70
)
```

Event signature topic:

`0xaf3ec0baaa92e7a34608b17599715683f62f7fa648ce23c5985d95e765ed7cc3`

The complete raw topics and ABI-encoded data are preserved in `MONAD_REAL_ONCHAIN_PROOF_V1.json`.

## Provenance and limits

- Transaction address, hashes, blocks, sender, and success status are owner-supplied verified Monad Testnet records.
- Local commitments are reproduced from `fixtures/safe.json` by the unchanged deterministic verifier and preserved in `safe-receipt.json`.
- Event fields are deterministically recovered from the deployed contract ABI and anchored SAFE calldata. A fresh RPC query was attempted but unavailable from the build sandbox.
- This proof establishes a real receipt anchor. It does **not** claim that AgentProof executed an arbitrary downstream call, and the receipt has no bound execution transaction hash.

