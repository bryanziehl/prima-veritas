tests — Deterministic Test Suite

This directory contains the full deterministic validation suite for Prima Veritas OSS.
Each test verifies a different stage of the ingest → normalize → analyze reproducibility chain.

Contents
tests/
  run_tests.mjs
  test_hashes.mjs
  test_normalization_stability.mjs
  test_kmeans_stability.mjs
  test_crossrun_equivalence.mjs

Purpose

The test suite ensures the Prima Veritas OSS pipeline produces bit-for-bit identical outputs across machines, operating systems, and runtime environments.

Every test must pass before publishing or tagging a new version.

Test Descriptions
test_hashes.mjs

Compares normalized and KMeans outputs for each dataset against the official v0.1.0 golden SHA-256 hashes.

test_normalization_stability.mjs

Runs normalization twice and checks that:

<dataset>_normalized.json


is byte-for-byte identical between runs.

test_kmeans_stability.mjs

Verifies that deterministic KMeans produces stable:

centroid arrays

assignment arrays

No drift is allowed across reruns.

test_crossrun_equivalence.mjs

Runs the full deterministic pipeline twice and ensures both:

<dataset>_normalized.json
<dataset>_kmeans.json


remain unchanged across passes.

run_tests.mjs

The suite orchestrator. Produces a clean summary and returns:

0 → all tests passed

1 → at least one failure

Used for automated CI-style verification.

Usage
Native
node tests/run_tests.mjs

Docker (recommended)
docker run --rm --entrypoint node prima-veritas-oss tests/run_tests.mjs

Artifacts Verified

The suite inspects:

datasets/<dataset>/<dataset>_normalized.json
datasets/<dataset>/<dataset>_kmeans.json
reports/FITGEN_RUNTIME_DIGEST.json
digests/                      ← canonical golden reference files

Notes

All tests must pass before releasing or tagging a new version.

Users must not modify:

dataset outputs

golden digest files

FITGEN runtime digest

canonical normalized/KMeans JSON files

Any modification to these artifacts breaks determinism and invalidates the release.