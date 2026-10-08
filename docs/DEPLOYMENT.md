# Monad Testnet deployment runbook

This runbook is preparation only. Do not broadcast until the owner explicitly approves the dedicated test-wallet use.

## Preconditions

1. Install Foundry from its official distribution and run `forge install foundry-rs/forge-std --no-commit`.
2. Create a dedicated hackathon test wallet in Foundry's encrypted keystore with `cast wallet import agentproof-deployer --interactive`. Enter the key only at the hidden local prompt.
3. Fund that address with testnet MON from the current official Monad faucet.
4. Keep the private key out of files, shell history, environment variables, and chat.
5. Confirm `MONAD_RPC_URL=https://testnet-rpc.monad.xyz` and chain ID `10143`.

## Owner-approved commands

```powershell
$env:MONAD_RPC_URL = "https://testnet-rpc.monad.xyz"
forge script script/Deploy.s.sol:DeployActionReceiptRegistry --rpc-url $env:MONAD_RPC_URL --account agentproof-deployer --sender <DEDICATED_TEST_WALLET_ADDRESS> --broadcast
```

Record the deployed address and deployment transaction hash. Set `NEXT_PUBLIC_REGISTRY_ADDRESS` locally. Generate the SAFE receipt calldata with `npm run receipt:safe`, inspect every field, then submit `anchorReceipt` with Cast or a hardware/browser wallet only after a second explicit approval. Query the emitted `ActionReceiptAnchored` event and save the explorer links for the README.

No mainnet configuration or automatic spending path exists in this repository.
