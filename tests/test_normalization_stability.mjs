// ---------------------------------------------------------------------------
// Prima Veritas OSS — test_normalization_stability.mjs
// Deterministic normalization stability test (canonical JSON output).
// Part of the Prima Veritas OSS reproducibility toolkit.
// MIT License.
// ---------------------------------------------------------------------------
//
// Test purpose:
//   Ensure deterministic normalization produces bit-for-bit identical
//   normalized JSON across reruns. This proves:
//     – stable key ordering
//     – stable numeric coercion
//     – stable string trimming
//     – no dataset-specific branching
//     – no locale or environment drift
//
// Method:
//   1. Capture SHA-256 of <dataset>_normalized.json
//   2. Re-run full deterministic pipeline
//   3. Capture second hash
//   4. Compare hashes — must match exactly
//
// Passing conditions:
//   • No changes to canonical JSON after a fresh normalization pass.
//   • Any mismatch indicates nondeterministic transforms or drift.
//
// Notes for contributors:
//   • canonical_transform.mjs and deterministic_normalize.mjs must remain
//     pure, stateless, and dataset-agnostic.
//   • Any normalization change MUST be validated by golden hash matching.
//   • This test is intentionally isolated from KMeans logic (covered elsewhere).
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
    return null; // missing file → fail
  }
}

export async function runNormalizationStabilityTest() {
  try {
    for (const ds of DATASETS) {
      const normalizedPath = path.resolve(
        `./datasets/${ds}/${ds}_normalized.json`
      );

      // 1. Initial hash snapshot
      const firstHash = sha256File(normalizedPath);
      if (!firstHash) return false;

      // 2. Re-run deterministic pipeline (fresh normalization)
      execSync(`node runners/codice_fullproof.mjs ${ds}`, {
        stdio: "ignore" // test suite remains clean
      });

      // 3. Second hash snapshot
      const secondHash = sha256File(normalizedPath);
      if (!secondHash) return false;

      // 4. Compare — any drift means nondeterministic behavior
      if (firstHash !== secondHash) return false;
    }

    return true;
  } catch {
    return false;
  }
}
