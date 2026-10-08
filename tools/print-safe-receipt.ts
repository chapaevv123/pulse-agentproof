import safe from "../fixtures/safe.json";
import { encodeAnchorReceipt } from "../src/agentproof/contract";
import { verify } from "../src/agentproof/verifier";
import type { VerificationInput } from "../src/agentproof/types";

const receipt = verify(safe as VerificationInput);
console.log(JSON.stringify({ receipt, anchorCalldata: encodeAnchorReceipt(receipt) }, null, 2));

