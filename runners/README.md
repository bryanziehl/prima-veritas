runners — Deterministic Pipeline Orchestrators

This directory contains the core orchestrator modules that execute the Prima Veritas OSS deterministic ingest → normalize → analyze pipeline.
Each module is responsible for a sealed, bit-for-bit reproducible stage of the workflow.

Included Modules
codice_fullproof.mjs

The master orchestrator.
Drives the full deterministic pipeline end-to-end.

Responsibilities:

Load raw CSV (via fixed container paths)

Apply deterministic normalization

Dispatch deterministic analytics (KMeans, future modules)

Write canonical outputs to datasets/<dataset>/

Enforce strict reproducibility at every stage

This is the primary entrypoint invoked by:
docker/run_fullproof.sh

deterministic_normalize.mjs

Dataset-agnostic, deterministic normalizer.

Performs:

Lexicographic field sorting

Canonical transforms (via transforms/)

Stable numeric coercion

Null normalization

Deterministic JSON output

This step ensures all downstream analytics receive canonical, bit-stable input.

deterministic_kmeans.mjs

Zero-entropy KMeans implementation.

Guarantees:

Deterministic centroid initialization

Stable assignment/iteration order

Stable centroid update order

Deterministic float math

Canonical JSON output (via writeDeterministicJSON)

Used internally via deterministic wrapper helpers.

analytics_utils.mjs

Shared deterministic math utilities used by analytics modules.

Includes:

Deterministic matrix extraction

Deterministic transpose

Deterministic dot/multiply helpers

Designed for extension (PCA, HCLUST, regression, etc.) while preserving reproducibility.

Notes

All runners must remain pure and deterministic.

No randomness, async drift, timestamps, locale influence, or multi-thread nondeterminism is permitted.

No dataset-specific hacks; all transforms must be generic.

Any modification affecting outputs must follow the RELEASE_TAGS.md versioning rules.