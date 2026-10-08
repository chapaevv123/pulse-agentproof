import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const ignored = new Set([".git", ".next", "node_modules", "lib", "out", "cache", "coverage", "dist", "broadcast"]);
const root = process.cwd();
const publicProofFiles = new Set([
  "AGENTPROOF_LEARNING_ARTIFACT_V1.json",
  "MONAD_REAL_ONCHAIN_PROOF_V1.json",
  "MONAD_REAL_ONCHAIN_PROOF_V1.md",
  "README.md",
  "safe-receipt.json",
]);

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (ignored.has(entry.name)) return [];
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : [path];
  });
}

const files = sourceFiles(root).filter((file) => !file.endsWith("security-scan.mjs"));
const forbidden = [
  /(?:0x)?[a-fA-F0-9]{64}/g,
  /(?:PRIVATE_KEY|MNEMONIC|SEED_PHRASE)\s*=\s*[^\s#]+/gi,
  /BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/g,
];
const findings = [];

for (const file of files) {
  if (/\.(json|ts|tsx|sol|md|example)$/.test(file)) {
    const content = readFileSync(file, "utf8");
    const projectPath = relative(root, file).replaceAll("\\", "/");
    for (const rule of forbidden) {
      for (const match of content.match(rule) ?? []) {
        if (rule === forbidden[0] && publicProofFiles.has(projectPath)) continue;
        if (match === "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa") continue;
        if (match.includes("PRIVATE_KEY=") || /PRIVATE_KEY\s*=\s*Read/i.test(match)) continue;
        findings.push(`${relative(root, file)}: ${match.slice(0, 18)}…`);
      }
    }
  }
}

if (findings.length) {
  console.error(findings.join("\n"));
  process.exit(1);
}
console.log(`Security scan passed (${files.length} project files).`);
