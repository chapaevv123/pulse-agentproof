import { getAddress, keccak256, toHex, type Hex } from "viem";
import type { ActionInput, NormalizedAction } from "./types";

function normalizeJson(value: unknown): unknown {
  if (value === null || typeof value === "boolean" || typeof value === "string") return value;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("Non-finite numbers are not canonical");
    return value;
  }
  if (typeof value === "bigint") return value.toString(10);
  if (Array.isArray(value)) return value.map(normalizeJson);
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, item]) => item !== undefined)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, normalizeJson(item)]),
    );
  }
  throw new Error(`Unsupported canonical value: ${typeof value}`);
}

export function canonicalize(value: unknown): string {
  return JSON.stringify(normalizeJson(value));
}

export function hashCanonical(value: unknown): Hex {
  return keccak256(toHex(canonicalize(value)));
}

export function normalizeAction(action: ActionInput): NormalizedAction {
  if (!Number.isSafeInteger(action.chain_id) || action.chain_id <= 0) throw new Error("Invalid chain_id");
  const value = BigInt(action.value);
  if (value < 0n) throw new Error("Action value cannot be negative");
  const method = action.function.trim();
  if (!method) throw new Error("Action function is required");
  return {
    chainId: action.chain_id,
    to: getAddress(action.to).toLowerCase() as `0x${string}`,
    value: value.toString(10),
    method,
    args: normalizeJson(action.args) as readonly unknown[],
  };
}

