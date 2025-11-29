#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Prima Veritas OSS — FITGEN Runtime Digest Builder
// Part of the Prima Veritas reproducibility toolkit.
// MIT License.
// ---------------------------------------------------------------------------
//
// Purpose:
//   Combine all digest_*.txt files under /reports/digests/ into a single
//   FITGEN_RUNTIME_DIGEST.json artifact. This provides a stable, auditable
//   record of multiple runs, useful for:
//
//     • Reproducibility metadata
//     • Multi-run comparison
//     • Audit trails and verification packets
//     • External reviewers validating consistency
//
// Determinism Notes:
//   - This tool performs no random operations.
//   - File order is deterministic (lexicographic from readdirSync).
//   - No timestamps or machine-specific values are introduced.
//   - Output is stable across systems when digest inputs are identical.
//
// Contributor Guidance:
//   Keep this utility minimal and transparent.
//   Do not add non-deterministic fields, timestamps, or environment metadata.
// ---------------------------------------------------------------------------


import fs from "fs";
import path from "path";

const digestsDir = path.resolve("./reports/digests");
const outPath    = path.resolve("./reports/FITGEN_RUNTIME_DIGEST.json");

// Ensure directory exists
if (!fs.existsSync(digestsDir)) {
  console.error(`❌ No digests found: ${digestsDir}`);
  process.exit(1);
}

const files = fs.readdirSync(digestsDir).filter(f => f.startsWith("digest_"));

if (files.length === 0) {
  console.error("❌ No digest files found.");
  process.exit(1);
}

let entries = [];

for (const file of files) {
  const fp = path.join(digestsDir, file);
  const content = fs.readFileSync(fp, "utf8");

  entries.push({
    file,
    content
  });
}

// Emit final combined digest
fs.writeFileSync(outPath, JSON.stringify(entries, null, 2));

console.log(`✔ Combined digest written → ${outPath}`);
