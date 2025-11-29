#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Prima Veritas OSS — run_tests.mjs
// Master deterministic validation suite (MIT License).
// v0.1.0 canonical reproducibility tests.
// ---------------------------------------------------------------------------
//
// Purpose:
//   Execute the full deterministic test suite in strict, predictable order:
//     1. Golden Hash Matching
//     2. Normalization Stability
//     3. KMeans Stability
//     4. Cross-Run Equivalence
//
//   A zero-failure run confirms that this environment reproduces the official
//   Prima Veritas OSS v0.1.0 golden artifacts *bit-for-bit*.
//
// Determinism Requirements:
//   • Pure modules, side-effect free except controlled reads
//   • No timestamps or debug noise
//   • No randomness, nondeterministic branching, or external state
//   • Stable reporting across machines, CPUs, and Docker environments
//
// Notes for Contributors:
//   Keep this orchestrator minimal, auditable, and reproducibility-focused.
//   Any nondeterminism introduced here invalidates the entire suite.
// ---------------------------------------------------------------------------


import { runHashTest } from "./test_hashes.mjs";
import { runNormalizationStabilityTest } from "./test_normalization_stability.mjs";
import { runKMeansStabilityTest } from "./test_kmeans_stability.mjs";
import { runCrossrunEquivalenceTest } from "./test_crossrun_equivalence.mjs";

console.log("=== Prima Veritas OSS — Full Deterministic Test Suite ===\n");

let failures = 0;

async function execute(name, fn) {
  process.stdout.write(`→ ${name} ... `);
  const ok = await fn();
  if (ok) {
    console.log("PASS");
  } else {
    console.log("FAIL");
    failures++;
  }
}

await execute("Golden Hash Matching", runHashTest);
await execute("Normalization Stability (double-run)", runNormalizationStabilityTest);
await execute("KMeans Stability (centroids + assignments)", runKMeansStabilityTest);
await execute("Cross-Run Equivalence (fresh runs)", runCrossrunEquivalenceTest);

console.log("\n=== Test Suite Summary ===");

if (failures === 0) {
  console.log("✔ All deterministic tests passed.\n");
  process.exit(0);
} else {
  console.log(`❌ ${failures} test(s) failed.\n`);
  console.log("Review directories for mismatches:");
  console.log("  • datasets/<dataset>/       ← normalized + kmeans outputs");
  console.log("  • reports/                  ← FITGEN runtime digest");
  console.log("  • digests/                  ← golden reference files\n");

  console.log("Re-run the suite with:");
  console.log("  node tests/run_tests.mjs\n");

  console.log("Or run dataset manually:");
  console.log("  docker run --rm prima-veritas-oss iris");
  console.log("  docker run --rm prima-veritas-oss wine\n");

  process.exit(1);
}
