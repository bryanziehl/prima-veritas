// ---------------------------------------------------------------------------
// Prima Veritas OSS — codice_fullproof.mjs (v0.1.0)
// Root deterministic orchestrator: ingest → normalize → analytics → outputs
// MIT License.
// ---------------------------------------------------------------------------
//
// Purpose:
//   This file drives the complete deterministic normalization + analytics
//   pipeline for Prima Veritas OSS. It guarantees *identical output* across:
//
//       - Docker container execution
//       - Native Windows / macOS / Linux
//       - Any CPU architecture
//
//   The orchestrator selects paths dynamically via path_resolver.mjs:
//       Docker → /app/datasets/<dataset>/...
//       Local  → <repo>/datasets/<dataset>/...
//
// Responsibilities:
//   • Load raw CSV deterministically
//   • Normalize using canonical field + transform rules
//   • Apply deterministic analytics (v0.1: KMeans)
//   • Emit fully reproducible JSON artifacts
//
// Determinism Guarantees:
//   • No randomness, no timestamps, no OS-dependent behavior
//   • Fixed-order transform pipeline
//   • Canonical centroid ordering
//   • Stable JSON indentation and key ordering
//
// Notes for Contributors:
//   • KEEP THIS FILE MINIMAL — no heuristics, no dataset-specific hacks.
//   • ANY new dataset must follow identical raw → normalized → analytics flow.
//   • DO NOT weaken determinism guarantees under any circumstance.
//
// ---------------------------------------------------------------------------

import fs from "fs";
import path from "path";

import {
  deterministicNormalize,
  writeDeterministicJSON
} from "./deterministic_normalize.mjs";

import { runKMeansFile } from "./deterministic_kmeans.mjs";

// NEW: correct import (plural)
import { resolveDatasetPaths } from "./path_resolver.mjs";

const DATASETS = ["iris", "wine"];

// ------------------------------------------------------------
// Load raw CSV deterministically
// ------------------------------------------------------------
function loadRawCSV(dataset) {
  const paths = resolveDatasetPaths(dataset);
  const rawPath = paths.raw;

  if (!fs.existsSync(rawPath)) {
    console.error(`❌ Raw dataset missing: ${rawPath}`);
    process.exit(1);
  }

  return fs.readFileSync(rawPath, "utf8");
}

// ------------------------------------------------------------
// Write normalized JSON deterministically
// ------------------------------------------------------------
function writeNormalized(dataset, normalized) {
  const paths = resolveDatasetPaths(dataset);
  const outPath = paths.normalized;

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  writeDeterministicJSON(outPath, normalized);

  console.log(`✔ Normalized → ${outPath}`);
  return outPath;
}

// ------------------------------------------------------------
// Deterministic Analytics
// ------------------------------------------------------------
async function runAnalytics(dataset) {
  console.log(`\n[Analytics] Running deterministic KMeans for: ${dataset}`);

  await runKMeansFile(dataset, 3);

  const paths = resolveDatasetPaths(dataset);
  const outPath = paths.kmeans;

  console.log(`[Analytics] ✔ KMeans complete → ${outPath}`);
}

// ------------------------------------------------------------
// Main Orchestrator
// ------------------------------------------------------------
async function main() {
  const dataset = process.argv[2];

  if (!dataset || !DATASETS.includes(dataset)) {
    console.error("Usage: node runners/codice_fullproof.mjs <iris|wine>");
    process.exit(1);
  }

  console.log(`\n=== Prima Veritas OSS — FullProof Runner (v0.1.1) ===`);
  console.log(`Dataset: ${dataset}`);
  console.log("----------------------------------------");

  // 1. Load raw CSV
  const csvText = loadRawCSV(dataset);

  // 2. Normalize deterministically
  const normalized = deterministicNormalize(csvText);
  writeNormalized(dataset, normalized);

  // 3. Run analytics
  await runAnalytics(dataset);

  console.log("\n✔ FullProof pipeline complete.\n");
}

main();
