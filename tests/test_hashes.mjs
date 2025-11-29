// ---------------------------------------------------------------------------
// Prima Veritas OSS — test_hashes.mjs
// Golden-hash verification for deterministic outputs.
// Part of the Prima Veritas OSS reproducibility toolkit.
// MIT License.
// ---------------------------------------------------------------------------
//
// Test purpose:
//   Validate that the current normalized + KMeans outputs match the official
//   v0.1.0 Golden Hashes exactly, bit-for-bit.
//
// This test guarantees:
//   – No drift since release
//   – No accidental code changes affecting determinism
//   – No environment- or OS-specific variation
//   – Outputs remain fully reproducible
//
// Method:
//   1. Load official Golden Hashes for each dataset
//   2. Compute SHA-256 of the runtime-generated artifacts
//   3. Compare values
//
// Passing conditions:
//   • normalized.json hash = Golden Hash
//   • kmeans.json hash     = Golden Hash
//
// Notes for contributors:
//   • If this test fails, inspect transforms + analytics immediately.
//   • Golden Hashes must only be updated during an approved version bump.
//   • Do not modify this file except to extend datasets or hash utilities.
// ---

import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATASETS = ["iris", "wine"];

const GOLDENS = {
  iris: {
    normalized:
      "EF28EA082C882A3F9379A57E05C929D76E98899E151A6746B07D8D899644372F",
    kmeans:
      "DA96D0505BCB1A5A2B826CEB1AA7C34073CB88CB29AE1236006FA4B0F0D74C46"
  },
  wine: {
    normalized:
      "D4F52AAA1D5F294A3F647DF3198E765D619099888140C96E582663968DCE5756",
    kmeans:
      "8A0B046DD9813282FC108DDA0EA94A0D18F7E7B9E9910A74D8FFBC13EDB6B921"
  }
};

function sha256File(pathname) {
  try {
    const buf = fs.readFileSync(pathname);
    return crypto
      .createHash("sha256")
      .update(buf)
      .digest("hex")
      .toUpperCase();
  } catch {
    return null; // triggers test failure
  }
}

export async function runHashTest() {
  try {
    for (const ds of DATASETS) {
      const base = path.resolve(`./datasets/${ds}`);

      const normPath = `${base}/${ds}_normalized.json`;
      const kmeansPath = `${base}/${ds}_kmeans.json`;

      const normHash = sha256File(normPath);
      const kmeansHash = sha256File(kmeansPath);

      if (normHash !== GOLDENS[ds].normalized) return false;
      if (kmeansHash !== GOLDENS[ds].kmeans) return false;
    }

    return true;
  } catch {
    return false;
  }
}
