// ---------------------------------------------------------------------------
// Prima Veritas OSS — codice_fullproof.mjs
// Root deterministic orchestrator: ingest → normalize → analytics → outputs
// MIT License.
// ---------------------------------------------------------------------------
//
// Purpose:
//   This is the top-level deterministic pipeline driver for Prima Veritas OSS.
//   It performs the complete, reproducible chain:
//
//       raw CSV → canonical normalization → deterministic analytics → outputs
//
//   The output is guaranteed to be *bit-for-bit identical* across machines,
//   operating systems, and CPU architectures when executed inside Docker.
//
// Responsibilities:
//   • Load each dataset’s raw CSV (absolute, container-stable paths).
//   • Normalize deterministically using canonical field rules.
//   • Apply dataset-agnostic canonical transforms.
//   • Run deterministic analytics (v0.1: KMeans).
//   • Emit fully stable artifacts into /app/datasets/<dataset>/.
//
// Determinism Guarantees:
//   • No randomness or non-deterministic branching.
//   • No reliance on wall-clock time or locale settings.
//   • CSV parsing, transforms, feature extraction, and analytics are all
//     fixed-order and stateless.
//   • Output filenames, JSON formatting, and centroid ordering are canonical.
//
// Notes for Contributors:
//   • This file defines pipeline structure only — keep it minimal,
//     predictable, and data-agnostic.
//   • Never introduce auto-detection heuristics or dynamic dataset logic.
//   • All analytics modules must remain deterministic and pure.
//   • Any expansion (additional algorithms, transforms, or datasets)
//     must maintain reproducibility and avoid environment leakage.
//
//

import fs from "fs";
import path from "path";

import {
  deterministicNormalize,
  writeDeterministicJSON
} from "./deterministic_normalize.mjs";

import { canonicalTransform } from "../transforms/canonical_transform.mjs";

// Deterministic KMeans module
import { runKMeansFile } from "./deterministic_kmeans.mjs";

const DATASETS = ["iris", "wine"];

// ------------------------------------------------------------
// Numeric matrix extractor (used only for future analytics)
// ------------------------------------------------------------
function extractNumericMatrix(normalizedRows) {
  return normalizedRows.map(r =>
    Object.values(r).filter(v => typeof v === "number")
  );
}

// ------------------------------------------------------------
// Load raw CSV  (ABSOLUTE PATHS → /app/datasets/...)
// ------------------------------------------------------------
function loadRawCSV(dataset) {
  const rawPath = path.join("/app", "datasets", dataset, `${dataset}_raw.csv`);
  if (!fs.existsSync(rawPath)) {
    console.error(`❌ Raw dataset missing: ${rawPath}`);
    process.exit(1);
  }
  return fs.readFileSync(rawPath, "utf8");
}

// ------------------------------------------------------------
// Write normalized JSON (ABSOLUTE PATHS)
// ------------------------------------------------------------
function writeNormalized(dataset, normalized) {
  const outPath = path.join(
    "/app",
    "datasets",
    dataset,
    `${dataset}_normalized.json`
  );

  writeDeterministicJSON(outPath, normalized);
  console.log(`✔ Normalized → ${outPath}`);
}

// ------------------------------------------------------------
// Deterministic Analytics
// ------------------------------------------------------------
async function runAnalytics(dataset) {
  console.log(`\n[Analytics] Running deterministic KMeans for: ${dataset}`);

  await runKMeansFile(dataset, 3);

  console.log(
    `[Analytics] ✔ KMeans complete → /app/datasets/${dataset}/${dataset}_kmeans.json`
  );
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

  console.log(`\n=== Codice OSS v0.1 FullProof Runner ===`);
  console.log(`Dataset: ${dataset}`);
  console.log("----------------------------------------");

  // 1. Load raw CSV
  const csvText = loadRawCSV(dataset);

  // 2. Normalize deterministically
  const normalized = deterministicNormalize(csvText);
  writeNormalized(dataset, normalized);

  // 3. Run analytics (deterministic)
  await runAnalytics(dataset);

  console.log("✔ FullProof pipeline complete.\n");
}

main();
