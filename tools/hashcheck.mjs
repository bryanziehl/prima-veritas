#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Prima Veritas OSS — hashcheck.mjs
// Deterministic golden-hash validator (MIT License).
// v0.1.0 canonical reproducibility verification.
// ---------------------------------------------------------------------------
//
// Purpose:
//   Validate that the normalized and KMeans outputs for a dataset match the
//   official Prima Veritas OSS v0.1.0 golden artifacts *bit-for-bit*.
//
// Usage:
//     node tools/hashcheck.mjs iris
//     node tools/hashcheck.mjs wine
//
// Determinism Requirements:
//   • Perfect SHA-256 equality confirms end-to-end reproducibility.
//   • No timestamps, random seeds, or environment-dependent drift.
//   • Results must match across Docker, native Node, CPU architectures, and OS.
//
// Notes for Contributors:
//   • File paths, hashing, and comparisons must remain stable.
//   • Do NOT introduce debug noise, timestamps, async ops, or dynamic logic.
//   • Any change that alters JSON formatting or file ordering invalidates
//     this utility and must be rejected.
// ---------------------------------------------------------------------------

import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATASETS = ["iris", "wine"];

// ---------------------------------------------------------------------------
// Golden SHA-256 hashes for v0.1.0
// ---------------------------------------------------------------------------
const GOLDEN = {
  iris: {
    normalized: "EF28EA082C882A3F9379A57E05C929D76E98899E151A6746B07D8D899644372F",
    kmeans:     "DA96D0505BCB1A5A2B826CEB1AA7C34073CB88CB29AE1236006FA4B0F0D74C46"
  },
  wine: {
    normalized: "D4F52AAA1D5F294A3F647DF3198E765D619099888140C96E582663968DCE5756",
    kmeans:     "8A0B046DD9813282FC108DDA0EA94A0D18F7E7B9E9910A74D8FFBC13EDB6B921"
  }
};

// ---------------------------------------------------------------------------
// Dataset argument parsing
// ---------------------------------------------------------------------------
const dataset = process.argv[2];
if (!dataset || !DATASETS.includes(dataset)) {
  console.error("Usage: node tools/hashcheck.mjs <iris|wine>");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Construct expected file paths
// ---------------------------------------------------------------------------
const base = path.resolve("datasets", dataset);
const files = {
  normalized: path.join(base, `${dataset}_normalized.json`),
  kmeans:     path.join(base, `${dataset}_kmeans.json`)
};

// ---------------------------------------------------------------------------
// SHA-256 file hashing
// ---------------------------------------------------------------------------
function sha256File(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const data = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(data).digest("hex").toUpperCase();
}

// ---------------------------------------------------------------------------
// Output header
// ---------------------------------------------------------------------------
console.log(`\n=== Prima Veritas OSS — Hash Check (${dataset}) ===\n`);

let allMatch = true;

// ---------------------------------------------------------------------------
// Comparison loop
// ---------------------------------------------------------------------------
for (const key of ["normalized", "kmeans"]) {
  const expected = GOLDEN[dataset][key];
  const actual = sha256File(files[key]);

  if (actual === null) {
    console.log(`${key.padEnd(12)} → ❌ File missing: ${files[key]}`);
    allMatch = false;
    continue;
  }

  const match = actual === expected ? "✔ MATCH" : "❌ MISMATCH";
  if (actual !== expected) allMatch = false;

  console.log(`${key.padEnd(12)} → ${match}`);
  console.log(`  Expected: ${expected}`);
  console.log(`  Actual:   ${actual}\n`);
}

// ---------------------------------------------------------------------------
// Final Result
// ---------------------------------------------------------------------------
if (!allMatch) {
  console.log("❌ Hashcheck FAILED — outputs differ from golden hashes.\n");
  process.exit(1);
}

console.log("✔ Hashcheck PASSED — outputs match golden hashes.\n");
process.exit(0);
