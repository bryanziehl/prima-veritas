// ---------------------------------------------------------------------------
// Prima Veritas OSS — test_kmeans_stability.mjs
// Deterministic KMeans stability test (centroids + assignments).
// Part of the Prima Veritas OSS reproducibility toolkit.
// MIT License.
// ---------------------------------------------------------------------------
//
// Test purpose:
//   Ensure deterministic KMeans produces bit-for-bit identical outputs across
//   repeated runs. This proves:
//     – stable centroid ordering
//     – stable assignment ordering
//     – stable numeric precision
//     – no floating-point drift
//     – no hidden randomness
//
// Method:
//   1. Capture SHA-256 hash of <dataset>_kmeans.json
//   2. Re-run full deterministic pipeline via codice_fullproof.mjs
//   3. Capture second hash
//   4. Compare (must match exactly)
//
// Passing conditions:
//   • No drift in KMeans outputs after a fresh deterministic run.
//   • Any mismatch indicates nondeterminism or unexpected mutation.
//
// Notes for contributors:
//   • Do not modify deterministic_kmeans.mjs without verifying this test.
//   • Any update to normalization or canonical transforms may indirectly
//     shift KMeans results — always re-run golden hash validation.
//   • This test intentionally ignores normalized.json (covered elsewhere).
// ---

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execSync } from "child_process";

const DATASETS = ["iris", "wine"];

function sha256File(pathname) {
  try {
    const buf = fs.readFileSync(pathname);
    return crypto
      .createHash("sha256")
      .update(buf)
      .digest("hex")
      .toUpperCase();
  } catch {
    return null; // missing / unreadable file → fail
  }
}

export async function runKMeansStabilityTest() {
  try {
    for (const ds of DATASETS) {
      const kmeansPath = path.resolve(`./datasets/${ds}/${ds}_kmeans.json`);

      // 1. Initial snapshot
      const firstHash = sha256File(kmeansPath);
      if (!firstHash) return false;

      // 2. Re-run the entire deterministic pipeline (fresh KMeans)
      execSync(`node runners/codice_fullproof.mjs ${ds}`, {
        stdio: "ignore"
      });

      // 3. Second snapshot
      const secondHash = sha256File(kmeansPath);
      if (!secondHash) return false;

      // 4. Compare — any difference indicates nondeterministic drift
      if (firstHash !== secondHash) return false;
    }

    return true;
  } catch {
    return false;
  }
}
