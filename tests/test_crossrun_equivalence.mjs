// ---------------------------------------------------------------------------
// Prima Veritas OSS — test_crossrun_equivalence.mjs
// Deterministic cross-run reproducibility validation.
// Part of the Prima Veritas OSS reproducibility toolkit.
// MIT License.
// ---------------------------------------------------------------------------
//
// Test purpose:
//   Ensure that *fresh re-execution* of the full deterministic pipeline
//   produces bit-for-bit identical outputs to a previous run.
//
// This test validates:
//   – Deterministic normalization
//   – Deterministic KMeans analytics
//   – Stable JSON write formatting
//   – No drift introduced between runs
//
// Method:
//   1. Read SHA-256 of existing normalized + kmeans outputs
//   2. Re-run the entire deterministic pipeline (codice_fullproof.mjs)
//   3. Re-hash outputs
//   4. Verify hashes match exactly
//
// Passing this test confirms:
//   • No floating-point drift
//   • No environment-specific side effects
//   • No nondeterministic iteration or ordering
//
// Notes for contributors:
//   • Do not alter deterministic write functions without justification.
//   • No logging changes, timestamps, or side effects allowed.
//   • This file must remain minimal and fully auditable.
// ---

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execSync } from "child_process";

const DATASETS = ["iris", "wine"];

function sha256File(pathname) {
  try {
    const buf = fs.readFileSync(pathname);
    return crypto.createHash("sha256").update(buf).digest("hex").toUpperCase();
  } catch {
    return null;
  }
}

export async function runCrossrunEquivalenceTest() {
  try {
    for (const ds of DATASETS) {
      const datasetDir = path.resolve(`./datasets/${ds}`);
      const normPath = path.join(datasetDir, `${ds}_normalized.json`);
      const kmeansPath = path.join(datasetDir, `${ds}_kmeans.json`);

      // 1. Capture initial hashes
      const norm1 = sha256File(normPath);
      const km1 = sha256File(kmeansPath);
      if (!norm1 || !km1) return false;

      // 2. Re-run full deterministic pipeline (fresh run)
      execSync(`node runners/codice_fullproof.mjs ${ds}`, {
        stdio: "ignore"
      });

      // 3. Capture hashes again
      const norm2 = sha256File(normPath);
      const km2 = sha256File(kmeansPath);
      if (!norm2 || !km2) return false;

      // 4. Must match bit-for-bit
      if (norm1 !== norm2) return false;
      if (km1 !== km2) return false;
    }

    return true;
  } catch {
    return false;
  }
}
